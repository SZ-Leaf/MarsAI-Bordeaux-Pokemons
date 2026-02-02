import { Router } from 'express';
import { uploadToYoutube } from '../../controllers/submissions/youtube_controller.js';

const router = Router();


router.post('/:id/upload-youtube', uploadToYoutube);


export default router;
