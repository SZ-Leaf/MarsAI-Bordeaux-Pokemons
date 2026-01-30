import fs from 'fs';
import path from 'path';
import { findById, updateYoutubeLink } from '../../models/submissions/submissions_model.js';
import { uploadVideo, uploadThumbnail, uploadCaptions } from '../../services/youtube_services.js';

export const uploadToYoutube = async (req, res) => {
  try {
    const submissionId = req.params.id;

    const video = await findById(submissionId);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Vidéo introuvable en base de données',
      });
    }

    if (!video.video_url) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier vidéo associé à cette entrée (video_url manquant)',
      });
    }

    const videoPath = path.resolve('uploads', path.basename(video.video_url));
    const thumbnailPath = video.cover ? path.resolve('uploads', path.basename(video.cover)) : null;
    const srtPath = video.subtitles ? path.resolve('uploads', path.basename(video.subtitles)) : null;

    const youtubeVideo = await uploadVideo({
      title: video.original_title || 'Sans titre',
      description: video.original_synopsis || 'Pas de description',
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
    await updateYoutubeLink(youtubeUrl, submissionId);

    return res.json({
      success: true,
      youtube_id: youtubeVideo.id,
      youtube_url: youtubeUrl,
    });

  } catch (err) {
    console.error('Erreur upload YouTube :', err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      error: 'Upload YouTube échoué',
      message: err.message,
    });
  }
};
