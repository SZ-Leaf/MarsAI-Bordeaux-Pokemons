import { createReservationWithSeatUpdate } from "../../models/events/reservations.model.js"
import { getEventById } from "../../models/events/events.model.js"
import { sendError, sendSuccess } from '../../helpers/response.helper.js';

export const createReservationController = async (req, res) => {
  try {
    const {first_name, last_name, email} = req.body;
    console.log(first_name, last_name, email);

    const eventId = Number(req.params.id);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendError(res, 400, 'ID invalide', 'Invalid ID', null);
    }

    const event = await getEventById(eventId);
    if (!event) {
      return sendError(res, 404, 'Événement introuvable', 'Event not found', null);
    }

    const reservation = await createReservationWithSeatUpdate({first_name, last_name, email, event_id: eventId});


    return sendSuccess(res, 201, 'Réservation créée', 'Reservation created', reservation );

  } catch (error) {
    return sendError(res, 500, 'Erreur création réservation', 'Reservation creation error', error.message);
  }
};
