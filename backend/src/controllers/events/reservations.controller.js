import { createReservation, confirmReservationWithSeatUpdate } from "../../models/events/reservations.model.js"
import { getEventById } from "../../models/events/events.model.js";
import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { generateReservationConfirmToken, verifyReservationConfirmToken } from '../../services/mailer/mailer.tokens.js';
import { sendReservationConfirmation } from "../../services/mailer/mailer.mail.js";

export const createReservationController = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;

    const eventId = Number(req.params.id);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendError(res, 400, 'ID invalide', 'Invalid ID', null);
    }

    const event = await getEventById(eventId);
    if (!event) {
      return sendError(res, 404, 'Événement introuvable', 'Event not found', null);
    }

    const reservationId = await createReservation({
      first_name,
      last_name,
      email,
      event_id: eventId
    });

    const token = generateReservationConfirmToken(reservationId, email);

    await sendReservationConfirmation(email, token, reservationId);

    return sendSuccess(
      res,
      201,
      'Réservation créée',
      'Reservation created',
      { reservationId }
    );

  } catch (error) {

    if (error.message === 'NO_PLACES_AVAILABLE') {
      return sendError(
        res,
        400,
        'Plus de places disponibles',
        'No seats available',
        null
      );
    }

    if (error.message === 'EMAIL_ALREADY_REGISTERED') {
      return sendError(
        res,
        400,
        'Email déjà inscrit pour cet événement',
        'Email already registered for this event',
        null
      );
    }

    return sendError(
      res,
      500,
      'Erreur création réservation',
      'Reservation creation error',
      error.message
    );
  }
};

export const reservationConfirmation = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return sendError(res, 400, "Token manquant", "Missing token", null);
    }

    const decoded = verifyReservationConfirmToken(token);
    console.log(decoded);
    const { reservationId } = decoded;

    await confirmReservationWithSeatUpdate(reservationId);

    return sendSuccess(
      res,
      200,
      "Réservation confirmée avec succès",
      "Reservation successfully confirmed",
      null
    );

  } catch (error) {

    if (error.message === "NO_PLACES_AVAILABLE") {
      return sendError(res, 400, "Plus de places disponibles", "No seats available", null);
    }

    if (error.message === "ALREADY_CONFIRMED") {
      return sendError(res, 400, "Déjà confirmée", "Already confirmed", null);
    }

    return sendError(
      res,
      400,
      "Confirmation impossible",
      "Confirmation failed",
      error.message
    );
  }
};
