import path from 'path';
import { getSubmissionById, updateYoutubeLink } from '../../models/submissions/submissions_model.js';
import { uploadVideo, uploadThumbnail, uploadCaptions } from '../../services/youtube_services.js';
import { sendError, sendSuccess } from "../../helpers/response_helper.js";

export const uploadToYoutube = async (req, res) => {
  try {
    const submissionId = req.params.id;

    const submission = await getSubmissionById(submissionId);
    if (!submission) {
      return sendError(
        res,
        400,
        "Soumission inexistante",
        "Submission does not exist",
        null
      );
    }

    if (!submission.video_url) {
      return sendError(
        res,
        400,
        "Fichier vidéo manquant",
        "No video file associated with this submission",
        null
      );
    }

    const submissionFolder = path.resolve('uploads/submissions', submissionId);

    const videoPath = path.resolve(submissionFolder, path.basename(submission.video_url));
    const thumbnailPath = submission.cover
      ? path.resolve(submissionFolder, path.basename(submission.cover))
      : null;
    const srtPath = submission.subtitles
      ? path.resolve(submissionFolder, path.basename(submission.subtitles))
      : null;

    const youtubeVideo = await uploadVideo({
      title: submission.original_title || 'Sans titre',
      description: submission.original_synopsis || 'Pas de description',
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
        console.error('Erreur upload captions :', err.response?.data || err.message);
      }
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideo.id}`;
    await updateYoutubeLink(youtubeUrl, submissionId);

    return sendSuccess(
      res,
      200,
      "Vidéo uploadée sur YouTube avec succès",
      "Video successfully uploaded to YouTube",   // EN
      {
        youtube_id: youtubeVideo.id,
        youtube_url: youtubeUrl
      }
    );

  } catch (err) {
    console.error('Erreur upload YouTube :', err.response?.data || err.message);
    return sendError(
      res,
      500,
      "Upload YouTube échoué",
      "YouTube upload failed",
      err.message
    );
  }
};
