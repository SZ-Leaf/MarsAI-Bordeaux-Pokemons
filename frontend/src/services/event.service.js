import { apiCall } from '../utils/api';

/**
 * Récupère tous les événements
 */
export const getEvents = async () => {
  return apiCall('/api/events', { method: 'GET' });
};

/**
 * Récupère un événement par son ID
 * @param {number|string} id 
 */
export const getEventById = async (id) => {
  return apiCall(`/api/events/${id}`, { method: 'GET' });
};

/**
 * Crée un nouvel événement
 * @param {FormData} formData - Doit contenir title, description, start_date, end_date, location, places et cover (file)
 */
export const createEvent = async (formData) => {
  return apiCall('/api/events', {
    method: 'POST',
    body: formData, // FormData géré par apiCall (ne pas mettre Content-Type)
  });
};

/**
 * Met à jour un événement existant
 * @param {number|string} id 
 * @param {FormData} formData - Données à mettre à jour
 */
export const updateEvent = async (id, formData) => {
  return apiCall(`/api/events/${id}`, {
    method: 'PUT',
    body: formData,
  });
};

/**
 * Supprime un événement
 * @param {number|string} id 
 */
export const deleteEvent = async (id) => {
  return apiCall(`/api/events/${id}`, {
    method: 'DELETE',
  });
};

export default {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
