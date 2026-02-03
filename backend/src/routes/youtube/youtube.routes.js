import { Router } from 'express';
import { uploadToYoutube } from '../../controllers/submissions/youtube.controller.js';

const router = Router();


router.post('/:id/upload-youtube', uploadToYoutube);


export default router;
