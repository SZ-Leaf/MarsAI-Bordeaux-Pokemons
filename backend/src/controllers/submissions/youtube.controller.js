import { findSubmissionById, updateYoutubeLinkInDatabase } from '../../models/submissions/submissions.model.js';
import { getTagsBySubmissionId } from '../../models/tags/submissions_tags_youtube.model.js';
import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { formatDate } from '../../utils/dates/date.utils.js';
import { uploadAllYoutubeAssets, getYouTubeVideoId, uploadThumbnailAndCaptions } from '../../utils/youtube.utils.js';
import { deleteVideo, updateYoutubeVideo } from '../../services/youtube.services.js';

export const uploadToYoutube = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submission = await findSubmissionById(submissionId);
    if (!submission) return sendError(res, 404, 'Vidéo introuvable', 'Video not found', null);
    if (submission.youtube_URL) return sendError(res, 409, 'Vidéo déjà uploadée', 'Video already uploaded', null);

    const youtubeVideo = await uploadAllYoutubeAssets(submission);
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideo.id}`;
    await updateYoutubeLinkInDatabase(youtubeUrl, submissionId);

    return sendSuccess(res, 200, 'Vidéo uploadée avec succès sur YouTube', 'Video successfully uploaded to YouTube', { youtube_id: youtubeVideo.id, youtube_url: youtubeUrl });
  } catch (err) {
    return sendError(res, 500, 'Upload YouTube échoué', 'YouTube upload failed', { message: err.message });
  }
};

export const deleteToYoutube = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submission = await findSubmissionById(submissionId);
    if (!submission) return sendError(res, 404, 'Vidéo introuvable', 'Video not found', null);

    const videoId = getYouTubeVideoId(submission.youtube_URL);
    if (!videoId) return sendError(res, 400, 'Aucune vidéo YouTube associée', 'No YouTube video associated', null);

    await deleteVideo(videoId);
    await updateYoutubeLinkInDatabase(null, submissionId);

    return sendSuccess(res, 200, 'Vidéo supprimée de YouTube avec succès', 'Video successfully deleted from YouTube', null);
  } catch (err) {
    return sendError(res, 500, 'Suppression YouTube échouée', 'YouTube deletion failed', { message: err.message });
  }
};

export const updateToYoutube = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submission = await findSubmissionById(submissionId);
    if (!submission) return sendError(res, 404, 'Vidéo introuvable', 'Video not found', null);
    if (formatDate(submission.updated_at) === formatDate(submission.created_at)) return sendError(res, 400, 'Aucune modification détectée pour cette soumission', 'No changes detected for this submission', null);

    const videoId = getYouTubeVideoId(submission.youtube_URL);
    if (!videoId) return sendError(res, 400, 'ID YouTube invalide', 'Invalid YouTube video ID', null);

    const submissionTags = await getTagsBySubmissionId(submission.id);
    const youtubeTags = (submissionTags || []).map(tag => tag.title);

    const updatedVideo = await updateYoutubeVideo({
      videoId,
      title: submission.english_title,
      description: submission.english_synopsis,
      tags: youtubeTags,
      categoryId: 28
    });

    await uploadThumbnailAndCaptions(submission, videoId);

    return sendSuccess(res, 200, 'Vidéo YouTube mise à jour', 'YouTube video updated', updatedVideo);
  } catch (err) {
    return sendError(res, 500, 'Erreur mise à jour YouTube', 'YouTube update failed', { message: err.message });
  }
};
