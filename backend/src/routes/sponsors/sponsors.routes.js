import { Router } from 'express';
import {createSponsorController} from '../../controllers/sponsors/sponsors.controller.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';

const router = Router();

router.post('/', uploadSubmissionFiles, handleUploadError, createSponsorController);


export default router;
