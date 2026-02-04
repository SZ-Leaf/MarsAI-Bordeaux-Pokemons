import path from 'path';
import { uploadVideo, uploadThumbnail, uploadCaptions } from '../../services/youtube.services.js';
import { findSubmissionById, updateYoutubeLinkInDatabase } from '../../models/submissions/submissions.model.js';
import { getTagsBySubmissionId } from '../../models/tags/submissions_tags.model.js';
import { sendError, sendSuccess } from '../../helpers/response.helper.js';

export const uploadToYoutube = async (req, res) => {
  try {
    const submissionId = req.params.id;

    const submission = await findSubmissionById(submissionId);

    const submissionTags = await getTagsBySubmissionId(submission.id);

    const youtubeTags = (submissionTags || []).map(tag => tag.title);

    console.log('TAGS ENVOYÉS À YOUTUBE:', youtubeTags, youtubeTags.length);


    if (!submission) {
      return sendError(res, 404, 'Vidéo introuvable en base de données', 'Video not found in database', null);
    }

    if (!submission.video_url) {
      return sendError(res, 400, 'Aucun fichier vidéo associé à cette entrée', 'No video file associated with this entry', null);
    }

    const videoPath = path.resolve('uploads/submissions', String(submission.id), path.basename(submission.video_url));
    const thumbnailPath = submission.cover ? path.resolve('uploads/submissions', String(submission.id), path.basename(submission.cover)) : null;
    const srtPath = submission.subtitles ? path.resolve('uploads/submissions', String(submission.id), path.basename(submission.subtitles)) : null;

    const youtubeVideo = await uploadVideo({
      title: submission.original_title,
      description: submission.original_synopsis,
      tags: youtubeTags,
      filePath: videoPath,
    });

    if (thumbnailPath) {
      await uploadThumbnail({ videoId: youtubeVideo.id, thumbnailPath });
    }

    if (srtPath) {
      try {
        await uploadCaptions({
          videoId: youtubeVideo.id,
          srtPath,
          language: 'fr',
        });
      } catch (err) {
        console.error('Erreur Captions (souvent propagation YouTube) :', err.response?.data || err.message);
      }
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideo.id}`;
    await updateYoutubeLinkInDatabase(youtubeUrl, submissionId);

    return sendSuccess(
      res,
      200,
      'Vidéo uploadée avec succès sur YouTube',
      'Video successfully uploaded to YouTube',
      { youtube_id: youtubeVideo.id, youtube_url: youtubeUrl }
    );

  } catch (err) {
    console.error('Erreur upload YouTube :', err.response?.data || err.message);

    return sendError(
      res,
      500,
      'Upload YouTube échoué',
      'YouTube upload failed',
      { message: err.message }
    );
  }
};
