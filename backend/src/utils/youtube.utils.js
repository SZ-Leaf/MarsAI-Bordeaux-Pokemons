import path from 'path';
import { getTagsBySubmissionId } from '../models/tags/submissions_tags_youtube.model.js';
import { uploadThumbnail, uploadCaptions, uploadVideo } from '../services/youtube.services.js';

export const getSubmissionPaths = (submission) => {
  const base = path.resolve('uploads/submissions', String(submission.id));
  return {
    videoPath: path.join(base, path.basename(submission.video_url)),
    thumbnailPath: submission.cover ? path.join(base, path.basename(submission.cover)) : null,
    srtPath: submission.subtitles ? path.join(base, path.basename(submission.subtitles)) : null,
  };
};

export const uploadAllYoutubeAssets = async (submission) => {
  const { videoPath, thumbnailPath, srtPath } = getSubmissionPaths(submission);

  const submissionTags = await getTagsBySubmissionId(submission.id);
  const youtubeTags = (submissionTags || []).map(tag => tag.title);

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
      console.error('Erreur Captions :', err.message);
    }
  }

  return youtubeVideo;
};


export const getYouTubeVideoId = (youtubeUrl) => {
  if (!youtubeUrl) return null;
  const match = youtubeUrl.match(/v=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};
