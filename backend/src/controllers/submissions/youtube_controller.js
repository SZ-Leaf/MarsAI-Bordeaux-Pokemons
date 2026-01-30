import fs from 'fs';
import path from 'path';
import { findById, updateYoutubeLink } from '../../models/submissions/submissions_model.js';
import { uploadVideo } from '../../services/youtube_services.js';

export const uploadToYoutube = async (req, res) => {
  try {
    const videoId = req.params.id;

<<<<<<< Updated upstream
    if (!videoId) {
      return res.status(400).json({
        success: false,
        error: 'ID vidéo manquant dans la requête',
      });
=======
    const videoPath = path.resolve('uploads', path.basename(video.video_url));
    const thumbnailPath = path.resolve('uploads', path.basename(video.cover));
    const srtPath = path.resolve('uploads', path.basename(video.subtitles));

    const youtubeVideo = await uploadVideo({
      title: video.original_title,
      description: video.original_synopsis,
      filePath: videoPath,
    });

    await uploadThumbnail({ videoId: youtubeVideo.id, thumbnailPath });

    try {
      await uploadCaptions({
        videoId: youtubeVideo.id,
        srtPath,
        language: 'fr',
      });
    } catch (err) {
      console.error("Erreur Captions (souvent un problème de propagation) :", err.response?.data || err.message);
>>>>>>> Stashed changes
    }

    const video = await findById(videoId);

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

    const fileName = path.basename(video.video_url);
    const localPath = path.resolve('uploads', fileName);

    const youtubeResponse = await uploadVideo({
      title: video.original_title || 'Sans titre',
      description: video.original_synopsis || 'Pas de description',
      filePath: localPath,
    });

    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeResponse.id}`;
    await updateYoutubeLink(youtubeUrl, videoId);

    return res.json({
      success: true,
      youtube_id: youtubeResponse.id,
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
