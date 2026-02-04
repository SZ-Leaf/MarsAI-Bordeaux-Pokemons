import { Router } from 'express';
import {createSponsorController, deleteSponsorController, getSponsorsController} from '../../controllers/sponsors/sponsors.controller.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';

const router = Router();

router.post('/', uploadSubmissionFiles, handleUploadError, createSponsorController);
router.delete('/:id', deleteSponsorController);
router.get('/', getSponsorsController);


export default router;
