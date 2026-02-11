import { Router } from 'express';
import { uploadToYoutube, deleteToYoutube } from '../../controllers/submissions/youtube.controller.js';

const router = Router();


router.post('/:id/upload', uploadToYoutube);
router.delete('/:id/delete', deleteToYoutube);


export default router;
