import { apiCall } from '../utils/api';

export const getHomepageService = async () => {
  return apiCall('/api/homepage', { method: 'GET' });
};

export const updateHomepageService = async (data) => {
  return apiCall('/api/homepage', { method: 'PUT', body: data });
};
