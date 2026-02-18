import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createEvent, updateEvent, updateEventCover, deleteEvent, getEvents, getEventById } from '../../models/events/events.model.js';
import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { eventSchema } from '../../utils/schemas/event.schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getUploadsBasePath = () => path.join(__dirname, '../../../uploads');

export const createEventController = async (req, res) => {
  const coverFile = req.files?.cover?.[0] || req.file || null;

  let validatedData;
  try {
    validatedData = eventSchema.parse({
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      location: req.body.location,
      places: Number(req.body.places)
    });
  } catch (err) {
    if (coverFile) await fs.unlink(coverFile.path).catch(() => {});
    return sendError(res, 422, 'Données invalides', 'Invalid data', err.message);
  }

  try {
    console.log(validatedData);
    const eventId = await createEvent({
      ...validatedData,
      cover: null,
      user_id: req.user?.id ?? null
    });

    if (coverFile) {
      const eventDir = path.join(getUploadsBasePath(), 'events', eventId.toString());
      await fs.mkdir(eventDir, { recursive: true });

      const ext = path.extname(coverFile.originalname).toLowerCase();
      const finalPath = path.join(eventDir, `cover${ext}`);

      await fs.rename(coverFile.path, finalPath);

      const finalUrl = `/uploads/events/${eventId}/cover${ext}`;
      await updateEventCover(eventId, finalUrl);
    }

    return sendSuccess(res, 201, 'Événement créé', 'Event created', { eventId });
  } catch (error) {
    if (coverFile) await fs.unlink(coverFile.path).catch(() => {});
    return sendError(res, 500, 'Erreur création événement', 'Event creation error', error.message);
  }
};

export const updateEventController = async (req, res) => {
  const coverFile = req.files?.cover?.[0] || req.file || null;

  try {
    const eventId = Number(req.params.id);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      if (coverFile) await fs.unlink(coverFile.path).catch(() => {});
      return sendError(res, 400, 'ID invalide', 'Invalid ID', null);
    }

    const validatedData = eventSchema.parse({
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      location: req.body.location,
      places: Number(req.body.places)
    });

    await updateEvent(eventId, validatedData);

    if (coverFile) {
      const event = await getEventById(eventId);
      const oldCoverUrl = event?.cover;

      if (oldCoverUrl) {
        const oldCoverPath = path.join(__dirname, '../../../', oldCoverUrl);
        await fs.unlink(oldCoverPath).catch(() => {});
      }

      const eventDir = path.join(getUploadsBasePath(), 'events', eventId.toString());
      await fs.mkdir(eventDir, { recursive: true });

      const ext = path.extname(coverFile.originalname).toLowerCase();
      const finalPath = path.join(eventDir, `cover${ext}`);

      await fs.rename(coverFile.path, finalPath);

      const finalUrl = `/uploads/events/${eventId}/cover${ext}`;
      await updateEventCover(eventId, finalUrl);
    }

    return sendSuccess(res, 200, 'Événement mis à jour', 'Event updated', validatedData);
  } catch (error) {
    if (coverFile) await fs.unlink(coverFile.path).catch(() => {});
    return sendError(res, 500, 'Erreur mise à jour événement', 'Event update error', error.message);
  }
};

export const deleteEventController = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendError(res, 400, 'ID invalide', 'Invalid ID', null);
    }

    await deleteEvent(eventId);

    const eventDir = path.join(getUploadsBasePath(), 'events', eventId.toString());
    await fs.rm(eventDir, { recursive: true, force: true });

    return sendSuccess(res, 200, 'Événement supprimé', 'Event deleted', null);
  } catch (error) {
    return sendError(res, 500, 'Erreur suppression événement', 'Event deletion error', error.message);
  }
};

export const getEventsController = async (req, res) => {
  try {
    const events = await getEvents();
    return sendSuccess(res, 200, 'Événements récupérés', 'Events retrieved', { count: events.length, events });
  } catch (error) {
    return sendError(res, 500, 'Erreur récupération événements', 'Events retrieval error', error.message);
  }
};

export const getEventByIdController = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendError(res, 400, 'ID invalide', 'Invalid ID', null);
    }

    const event = await getEventById(eventId);
    if (!event) return sendError(res, 404, 'Événement introuvable', 'Event not found', null);

    return sendSuccess(res, 200, 'Événement récupéré', 'Event retrieved', event);
  } catch (error) {
    return sendError(res, 500, 'Erreur récupération événement', 'Event retrieval error', error.message);
  }
};
