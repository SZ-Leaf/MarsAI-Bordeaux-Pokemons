import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from '../../../../ui';
import { TextArea } from '../../../../ui';
import { StarRating } from '../../../../ui';
import { useLanguage } from '../../../../../context/LanguageContext';
import { rateSubmissionSchema } from '@marsai/schemas';
import { zodErrors, FieldError } from '../../../../../helpers/zodHelper';

const RatingModal = ({ isOpen, onClose, submission, onSubmit }) => {
  const { language } = useLanguage();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const resetForm = () => {
    setRating(0);
    setComment('');
    setFieldErrors({});
    setApiError(null);
  };

  const handleSubmit = async () => {
    setApiError(null);

    // Business rule: at least rating or comment required
    if (rating === 0 && comment.trim() === '') {
      setFieldErrors({
        rating: language === 'fr'
          ? 'Veuillez fournir au moins une note ou un commentaire.'
          : 'Please provide at least a rating or a comment.',
      });
      return;
    }

    // Schema validation for field formats
    const payload = {
      rating: rating > 0 ? rating : null,
      comment: comment.trim() || null,
    };

    try {
      rateSubmissionSchema.parse(payload);
      setFieldErrors({});
    } catch (err) {
      setFieldErrors(zodErrors(err, language));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(submission.id, payload.rating, payload.comment);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      const fe = zodErrors(error, language);
      if (Object.keys(fe).length) {
        setFieldErrors(fe);
      } else {
        const m = error?.message;
        setApiError(
          typeof m === 'object' && m !== null
            ? (m[language] ?? m.fr ?? m.en ?? (language === 'fr' ? 'Erreur lors de la soumission.' : 'Submission failed.'))
            : (typeof m === 'string' ? m : (language === 'fr' ? 'Erreur lors de la soumission.' : 'Submission failed.')),
        );
      }
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
      title={language === 'fr' ? 'Évaluer la vidéo' : 'Rate the video'}
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
            {language === 'fr' ? 'Note (optionnel)' : 'Rating (optional)'}
          </label>
          <div className="py-4">
            <StarRating
              value={rating}
              onChange={(v) => { setRating(v); setFieldErrors((p) => ({ ...p, rating: undefined })); }}
              showLabel={true}
            />
          </div>
          <FieldError error={fieldErrors.rating} />
        </div>

        {/* Section de commentaire */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">
            {language === 'fr' ? 'Commentaire (optionnel)' : 'Comment (optional)'}
          </label>
          <TextArea
            value={comment}
            onChange={(e) => { setComment(e.target.value); setFieldErrors((p) => ({ ...p, comment: undefined })); }}
            placeholder={language === 'fr' ? 'Partagez votre avis sur cette vidéo...' : 'Share your thoughts on this video...'}
            rows={5}
            maxLength={500}
            showCounter={true}
            variant="dark"
            className="w-full resize-none"
          />
          <FieldError error={fieldErrors.comment} />
        </div>

        {/* Erreur API générale */}
        {apiError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{apiError}</p>
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
            {language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (language === 'fr' ? 'Envoi...' : 'Submitting...')
              : (language === 'fr' ? 'Soumettre' : 'Submit')}
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
};

export default RatingModal;
