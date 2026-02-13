import { apiCall } from '../utils/api';

// Inscription à la newsletter (envoie un email de confirmation)
export const subscribeNewsletter = async (email, consent) => {
  return apiCall('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email: email?.trim(), consent: !!consent }),
  });
};

// Confirmation de l'inscription (double opt-in)
export const confirmNewsletter = async (token) => {
  const params = new URLSearchParams({ token });
  return apiCall(`/api/newsletter/confirm?${params.toString()}`, {
    method: 'GET',
  });
};

// Désinscription
export const unsubscribeNewsletter = async (token) => {
  const params = new URLSearchParams({ token });
  return apiCall(`/api/newsletter/unsubscribe?${params.toString()}`, {
    method: 'GET',
  });
};

// ========== ADMIN (authentification requise, credentials: 'include') ==========

export const getNewsletters = async () => {
  return apiCall('/api/newsletter/admin', { method: 'GET' });
};

export const getNewsletterById = async (id) => {
  return apiCall(`/api/newsletter/admin/${id}`, { method: 'GET' });
};

export const createNewsletter = async ({ title, subject, content }) => {
  return apiCall('/api/newsletter/admin', {
    method: 'POST',
    body: JSON.stringify({ title, subject, content }),
  });
};

export const updateNewsletter = async (id, { title, subject, content }) => {
  return apiCall(`/api/newsletter/admin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title, subject, content }),
  });
};

export const deleteNewsletter = async (id) => {
  return apiCall(`/api/newsletter/admin/${id}`, { method: 'DELETE' });
};

export const sendNewsletter = async (id) => {
  return apiCall(`/api/newsletter/admin/${id}/send`, { method: 'POST' });
};

export const getNewsletterStats = async (id) => {
  return apiCall(`/api/newsletter/admin/${id}/stats`, { method: 'GET' });
};

export const listSubscribers = async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiCall(`/api/newsletter/admin/subscribers${q ? `?${q}` : ''}`, { method: 'GET' });
};

export const deleteSubscriber = async (id) => {
  return apiCall(`/api/newsletter/admin/subscribers/${id}`, { method: 'DELETE' });
};

export default {
  subscribeNewsletter,
  confirmNewsletter,
  unsubscribeNewsletter,
  getNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  sendNewsletter,
  getNewsletterStats,
  listSubscribers,
  deleteSubscriber,
};
