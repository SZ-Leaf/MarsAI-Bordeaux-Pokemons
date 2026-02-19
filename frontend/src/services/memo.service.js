import { apiCall } from '../utils/api';

export const saveMemo = async (submissionId, { rating, comment, playlist }) => {
   return apiCall(`/api/selector/rate/${submissionId}`, {
      method: 'POST',
      body: { rating, comment, playlist }
   });
};

export const deleteMemo = async (submissionId) => {
   return apiCall(`/api/selector/rate/${submissionId}`, { method: 'DELETE' });
};
