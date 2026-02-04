import { Router } from 'express';
import {createSponsorController, deleteSponsorController} from '../../controllers/sponsors/sponsors.controller.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';

const router = Router();

router.post('/', uploadSubmissionFiles, handleUploadError, createSponsorController);
router.delete('/:id', deleteSponsorController);


export default router;
