import fs from 'fs';
import path from 'path';
import { findById } from '../../models/submissions/submissions_model.js';
import { uploadVideo } from '../../services/youtube_services.js';

export const uploadToYoutube = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await findById(videoId);

    if (!video) return res.status(404).json({ error: 'Vidéo introuvable en base de données' });

    // Nettoyage du chemin : assure-toi que video.video_url contient le nom du fichier
    const fileName = path.basename(video.video_url);
    const localPath = path.resolve('uploads', fileName);

    console.log('Tentative d\'accès au fichier :', localPath);

    if (!fs.existsSync(localPath)) {
      return res.status(404).json({
        error: 'Fichier physique introuvable sur le serveur',
        path: localPath
      });
    }

    const youtubeResponse = await uploadVideo({
      title: video.original_title || 'Sans titre',
      description: video.original_synopsis || 'Pas de description',
      filePath: localPath,
    });

    // Google API renvoie l'ID dans data.id
    if (!youtubeResponse || !youtubeResponse.id) {
        throw new Error("Réponse YouTube invalide");
    }

    res.json({
      success: true,
      youtubeVideoId: youtubeResponse.id,
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: 'Upload YouTube échoué',
      message: err.message
    });
  }
};
