import { useState } from 'react';

export const useRatingModal = (rateSubmission) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);

  const handleRatingSubmit = async (submissionId, ratingValue, comment) => {
    try {
      await rateSubmission(submissionId, ratingValue, comment);
      setRating(ratingValue);
      setShowRatingModal(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const openModal = () => setShowRatingModal(true);
  const closeModal = () => setShowRatingModal(false);

  return {
    showRatingModal,
    rating,
    handleRatingSubmit,
    openModal,
    closeModal
  };
};
