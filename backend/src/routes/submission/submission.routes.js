import { Router } from 'express';
import { submitController, getSubmissionsController, getSubmissionByIdController } from '../../controllers/submissions/submissions.controller.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';

const router = Router();

router.post(
  '/',
  uploadSubmissionFiles,
  handleUploadError,
  submitController
);

router.get(
  '/',
  getSubmissionsController
);

router.get(
  '/:id',
  getSubmissionByIdController
);

export default router;
