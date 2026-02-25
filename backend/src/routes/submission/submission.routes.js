import { Router } from 'express';
import { submitController, getSubmissionsController, getSubmissionByIdController } from '../../controllers/submissions/submissions.controller.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/',
  uploadSubmissionFiles,
  handleUploadError,
  submitController
);

router.get(
  '/',
  authenticate,
  getSubmissionsController
);

router.get(
  '/:id',
  authenticate,
  requireRole([2, 3]),
  getSubmissionByIdController
);

export default router;
