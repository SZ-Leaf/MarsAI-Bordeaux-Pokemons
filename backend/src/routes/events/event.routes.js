import { Router } from 'express';
import {
  createEventController,
  updateEventController,
  deleteEventController,
  getEventsController,
  getEventByIdController
} from '../../controllers/events/events.controller.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole([2, 3]),
  uploadSubmissionFiles,
  handleUploadError,
  createEventController
);

router.put(
  '/:id',
  authenticate,
  requireRole([2, 3]),
  uploadSubmissionFiles,
  handleUploadError,
  updateEventController
);

router.delete(
  '/:id',
  authenticate,
  requireRole([2, 3]),
  deleteEventController
);

router.get('/', getEventsController);

router.get('/:id', getEventByIdController);

export default router;
