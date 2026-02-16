import path from 'path';
import { uploadVideo, uploadThumbnail, uploadOrUpdateCaptions } from '../services/youtube.services.js';
import { getTagsBySubmissionId } from '../models/tags/submissions_tags_youtube.model.js';

export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/v=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

export const uploadAllYoutubeAssets = async (submission) => {
  const submissionTags = await getTagsBySubmissionId(submission.id);
  const youtubeTags = (submissionTags || []).map(tag => tag.title);
  const videoPath = path.resolve('uploads/submissions', String(submission.id), path.basename(submission.video_url));
  const youtubeVideo = await uploadVideo({
    title: submission.english_title,
    description: submission.original_synopsis,
    tags: youtubeTags,
    filePath: videoPath
  });
  await uploadThumbnailAndCaptions(submission, youtubeVideo.id);
  return youtubeVideo;
};

export const uploadThumbnailAndCaptions = async (submission, videoId) => {
  if (submission.cover) {
    const thumbnailPath = path.resolve('uploads/submissions', String(submission.id), path.basename(submission.cover));
    await uploadThumbnail({ videoId, thumbnailPath });
  }
  if (submission.subtitles) {
    const srtPath = path.resolve('uploads/submissions', String(submission.id), path.basename(submission.subtitles));
    const lang = submission.language || 'fr';
    await uploadOrUpdateCaptions({ videoId, srtPath, language: lang, name: lang === 'fr' ? 'Français' : lang });
  }
};
