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

export default {
  subscribeNewsletter,
  confirmNewsletter,
  unsubscribeNewsletter,
};
