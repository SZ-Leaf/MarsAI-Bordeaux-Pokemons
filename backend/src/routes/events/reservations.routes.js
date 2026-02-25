import { Router } from 'express';
import { createReservationController, reservationConfirmation } from '../../controllers/events/reservations.controller.js';
import { createPublicRateLimit } from '../../middlewares/public_rate_limit.middleware.js';
const router = Router();

router.post('/:id/reservation', createPublicRateLimit(10, 'minute'), createReservationController);
router.get('/:id/reservation/confirm', createPublicRateLimit(10, 'minute'), reservationConfirmation)

export default router;
