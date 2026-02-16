import { Router } from 'express';
import { createReservationController } from '../../controllers/events/reservations.controller.js';
const router = Router();

router.post('/:id/reservation', createReservationController);

export default router;
