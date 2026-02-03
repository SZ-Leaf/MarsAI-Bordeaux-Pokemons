import { Router } from 'express';
import { submitController, getSubmissionsController, getSubmissionByIdController, getSubmissionTagsByIdController } from '../../controllers/submissions/submissions.controller.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';

const router = Router();

router.post(
  '/submit',
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

router.get('/:id/tags', getSubmissionTagsByIdController)

export default router;
