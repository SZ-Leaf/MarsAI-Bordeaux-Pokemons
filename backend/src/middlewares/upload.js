import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadsBasePath = () => path.join(__dirname, '../../uploads');

const MAX_SIZES = {
  video: 300 * 1024 * 1024,
  cover: 5 * 1024 * 1024,
  gallery: 5 * 1024 * 1024,
  subtitles: 2 * 1024 * 1024
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    if (file.fieldname === 'cover' && req.originalUrl.includes('/sponsors')) {
      folder = 'sponsors/tmp';
    } else {
      folder = 'submissions/tmp';
    }

    const dir = path.join(getUploadsBasePath(), folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = ['video/mp4', 'video/quicktime'];
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const allowedSubtitleTypes = [
    'text/plain',
    'application/x-subrip',
    'application/octet-stream'
  ];

  const maxSize = MAX_SIZES[file.fieldname];
  if (maxSize && file.size > maxSize) {
    return cb(new Error(`Fichier trop volumineux (${file.fieldname})`));
  }

  if (file.fieldname === 'video') {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.mp4', '.mov'].includes(ext) && allowedVideoTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Format vidéo invalide'));
  }

  if (file.fieldname === 'cover' || file.fieldname === 'gallery') {
    if (allowedImageTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Format image invalide'));
  }

  if (file.fieldname === 'subtitles') {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.srt' || allowedSubtitleTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Format sous-titres invalide'));
  }

  return cb(new Error('Type de fichier non autorisé'));
};

const upload = multer({ storage, fileFilter });

export const uploadSubmissionFiles = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
  { name: 'gallery', maxCount: 3 },
  { name: 'subtitles', maxCount: 1 }
]);

export const handleUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

export default uploadSubmissionFiles;
