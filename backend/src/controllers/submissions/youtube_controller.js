import fs from 'fs';
import path from 'path';
import { findById } from '../../models/submissions/submissions_model.js';
import { uploadVideo } from '../../services/youtube_services.js';

export const uploadToYoutube = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await findById(videoId);

    if (!video) return res.status(404).json({ error: 'Vidéo introuvable' });

    const localPath = path.resolve('uploads', path.basename(video.video_url));

    if (!fs.existsSync(localPath)) {
      console.error('Fichier manquant à ce path:', localPath);
      return res.status(404).json({ error: 'Fichier manquant' });
    }

    const response = await uploadVideo({
      title: video.original_title,
      description: video.original_synopsis,
      filePath: localPath,
    });

    res.json({
      success: true,
      youtubeVideoId: response.data.id,
    });
  } catch (err) {
    console.error('Erreur upload YouTube:', err);
    res.status(500).json({ error: 'Upload YouTube échoué' });
  }
};
