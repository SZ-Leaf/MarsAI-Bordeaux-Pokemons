import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin de base pour les uploads (depuis backend/src/)
const getUploadsBasePath = () => {
  return path.join(__dirname, '../uploads');
};

// Configuration du stockage temporaire
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Les fichiers seront stockés temporairement avant déplacement final
    const tempDir = path.join(getUploadsBasePath(), 'submissions/temp');

    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique pour éviter les collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtre de validation des fichiers
const fileFilter = (req, file, cb) => {
  // Types MIME acceptés
  const allowedVideoTypes = ['video/mp4', 'video/quicktime']; // MP4 et MOV
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const allowedSubtitleTypes = ['text/plain', 'application/x-subrip', 'application/octet-stream']; // .srt

  if (file.fieldname === 'video') {
    // Validation vidéo : MP4 ou MOV uniquement
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.mp4', '.mov'].includes(ext) && allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format vidéo invalide. Formats acceptés : MP4, MOV'), false);
    }
  } else if (file.fieldname === 'cover' || file.fieldname === 'gallery') {
    // Validation images : JPEG, JPG, PNG
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format image invalide. Formats acceptés : JPEG, JPG, PNG'), false);
    }
  } else if (file.fieldname === 'subtitles') {
    // Validation sous-titres : .srt uniquement
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.srt' || allowedSubtitleTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format sous-titres invalide. Format accepté : .srt'), false);
    }
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

// Configuration Multer avec limites
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 314572800, // 300MB en bytes (pour vidéo)
    fieldSize: 314572800, // Limite pour chaque champ
  }
});

// Middleware pour gérer plusieurs fichiers de soumission
export const uploadSubmissionFiles = upload.fields([
  { name: 'video', maxCount: 1 },      // 1 fichier vidéo (MP4/MOV, max 300MB)
  { name: 'cover', maxCount: 1 },      // 1 image cover (JPEG/JPG/PNG, max 5MB)
  { name: 'gallery', maxCount: 3 },   // 3 images max (JPEG/JPG/PNG, max 5MB chacune)
  { name: 'subtitles', maxCount: 1 }   // 1 fichier .srt (optionnel)
]);

// Middleware de gestion d'erreurs Multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Fichier trop volumineux',
        details: err.message
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Trop de fichiers',
        details: err.message
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      console.log(err);
      return res.status(400).json({
        error: 'Champ de fichier inattendu',
        details: err.message
      });
    }
    return res.status(400).json({
      error: 'Erreur upload',
      details: err.message
    });
  }

  if (err) {
    return res.status(400).json({
      error: err.message || 'Erreur lors de l\'upload'
    });
  }

  next();
};

export default upload;
