import { apiCall } from '../utils/api';
import { rateSubmissionSchema } from '@marsai/schemas';

export const saveMemo = async (submissionId, { rating, comment, playlist }) => {
   // Validation Zod partagée pour la note/mémo
   rateSubmissionSchema.parse({ rating, comment, playlist });
   return apiCall(`/api/selector/rate/${submissionId}`, {
      method: 'POST',
      body: { rating, comment, playlist }
   });
};

export const deleteMemo = async (submissionId) => {
   return apiCall(`/api/selector/rate/${submissionId}`, { method: 'DELETE' });
};
