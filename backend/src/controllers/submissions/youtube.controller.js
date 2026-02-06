import path from 'path';
import { uploadVideo, uploadThumbnail, uploadCaptions } from '../../services/youtube.services.js';
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

    // --- CONSTRUCTION DE LA DESCRIPTION OPTIMISÉE ---
    const descriptionParts = [];

    // 1. Synopsis (On filtre les valeurs de test ou "NULL")
    const synopsis = submission.english_synopsis || submission.original_synopsis;
    const blacklist = ['NULL', 'Short description', 'deijedindede', 'deijdlijde']; // Tes valeurs de test visibles sur l'image

    if (synopsis && !blacklist.some(b => synopsis.includes(b))) {
      descriptionParts.push(`🎬 SYNOPSIS\n${synopsis}`);
    }

    // 2. Détails techniques (Basé sur tech_stack et creative_method)
    if (submission.tech_stack || submission.creative_method) {
      descriptionParts.push(`\n⚙️ CREATIVE PROCESS`);
      if (submission.creative_method) descriptionParts.push(`Method: ${submission.creative_method}`);
      if (submission.tech_stack) descriptionParts.push(`Tech Stack: ${submission.tech_stack}`);
    }

    // 3. Classification
    if (submission.classification) {
      descriptionParts.push(`\nCategory: ${submission.classification} Film`);
    }

    const finalDescription = descriptionParts.join('\n');

    // --- PRÉPARATION DES TAGS ---
    const submissionTags = await getTagsBySubmissionId(submission.id);
    const youtubeTags = (submissionTags || []).map(tag => tag.title);

    // --- CHEMINS DES FICHIERS ---
    const videoPath = path.resolve('uploads/submissions', String(submission.id), path.basename(submission.video_url));
    const thumbnailPath = submission.cover ? path.resolve('uploads/submissions', String(submission.id), path.basename(submission.cover)) : null;
    const srtPath = submission.subtitles ? path.resolve('uploads/submissions', String(submission.id), path.basename(submission.subtitles)) : null;

    // --- UPLOAD PRINCIPAL ---
    const youtubeVideo = await uploadVideo({
      // Titre : Priorité à l'anglais pour le SEO, sinon original
      title: submission.english_title || submission.original_title || `AI Video #${submission.id}`,
      description: finalDescription,
      tags: youtubeTags,
      filePath: videoPath,
    });

    // --- ASSETS ADDITIONNELS (Thumbnail & Captions) ---
    if (thumbnailPath) {
      try {
        await uploadThumbnail({ videoId: youtubeVideo.id, thumbnailPath });
      } catch (err) {
        console.error('Erreur Thumbnail :', err.message);
      }
    }

    if (srtPath) {
      try {
        // Détection de la langue dynamique si présente en DB
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

    // --- MISE À JOUR BASE DE DONNÉES ---
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
    console.error('Erreur upload YouTube GLOBAL :', err.response?.data || err.message);
    return sendError(
      res,
      500,
      'Upload YouTube échoué',
      'YouTube upload failed',
      { message: err.message }
    );
  }
};
