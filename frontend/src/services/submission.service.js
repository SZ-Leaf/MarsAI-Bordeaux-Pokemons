import { apiCall } from '../utils/api';

export const submitFilm = async (formData) => {
  return apiCall('/api/submissions', {
    method: 'POST',
    body: formData
  });
};

export const getSubmissionById = async (submissionId) => {
  return apiCall(`/api/submissions/${submissionId}`);
};

export const getSubmissionsService = async ({filters}) => {
  const params = {
    limit: filters.limit,
    offset: filters.offset,
    sortBy: filters.sortBy
  };
  if (filters.type) {
    params.type = filters.type;
  }
  if (filters.rated) {
    params.rated = filters.rated;
  }
  if (filters.playlist) {
    params.playlist = filters.playlist;
  }
  return apiCall('/api/submissions', {
    method: 'GET',
    params: params
  });
};
