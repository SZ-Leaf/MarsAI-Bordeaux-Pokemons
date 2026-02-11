import path from 'path';
import { uploadVideo, uploadThumbnail, uploadCaptions, deleteVideo} from '../../services/youtube.services.js';
import { findSubmissionById, updateYoutubeLinkInDatabase } from '../../models/submissions/submissions.model.js';
import { getTagsBySubmissionId } from '../../models/tags/submissions_tags_youtube.model.js';
import { sendError, sendSuccess } from '../../helpers/response.helper.js';

export const uploadToYoutube = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submission = await findSubmissionById(submissionId);

    if (!submission) {
      return sendError(res, 404, 'Vidéo introuvable en base de données', 'Video not found in database', null);
    }

    if (!submission.video_url) {
      return sendError(res, 400, 'Aucun fichier vidéo associé à cette entrée', 'No video file associated with this entry', null);
    }



    const submissionTags = await getTagsBySubmissionId(submission.id);
    const youtubeTags = (submissionTags || []).map(tag => tag.title);

    const videoPath = path.resolve('uploads/submissions', String(submission.id), path.basename(submission.video_url));
    const thumbnailPath = submission.cover ? path.resolve('uploads/submissions', String(submission.id), path.basename(submission.cover)) : null;
    const srtPath = submission.subtitles ? path.resolve('uploads/submissions', String(submission.id), path.basename(submission.subtitles)) : null;

    const youtubeVideo = await uploadVideo({
      title: submission.english_title,
      description: submission.original_synopsis,
      tags: youtubeTags,
      filePath: videoPath,
    });

    if (thumbnailPath) {
      try {
        await uploadThumbnail({ videoId: youtubeVideo.id, thumbnailPath });
      } catch (err) {
        console.error('Erreur Thumbnail :', err.message);
      }
    }

    if (srtPath) {
      try {
        const lang = submission.language || 'fr';
        await uploadCaptions({
          videoId: youtubeVideo.id,
          srtPath,
          language: lang,
        });
      } catch (err) {
        console.error('Erreur Captions :', err.response?.data || err.message);
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
    console.error('Erreur upload youtube :', err.response?.data || err.message);
    return sendError(
      res,
      500,
      'Upload YouTube échoué',
      'YouTube upload failed',
      { message: err.message }
    );
  }
};

export const deleteToYoutube = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submission = await findSubmissionById(submissionId);

    if (!submission) {
      return sendError(res, 404, 'Vidéo introuvable en base de données', 'Video not found in database', null);
    }

    if (!submission.youtube_URL) {
      return sendError(res, 400, 'Aucune vidéo YouTube associée à cette entrée', 'No YouTube video associated with this entry', null);
    }

    const videoId = submission.youtube_URL.split('v=')[1];
    console.log(videoId);

    await deleteVideo(videoId);

    await updateYoutubeLinkInDatabase(null, submissionId);

    return sendSuccess(
      res,
      200,
      'Vidéo supprimée de YouTube avec succès',
      'Video successfully deleted from YouTube',
      null
    );

  } catch (err) {
    console.error('Erreur suppression YouTube :', err.response?.data || err.message);
    return sendError(
      res,
      500,
      'Suppression YouTube échouée',
      'YouTube deletion failed',
      { message: err.message }
    );
  }
};
