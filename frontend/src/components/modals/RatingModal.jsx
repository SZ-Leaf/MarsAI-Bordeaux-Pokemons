import { useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from './Modal';
import TextArea from '../shared/TextArea';
import StarRating from '../shared/StarRating';

const RatingModal = ({ isOpen, onClose, submission, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setRating(0);
    setComment('');
    setError('');
  };

  const handleSubmit = async () => {
    // Vérifier qu'au moins une valeur est fournie
    if (rating === 0 && comment.trim() === '') {
      setError('Veuillez fournir au moins une note ou un commentaire');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(submission.id, rating, comment);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError(error.message || 'Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Utiliser createPortal pour rendre la modal directement dans le body
  return createPortal(
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Évaluer la vidéo"
      size="md"
    >
      <div className="space-y-6">
        {/* Titre de la vidéo */}
        <div className="pb-4 border-b border-white/10">
          <h3 className="font-semibold text-lg text-white">
            {submission?.english_title}
          </h3>
        </div>

        {/* Section de notation */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">
            Note (optionnel)
          </label>
          <div className="py-4">
            <StarRating 
              value={rating}
              onChange={setRating}
              showLabel={true}
            />
          </div>
        </div>

        {/* Section de commentaire */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">
            Commentaire (optionnel)
          </label>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre avis sur cette vidéo..."
            rows={5}
            maxLength={500}
            showCounter={true}
            variant="dark"
            className="w-full resize-none"
          />
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 
                     text-white rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi...' : 'Soumettre'}
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
};

export default RatingModal;