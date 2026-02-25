import { Router } from 'express';
import { createEventController, updateEventController, deleteEventController, getEventsController, getEventByIdController } from '../../controllers/events/events.controller.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';
import { createPublicRateLimit } from '../../middlewares/public_rate_limit.middleware.js';

const router = Router();

router.post('/', authenticate, requireRole([2, 3]), uploadSubmissionFiles, handleUploadError, createEventController);

router.put('/:id', authenticate, requireRole([2, 3]), uploadSubmissionFiles, handleUploadError, updateEventController);

router.delete('/:id', authenticate, requireRole([2, 3]), deleteEventController);

router.get('/', createPublicRateLimit(120, 'minute'), getEventsController);

router.get('/:id', createPublicRateLimit(120, 'minute'), getEventByIdController);

export default router;
