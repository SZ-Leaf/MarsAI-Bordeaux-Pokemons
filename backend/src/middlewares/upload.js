import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadsBasePath = () => path.join(__dirname, '../../uploads');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    if (
      file.fieldname === 'cover' &&
      req.originalUrl.includes('/sponsors')
    ) {
      folder = 'sponsors';
    }
      else {
      folder = 'submissions/temp';
    }

    const dir = path.join(getUploadsBasePath(), folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

/* ===========================
   FILE FILTER
=========================== */
const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = ['video/mp4', 'video/quicktime'];
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const allowedSubtitleTypes = [
    'text/plain',
    'application/x-subrip',
    'application/octet-stream'
  ];

  if (file.fieldname === 'video') {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ['.mp4', '.mov'].includes(ext) &&
      allowedVideoTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Format vidéo invalide. Formats acceptés : MP4, MOV'));
    }

  } else if (file.fieldname === 'cover' || file.fieldname === 'gallery') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format image invalide. Formats acceptés : JPEG, JPG, PNG'));
    }

  } else if (file.fieldname === 'subtitles') {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.srt' || allowedSubtitleTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format sous-titres invalide. Format accepté : .srt'));
    }

  } else {
    cb(new Error('Type de fichier non autorisé'));
  }
};

/* ===========================
   MULTER INSTANCE
=========================== */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 314572800 // 300MB
  }
});

/* ===========================
   MIDDLEWARE PRINCIPAL
=========================== */
export const uploadSubmissionFiles = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
  { name: 'gallery', maxCount: 3 },
  { name: 'subtitles', maxCount: 1 }
]);

/* ===========================
   ERROR HANDLER
=========================== */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Trop de fichiers' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Champ de fichier inattendu' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    return res.status(400).json({ error: err.message });
  }

  next();
};

export default uploadSubmissionFiles;
