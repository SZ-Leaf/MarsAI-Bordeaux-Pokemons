import { apiCall } from '../utils/api';

export const getSponsorsService = async () => {
   return apiCall('/api/sponsors', { method: 'GET' });
};

export const createSponsorService = async (sponsor) => {
   return apiCall('/api/sponsors', { method: 'POST', body: sponsor });
};


export const deleteSponsorService = async (id) => {
   return apiCall(`/api/sponsors/${id}`, { method: 'DELETE' });
};