import { getVideoDurationInSeconds } from 'get-video-duration';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import {createSubmission, updateFilePaths, getSubmissions, getSubmissionById} from '../../models/submissions/submissions_model.js';
import collaboratorModel from '../../models/submissions/collaborators_model.js';
import galleryModel from '../../models/submissions/gallery_model.js';
import socialModel from '../../models/socials/socials_model.js';
import { submissionSchema } from '../../utils/schemas/submission_schemas.js';
import db from '../../config/db_pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin de base pour les uploads (depuis backend/src/controllers/submissions/)
const getUploadsBasePath = () => {
  return path.join(__dirname, '../../uploads');
};

/**
 * Crée une nouvelle soumission de film
 * POST /api/submissions
 * Route publique (pas d'authentification requise)
 */
export const submit = async (req, res) => {
  const connection = await db.pool.getConnection();

  try {
    // 1. Validation des fichiers uploadés
    if (!req.files || !req.files.video || !req.files.cover) {
      return res.status(400).json({
        error: 'Fichiers manquants',
        details: 'Les fichiers suivants sont requis : video (MP4/MOV), cover (JPEG/JPG/PNG)'
      });
    }

    const videoFile = req.files.video[0];
    const coverFile = req.files.cover[0];
    const subtitlesFile = req.files.subtitles ? req.files.subtitles[0] : null;
    const galleryFiles = req.files.gallery || [];

    // 2. Validation format vidéo
    const videoExt = path.extname(videoFile.originalname).toLowerCase();
    if (!['.mp4', '.mov'].includes(videoExt)) {
      return res.status(400).json({
        error: 'Format vidéo invalide',
        details: 'Formats acceptés : MP4, MOV'
      });
    }

    // 3. Validation taille vidéo (300MB)
    const maxVideoSize = 300 * 1024 * 1024; // 300MB
    if (videoFile.size > maxVideoSize) {
      const sizeMB = (videoFile.size / 1024 / 1024).toFixed(2);
      return res.status(400).json({
        error: 'Fichier vidéo trop volumineux',
        details: `Taille maximale : 300MB (actuel : ${sizeMB}MB)`
      });
    }

    // 4. Validation taille cover (5MB)
    const maxCoverSize = 5 * 1024 * 1024; // 5MB
    if (coverFile.size > maxCoverSize) {
      const sizeMB = (coverFile.size / 1024 / 1024).toFixed(2);
      return res.status(400).json({
        error: 'Image de couverture trop volumineuse',
        details: `Taille maximale : 5MB (actuel : ${sizeMB}MB)`
      });
    }

    // 5. Validation taille gallery (5MB par image, max 3)
    if (galleryFiles.length > 3) {
      return res.status(400).json({
        error: 'Trop d\'images dans la galerie',
        details: 'Maximum 3 images autorisées'
      });
    }

    for (const galleryFile of galleryFiles) {
      if (galleryFile.size > maxCoverSize) {
        const sizeMB = (galleryFile.size / 1024 / 1024).toFixed(2);
        return res.status(400).json({
          error: 'Image de galerie trop volumineuse',
          details: `Taille maximale par image : 5MB (actuel : ${sizeMB}MB)`
        });
      }
    }

    // 6. Validation données avec Zod
    if (!req.body.data) {
      return res.status(400).json({
        error: 'Données manquantes',
        details: 'Le champ "data" contenant les informations de la soumission est requis'
      });
    }

    let submissionData;
    try {
      submissionData = JSON.parse(req.body.data);
    } catch (parseError) {
      return res.status(400).json({
        error: 'Données JSON invalides',
        details: parseError.message
      });
    }

    // Validation avec Zod - gestion explicite des erreurs
    let validatedData;
    try {
      validatedData = submissionSchema.parse(submissionData);
    } catch (zodError) {
      // S'assurer que c'est bien une erreur Zod
      if (zodError.name === 'ZodError') {
        return res.status(422).json({
          error: 'Données invalides',
          details: zodError.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      // Si ce n'est pas une erreur Zod, la relancer pour être capturée par le catch général
      throw zodError;
    }

    // 7. Début transaction
    await connection.beginTransaction();

    // 8. Créer dossier temporaire pour calcul durée (déjà créé par Multer, mais on s'assure qu'il existe)
    const tempDir = path.join(getUploadsBasePath(), 'submissions/temp');
    await fs.mkdir(tempDir, { recursive: true });

    // 9. Calculer durée avec get-video-duration
    let durationSeconds = null;
    try {
      durationSeconds = await getVideoDurationInSeconds(videoFile.path);
      // Arrondir à l'entier le plus proche
      durationSeconds = Math.round(durationSeconds);
      console.log(`✅ Durée vidéo calculée : ${durationSeconds} secondes (${Math.floor(durationSeconds / 60)}min ${durationSeconds % 60}sec)`);
    } catch (durationError) {
      console.warn('⚠️ Erreur calcul durée vidéo:', durationError.message);
      // Continuer sans durée (sera NULL dans BDD)
      // Ne pas bloquer la soumission si le calcul échoue
    }

    // 10. INSERT submission (obtenir submission_id)
    const submissionId = await createSubmission(
      connection,
      validatedData,
      videoFile.path, // Chemin temporaire (sera mis à jour après déplacement)
      coverFile.path, // Chemin temporaire du cover (sera mis à jour après déplacement)
      durationSeconds
    );

    // 11. Créer dossier final
    const finalDir = path.join(getUploadsBasePath(), 'submissions', submissionId.toString());
    await fs.mkdir(finalDir, { recursive: true });
    await fs.mkdir(path.join(finalDir, 'gallery'), { recursive: true });

    // 12. Déplacer fichiers vers dossier final
    const finalVideoPath = path.join(finalDir, `video${videoExt}`);
    const finalCoverPath = path.join(finalDir, `cover${path.extname(coverFile.originalname)}`);

    await fs.rename(videoFile.path, finalVideoPath);
    await fs.rename(coverFile.path, finalCoverPath);

    // 13. Déplacer subtitles si présent (optionnel)
    let finalSubtitlesPath = null;
    if (subtitlesFile) {
      finalSubtitlesPath = path.join(finalDir, `subtitles${path.extname(subtitlesFile.originalname)}`);
      await fs.rename(subtitlesFile.path, finalSubtitlesPath);
    }

    // 14. Mettre à jour chemins dans BDD
    const videoUrl = `/uploads/submissions/${submissionId}/video${videoExt}`;
    const coverUrl = `/uploads/submissions/${submissionId}/cover${path.extname(coverFile.originalname)}`;
    const subtitlesUrl = finalSubtitlesPath
      ? `/uploads/submissions/${submissionId}/subtitles${path.extname(subtitlesFile.originalname)}`
      : null;

    await updateFilePaths(connection, submissionId, videoUrl, coverUrl, subtitlesUrl);

    // 15. INSERT gallery images
    const galleryUrls = [];
    if (galleryFiles.length > 0) {
      for (let i = 0; i < galleryFiles.length; i++) {
        const galleryFile = galleryFiles[i];
        const galleryExt = path.extname(galleryFile.originalname);
        const finalGalleryPath = path.join(finalDir, 'gallery', `image${i + 1}${galleryExt}`);
        await fs.rename(galleryFile.path, finalGalleryPath);

        const galleryUrl = `/uploads/submissions/${submissionId}/gallery/image${i + 1}${galleryExt}`;
        galleryUrls.push(galleryUrl);
      }

      await galleryModel.createGalleryImages(connection, submissionId, galleryUrls);
    }

    // 16. INSERT collaborators
    if (validatedData.collaborators && validatedData.collaborators.length > 0) {
      await collaboratorModel.createCollaborators(connection, submissionId, validatedData.collaborators);
    }

    // 17. INSERT socials
    if (validatedData.socials && validatedData.socials.length > 0) {
      await socialModel.createSocials(connection, submissionId, validatedData.socials);
    }

    // 18. Commit transaction
    await connection.commit();

    // 19. Retourner succès
    res.status(201).json({
      success: true,
      message: 'Soumission créée avec succès',
      submission_id: submissionId,
      duration_seconds: durationSeconds,
      files: {
        video: videoUrl,
        cover: coverUrl,
        subtitles: subtitlesUrl,
        gallery: galleryUrls
      }
    });

  } catch (error) {
    await connection.rollback();

    // Nettoyage fichiers en cas d'erreur
    if (req.files) {
      try {
        const filesToClean = [
          req.files.video?.[0]?.path,
          req.files.cover?.[0]?.path,
          req.files.subtitles?.[0]?.path,
          ...(req.files.gallery || []).map(f => f.path)
        ].filter(Boolean);

        for (const filePath of filesToClean) {
          try {
            await fs.unlink(filePath);
          } catch (unlinkError) {
            console.warn('Erreur suppression fichier temporaire:', unlinkError.message);
          }
        }
      } catch (cleanupError) {
        console.warn('Erreur nettoyage fichiers:', cleanupError.message);
      }
    }

    // Gestion erreurs Zod
    if (error.name === 'ZodError') {
      return res.status(422).json({
        error: 'Données invalides',
        details: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    console.error('Erreur soumission:', error);
    console.error('Stack trace:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    res.status(500).json({
      error: 'Erreur lors de la création de la soumission',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : undefined
    });
  } finally {
    connection.release();
  }
};

/**
 * Récupère toutes les soumissions (admin uniquement)
 * GET /api/admin/submissions
 * Route protégée (nécessite authentification admin)
 */
export const getSubmissionsController = async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    const filters = {
      status: status || null,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const submissions = await getSubmissions(filters);

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Erreur récupération soumissions:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des soumissions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const getSubmissionByIdController = async (req, res) => {
  try {
    const submissionId = parseInt(req.params.id);

    // Validation de l'ID
    if (isNaN(submissionId) || submissionId <= 0) {
      return res.status(400).json({
        error: 'ID invalide',
        details: 'L\'ID de la soumission doit être un nombre positif'
      });
    }

    const submission = await getSubmissionById(submissionId);

    if (!submission) {
      return res.status(404).json({
        error: 'Soumission non trouvée',
        details: `Aucune soumission trouvée avec l'ID ${submissionId}`
      });
    }

    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    console.error('Erreur récupération soumission:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de la soumission',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
