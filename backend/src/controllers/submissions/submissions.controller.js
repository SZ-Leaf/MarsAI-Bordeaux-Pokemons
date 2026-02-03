import { getVideoDurationInSeconds } from 'get-video-duration';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createSubmission, updateFilePaths, getSubmissions, getSubmissionById } from '../../models/submissions/submissions.model.js';
import collaboratorModel from '../../models/submissions/collaborators.model.js';
import galleryModel from '../../models/submissions/gallery.model.js';
import socialModel from '../../models/socials/socials.model.js';
import submissions_tagsModel from '../../models/tags/submissions_tags.model.js';
import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { submissionSchema } from '../../utils/schemas/submission.schemas.js';
import db from '../../config/db_pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin de base pour les uploads (depuis backend/src/controllers/submissions/)
const getUploadsBasePath = () => {
  return path.join(__dirname, '../../uploads');
};

// export const submit = async (req, res) => {
//   const connection = await db.pool.getConnection();

//   try {
//     // 1. Validation des fichiers uploadés
//     if (!req.files || !req.files.video || !req.files.cover) {
//       return sendError(res, 400,
//         "Fichiers manquants",
//         "Missing files",
//         null
//       );
//     }

//     const videoFile = req.files.video[0];
//     const coverFile = req.files.cover[0];
//     const subtitlesFile = req.files.subtitles ? req.files.subtitles[0] : null;
//     const galleryFiles = req.files.gallery || [];

//     // 2. Validation format vidéo
//     const videoExt = path.extname(videoFile.originalname).toLowerCase();
//     if (!['.mp4', '.mov'].includes(videoExt)) {
//       return sendError(res, 400,
//         "Format vidéo invalide. Formats acceptés : MP4, MOV",
//         "Invalid video format. Accepted formats: MP4, MOV",
//         null
//       );
//     }

//     // 3. Validation taille vidéo (300MB)
//     const maxVideoSize = 300 * 1024 * 1024; // 300MB
//     if (videoFile.size > maxVideoSize) {
//       const sizeMB = (videoFile.size / 1024 / 1024).toFixed(2);
//       return sendError(res, 400,
//         `Fichier vidéo trop volumineux. Taille maximale : 300MB (actuel : ${sizeMB}MB)`,
//         `Video file too large. Maximum size : 300MB (current : ${sizeMB}MB)`,
//         null
//       );
//     }

//     // 4. Validation taille cover (5MB)
//     const maxCoverSize = 5 * 1024 * 1024; // 5MB
//     if (coverFile.size > maxCoverSize) {
//       const sizeMB = (coverFile.size / 1024 / 1024).toFixed(2);
//       return sendError(res, 400,
//         "Image de couverture trop volumineuse",
//         "Cover image too large",
//         null
//       );
//     }

//     // 5. Validation taille gallery (5MB par image, max 3)
//     if (galleryFiles.length > 3) {
//       return sendError(res, 400,
//         "Trop d'images dans la galerie",
//         "Too many images in the gallery",
//         null
//       );
//     }

//     for (const galleryFile of galleryFiles) {
//       if (galleryFile.size > maxCoverSize) {
//         const sizeMB = (galleryFile.size / 1024 / 1024).toFixed(2);
//         return sendError(res, 400,
//           `Image de galerie trop volumineuse, taille maximale par image : 5MB (actuel : ${sizeMB}MB)`,
//           `Gallery image too large, maximum size per image : 5MB (current : ${sizeMB}MB)`,
//           null
//         );
//       }
//     }

//     // 6. Validation données avec Zod
//     if (!req.body.data) {
//       return sendError(res, 400,
//         "Information manquante",
//         "Missing information",
//         null
//       );
//     }

//     let submissionData;
//     try {
//       submissionData = JSON.parse(req.body.data);
//     } catch (parseError) {
//       return sendError(res, 400,
//         "Données entrées invalides",
//         "Invalid data entered",
//         null
//       );
//     }

//     // Validation avec Zod - gestion explicite des erreurs
//     let validatedData;
//     try {
//       validatedData = submissionSchema.parse(submissionData);
//     } catch (zodError) {
//       // S'assurer que c'est bien une erreur Zod
//       if (zodError.name === 'ZodError') {
//         return sendError(res, 422,
//           "Données invalides",
//           "Invalid data",
//           null
//         );
//       }
//       // Si ce n'est pas une erreur Zod, la relancer pour être capturée par le catch général
//       throw zodError;
//     }

//     // 7. Début transaction
//     await connection.beginTransaction();

//     // 8. Créer dossier temporaire pour calcul durée (déjà créé par Multer, mais on s'assure qu'il existe)
//     const tempDir = path.join(getUploadsBasePath(), 'submissions/temp');
//     await fs.mkdir(tempDir, { recursive: true });

//     // 9. Calculer durée avec get-video-duration
//     let durationSeconds = null;
//     try {
//       durationSeconds = await getVideoDurationInSeconds(videoFile.path);
//       // Arrondir à l'entier le plus proche
//       durationSeconds = Math.round(durationSeconds);
//       console.log(`Duration calculated: ${durationSeconds} seconds (${Math.floor(durationSeconds / 60)}min ${durationSeconds % 60}sec)`);
//     } catch (durationError) {
//       console.warn('Error calculating video duration:', durationError.message);
//       // Continuer sans durée (sera NULL dans BDD)
//       // Ne pas bloquer la soumission si le calcul échoue
//     }

//     // 10. INSERT submission (obtenir submission_id)
//     const submissionId = await createSubmission(
//       connection,
//       validatedData,
//       videoFile.path, // Chemin temporaire (sera mis à jour après déplacement)
//       coverFile.path, // Chemin temporaire du cover (sera mis à jour après déplacement)
//       durationSeconds
//     );

//     // 11. Créer dossier final
//     const finalDir = path.join(getUploadsBasePath(), 'submissions', submissionId.toString());
//     await fs.mkdir(finalDir, { recursive: true });
//     await fs.mkdir(path.join(finalDir, 'gallery'), { recursive: true });

//     // 12. Déplacer fichiers vers dossier final
//     const finalVideoPath = path.join(finalDir, `video${videoExt}`);
//     const finalCoverPath = path.join(finalDir, `cover${path.extname(coverFile.originalname)}`);

//     await fs.rename(videoFile.path, finalVideoPath);
//     await fs.rename(coverFile.path, finalCoverPath);

//     // 13. Déplacer subtitles si présent (optionnel)
//     let finalSubtitlesPath = null;
//     if (subtitlesFile) {
//       finalSubtitlesPath = path.join(finalDir, `subtitles${path.extname(subtitlesFile.originalname)}`);
//       await fs.rename(subtitlesFile.path, finalSubtitlesPath);
//     }

//     // 14. Mettre à jour chemins dans BDD
//     const videoUrl = `/uploads/submissions/${submissionId}/video${videoExt}`;
//     const coverUrl = `/uploads/submissions/${submissionId}/cover${path.extname(coverFile.originalname)}`;
//     const subtitlesUrl = finalSubtitlesPath
//       ? `/uploads/submissions/${submissionId}/subtitles${path.extname(subtitlesFile.originalname)}`
//       : null;

//     await updateFilePaths(connection, submissionId, videoUrl, coverUrl, subtitlesUrl);

//     // 15. INSERT gallery images
//     const galleryUrls = [];
//     if (galleryFiles.length > 0) {
//       for (let i = 0; i < galleryFiles.length; i++) {
//         const galleryFile = galleryFiles[i];
//         const galleryExt = path.extname(galleryFile.originalname);
//         const finalGalleryPath = path.join(finalDir, 'gallery', `image${i + 1}${galleryExt}`);
//         await fs.rename(galleryFile.path, finalGalleryPath);

//         const galleryUrl = `/uploads/submissions/${submissionId}/gallery/image${i + 1}${galleryExt}`;
//         galleryUrls.push(galleryUrl);
//       }

//       await galleryModel.createGalleryImages(connection, submissionId, galleryUrls);
//     }

//     // 16. INSERT collaborators
//     if (validatedData.collaborators && validatedData.collaborators.length > 0) {
//       await collaboratorModel.createCollaborators(connection, submissionId, validatedData.collaborators);
//     }

//     // 17. INSERT socials
//     if (validatedData.socials && validatedData.socials.length > 0) {
//       await socialModel.createSocials(connection, submissionId, validatedData.socials);
//     }

//     // 18. Commit transaction
//     await connection.commit();

//     // 19. Retourner succès
//     res.status(201).json({
//       success: true,
//       message: 'Soumission créée avec succès',
//       submission_id: submissionId,
//       duration_seconds: durationSeconds,
//       files: {
//         video: videoUrl,
//         cover: coverUrl,
//         subtitles: subtitlesUrl,
//         gallery: galleryUrls
//       }
//     });

//   } catch (error) {
//     await connection.rollback();

//     // Nettoyage fichiers en cas d'erreur
//     if (req.files) {
//       try {
//         const filesToClean = [
//           req.files.video?.[0]?.path,
//           req.files.cover?.[0]?.path,
//           req.files.subtitles?.[0]?.path,
//           ...(req.files.gallery || []).map(f => f.path)
//         ].filter(Boolean);

//         for (const filePath of filesToClean) {
//           try {
//             await fs.unlink(filePath);
//           } catch (unlinkError) {
//             console.warn('Erreur suppression fichier temporaire:', unlinkError.message);
//           }
//         }
//       } catch (cleanupError) {
//         console.warn('Erreur nettoyage fichiers:', cleanupError.message);
//       }
//     }

//     // Gestion erreurs Zod
//     if (error.name === 'ZodError') {
//       return res.status(422).json({
//         error: 'Données invalides',
//         details: error.issues.map(err => ({
//           field: err.path.join('.'),
//           message: err.message
//         }))
//       });
//     }

//     console.error('Erreur soumission:', error);
//     console.error('Stack trace:', error.stack);
//     console.error('Error name:', error.name);
//     console.error('Error message:', error.message);

//     res.status(500).json({
//       error: 'Erreur lors de la création de la soumission',
//       details: process.env.NODE_ENV === 'development' ? {
//         message: error.message,
//         stack: error.stack,
//         name: error.name
//       } : undefined
//     });
//   } finally {
//     connection.release();
//   }
// };

export const submitController = async (req, res) => {

  // 
  // Validate before database connection
  // 

  if (!req.files || !req.files.video) {
    return sendError(res, 400, 'Fichier vidéo manquant', 'Video file missing', null);
  }
  if(!req.files.cover) {
    return sendError(res, 400, 'Image de couverture manquante', 'Cover image missing', null);
  }

  const videoFile = req.files.video[0];
  const coverFile = req.files.cover[0];
  const subtitlesFile = req.files.subtitles ? req.files.subtitles[0] : null;
  const galleryFiles = req.files.gallery || [];

  const maxVideoSize = 300 * 1024 * 1024; // 300MB
  const maxImageSize = 5 * 1024 * 1024;   // 5MB

  const videoExt = path.extname(videoFile.originalname).toLowerCase();

  // 
  // validate extension and mimtype to prevent fake .mp4 uploads
  //

  if (
    !['.mp4', '.mov'].includes(videoExt) ||
    !['video/mp4', 'video/quicktime'].includes(videoFile.mimetype)
  ) {
    return sendError(
      res,
      400,
      'Format vidéo invalide. Formats acceptés : MP4, MOV',
      'Invalid video format. Accepted formats: MP4, MOV',
      null
    );
  }

  if (videoFile.size > maxVideoSize) {
    const sizeMB = (videoFile.size / 1024 / 1024).toFixed(2);
    return sendError(
      res,
      400,
      `Fichier vidéo trop volumineux. Taille maximale : 300MB (actuel : ${sizeMB}MB)`,
      `Video file too large. Maximum size : 300MB (current : ${sizeMB}MB)`,
      null
    );
  }


  // 
  // validate cover size and mimetype
  // 

  if (coverFile.size > maxImageSize) {
    return sendError(res, 400, 'Image de couverture trop volumineuse', 'Cover image too large', null);
  }

  if (!coverFile.mimetype.startsWith('image/')) {
    return sendError(res, 400, 'Format image invalide', 'Invalid image format', null);
  }

  // 
  // validate gallery size and mimetype for each image (max 3)
  // 

  if (galleryFiles.length > 3) {
    return sendError(res, 400, 'Trop d\'images dans la galerie', 'Too many images in the gallery', null);
  }

  for (const galleryFile of galleryFiles) {
    if (galleryFile.size > maxImageSize) {
      const sizeMB = (galleryFile.size / 1024 / 1024).toFixed(2);
      return sendError(
        res,
        400,
        `Image de galerie trop volumineuse, taille maximale par image : 5MB (actuel : ${sizeMB}MB)`,
        `Gallery image too large, maximum size per image : 5MB (current : ${sizeMB}MB)`,
        null
      );
    }

    if (!galleryFile.mimetype.startsWith('image/')) {
      return sendError(res, 400, 'Format image invalide', 'Invalid image format', null);
    }
  }

  // 
  // validate subtitles (optional) extension and size
  // 

  if (subtitlesFile) {
    const ext = path.extname(subtitlesFile.originalname).toLowerCase();

    if (!['.srt', '.vtt'].includes(ext)) {
      return sendError(
        res,
        400,
        'Format de sous-titres invalide (.srt, .vtt uniquement)',
        'Invalid subtitles format (.srt, .vtt only)',
        null
      );
    }

    // optional but safe to limit size
    if (subtitlesFile.size > 5 * 1024 * 1024) { // 5MB
      return sendError(
        res,
        400,
        'Fichier de sous-titres trop volumineux',
        'Subtitles file too large',
        null
      );
    }
  }

  // 
  // validate data (JSON + Zod)
  // 

  if (!req.body.data) {
    return sendError(res, 400, 'Information manquante', 'Missing information', null);
  }

  let submissionData;
  try {
    submissionData = JSON.parse(req.body.data);
  } catch {
    return sendError(res, 400, 'Données entrées invalides', 'Invalid data entered', null);
  }

  let validatedData;
  try {
    validatedData = submissionSchema.parse(submissionData);
  } catch (err) {
    return sendError(res, 422, 'Données invalides', 'Invalid data', err.message);
  }

  // 
  // calculate duration
  // 

  let durationSeconds = null;
  try {
    durationSeconds = await getVideoDurationInSeconds(videoFile.path);
    durationSeconds = Math.round(durationSeconds);
  } catch (err) {
    console.warn('Error calculating video duration:', err.message);
    // continue without duration (NULL in the database)
    // submission not blocked
  }

  // 
  // connect to the database and start a transaction
  // 

  let connection;
  let transactionStarted = false;

  try {
    connection = await db.pool.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    // 
    // create submission row first
    // 

    const submissionId = await createSubmission(
      connection,
      validatedData,
      videoFile.path, // temporary path (will be replaced later)
      coverFile.path,
      durationSeconds
    );

    await submissions_tagsModel.addTagsToSubmission(connection, submissionId, validatedData.tagIds);

    // 
    // create final folders directories for video, cover, subtitles and gallery
    // 

    const finalDir = path.join(
      getUploadsBasePath(),
      'submissions',
      submissionId.toString()
    );

    await fs.mkdir(path.join(finalDir, 'gallery'), { recursive: true });

    // 
    // move files to final location
    // 

    const finalVideoPath = path.join(finalDir, `video${videoExt}`);
    const finalCoverExt = path.extname(coverFile.originalname).toLowerCase();
    const finalCoverPath = path.join(finalDir, `cover${finalCoverExt}`);

    await fs.rename(videoFile.path, finalVideoPath);
    await fs.rename(coverFile.path, finalCoverPath);

    let finalSubtitlesPath = null;
    let subtitlesExt = null;

    if (subtitlesFile) {
      subtitlesExt = path.extname(subtitlesFile.originalname).toLowerCase();
      finalSubtitlesPath = path.join(finalDir, `subtitles${subtitlesExt}`);
      await fs.rename(subtitlesFile.path, finalSubtitlesPath);
    }

    // 
    // build public URLs
    // 

    const videoUrl = `/uploads/submissions/${submissionId}/video${videoExt}`;
    const coverUrl = `/uploads/submissions/${submissionId}/cover${finalCoverExt}`;
    const subtitlesUrl = finalSubtitlesPath
      ? `/uploads/submissions/${submissionId}/subtitles${subtitlesExt}`
      : null;

    await updateFilePaths(
      connection,
      submissionId,
      videoUrl,
      coverUrl,
      subtitlesUrl
    );

    // 
    // create gallery images
    // 

    const galleryUrls = [];

    for (let i = 0; i < galleryFiles.length; i++) {
      const file = galleryFiles[i];
      const ext = path.extname(file.originalname).toLowerCase();

      const finalPath = path.join(
        finalDir,
        'gallery',
        `image${i + 1}${ext}`
      );

      await fs.rename(file.path, finalPath);

      galleryUrls.push(
        `/uploads/submissions/${submissionId}/gallery/image${i + 1}${ext}`
      );
    }

    if (galleryUrls.length) {
      await galleryModel.createGalleryImages(
        connection,
        submissionId,
        galleryUrls
      );
    }

    // 
    // create collaborators and socials
    // 

    if (validatedData.collaborators?.length) {
      await collaboratorModel.createCollaborators(
        connection,
        submissionId,
        validatedData.collaborators
      );
    }

    if (validatedData.socials?.length) {
      await socialModel.createSocials(
        connection,
        submissionId,
        validatedData.socials
      );
    }

    await connection.commit();
    transactionStarted = false;
    // return success response

    return sendSuccess(res, 201, 'Soumission créée avec succès', 'Submission created successfully', {
      submission_id: submissionId,
      duration_seconds: durationSeconds
    });

  } catch (error) {

    // 
    // rollback only if a transaction was started
    // 

    if (connection && transactionStarted) {
      try {
        await connection.rollback();
      } catch (e) {
        console.warn('Rollback failed:', e.message);
      }
    }

    // 
    // cleanup remaining temporary files
    // 

    if (req.files) {
      const filesToClean = [
        req.files.video?.[0]?.path,
        req.files.cover?.[0]?.path,
        req.files.subtitles?.[0]?.path,
        ...(req.files.gallery || []).map(f => f.path)
      ].filter(Boolean);

      for (const p of filesToClean) {
        try {
          await fs.unlink(p);
        } catch (_) { }
      }
    }

    console.error('Erreur soumission:', error);

    return sendError(res, 500, 'Erreur lors de la création de la soumission', 'Error creating submission', null);

  } finally {
    if (connection) {
      connection.release();
    }
  }
};


export const getSubmissionsController = async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);
    
    const filters = {
      status: status || null,
      limit: Number.isNaN(parsedLimit) ? 20 : parsedLimit,
      offset: Number.isNaN(parsedOffset) ? 0 : parsedOffset
    };

    const submissions = await getSubmissions(filters);

    return sendSuccess(res, 200,
      'Soumissions récupérées avec succès',
      'Submissions retrieved successfully',
      { count: submissions.length, submissions }
    );

  } catch (error) {

    console.error('Erreur récupération soumissions:', error);
    return sendError(res, 500,
      'Erreur lors de la récupération des soumissions',
      'Error retrieving submissions',
      error.message
    );
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
