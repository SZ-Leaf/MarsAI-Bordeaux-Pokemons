import { apiCall } from '../utils/api';

// Soumettre un film
export const submitFilm = async (formData) => {
  return apiCall('/api/submissions', {
    method: 'POST',
    body: formData
  });
};

// Récupérer une soumission par ID
export const getSubmissionById = async (submissionId) => {
  return apiCall(`/api/submissions/${submissionId}`);
};

export const getSubmissionsService = async ({filters}) => {
  return apiCall('/api/submissions', {
    method: 'GET',
    params: {
      limit: filters.limit,
      offset: filters.offset,
      orderBy: filters.orderBy,
      status: filters.status
    }
  });
};