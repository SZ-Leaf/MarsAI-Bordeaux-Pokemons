import { Router } from 'express';
import { uploadToYoutube, deleteToYoutube, updateToYoutube } from '../../controllers/submissions/youtube.controller.js';

const router = Router();


router.post('/:id/upload', uploadToYoutube);
router.delete('/:id/delete', deleteToYoutube);
router.put('/:id/update', updateToYoutube);


export default router;
