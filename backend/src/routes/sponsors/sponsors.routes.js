import { Router } from 'express';
import { createSponsors } from '../../controllers/sponsors/sponsors.controller.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';

const router = Router();

router.post('/', createSponsors);

export default router;
