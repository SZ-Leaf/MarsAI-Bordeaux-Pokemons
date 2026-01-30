import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadsBasePath = () => path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(getUploadsBasePath(), 'submissions/temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = ['video/mp4', 'video/quicktime'];
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const ext = path.extname(file.originalname).toLowerCase();

  switch(file.fieldname){
    case 'video':
      if(!['.mp4','.mov'].includes(ext) || !allowedVideoTypes.includes(file.mimetype)){
        return cb(new Error('Format vidéo invalide. Formats acceptés : MP4, MOV'), false);
      }
      if(file.size > 300 * 1024 * 1024) return cb(new Error('Vidéo trop volumineuse (max 300MB)'), false);
      break;

    case 'cover':
    case 'gallery':
      if(!allowedImageTypes.includes(file.mimetype)){
        return cb(new Error('Image invalide. Formats acceptés : JPEG, JPG, PNG'), false);
      }
      if(file.size > 5 * 1024 * 1024) return cb(new Error('Image trop volumineuse (max 5MB)'), false);
      break;

    case 'subtitles':
      if(ext !== '.srt') return cb(new Error('Sous-titres invalide. Format accepté : .srt'), false);
      break;

    default:
      return cb(new Error('Champ de fichier inattendu'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter
});

export const uploadSubmissionFiles = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
  { name: 'gallery', maxCount: 3 },
  { name: 'subtitles', maxCount: 1 }
]);

export const handleUploadError = (err, req, res, next) => {
  if(err instanceof multer.MulterError){
    switch(err.code){
      case 'LIMIT_FILE_SIZE': return res.status(400).json({ error:'Fichier trop volumineux', details: err.message });
      case 'LIMIT_FILE_COUNT': return res.status(400).json({ error:'Trop de fichiers', details: err.message });
      case 'LIMIT_UNEXPECTED_FILE': return res.status(400).json({ error:'Champ de fichier inattendu', details: err.message });
      default: return res.status(400).json({ error:'Erreur upload', details: err.message });
    }
  }
  if(err) return res.status(400).json({ error: err.message || 'Erreur lors de l\'upload' });
  next();
};

export default upload;
