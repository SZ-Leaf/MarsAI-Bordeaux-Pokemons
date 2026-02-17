import { Router } from 'express';
import { createReservationController, reservationConfirmation } from '../../controllers/events/reservations.controller.js';
const router = Router();

router.post('/:id/reservation', createReservationController);
router.get('/:id/reservation/confirm', reservationConfirmation)

export default router;
