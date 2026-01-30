import { useSubmission } from '../hooks/useSubmission.js';
import { useScrollOnStepChange } from '../hooks/useScrollOnStepChange.js';
import { useScrollToError } from '../hooks/useScrollToError.js';
import useModal from '../hooks/useModal.js';
import { StepIndicator, StepContent, SubmissionSuccess } from '../components/submission';
import FormNavigation from '../components/forms/NaviguationForm.jsx';
import ActionConfirmationModal from '../components/modals/ActionConfirmationModal.jsx';
import { totalSteps } from '../constants/submissionSteps.js';

/**
 * Page de soumission de film (4 étapes)
 * Étape 1 : Conditions d'utilisation
 * Étape 2 : Informations vidéo (champs texte uniquement)
 * Étape 3 : Uploads de fichiers (vidéo, cover, srt, gallery)
 * Étape 4 : Réalisateur et Contributeurs
 */
const Submit = () => {
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    submitError,
    submitSuccess,
    updateField,
    nextStep,
    prevStep,
    submit,
    reset,
    validateStep
  } = useSubmission();
  
  const {
    isOpen: showConfirmationModal,
    openModal: openConfirmationModal,
    handleConfirm: handleConfirmSubmit,
    handleCancel: handleCancelSubmit
  } = useModal(submit);
  
  // Hooks personnalisés pour la gestion du scroll
  useScrollOnStepChange(currentStep);
  useScrollToError(errors);
  
  // Gestion de la soumission avec validation
  const handleSubmitClick = () => {
    if (!validateStep(totalSteps)) return;
    openConfirmationModal();
  };
  
  // Affichage du message de succès
  if (submitSuccess) {
    return <SubmissionSuccess submitSuccess={submitSuccess} onReset={reset} />;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 pl-8">
      <h1 className="text-3xl font-bold mb-8">Soumission de film</h1>
      
      <StepIndicator currentStep={currentStep} />
      
      <StepContent 
        currentStep={currentStep}
        formData={formData}
        errors={errors}
        updateField={updateField}
      />
      
      {/* Messages d'erreur globaux */}
      {submitError && (
        <div className="alert alert-error">
          <p className="alert-error-text">{submitError}</p>
        </div>
      )}
      
      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        isSubmitting={isSubmitting}
        onPrevious={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmitClick}
      />

      {/* Modale de confirmation */}
      <ActionConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        title="Confirmer la soumission"
        message="Êtes-vous sûr de vouloir soumettre votre film ? Cette action est définitive."
        confirmText="Confirmer"
        variant="success"
      />
    </div>
  );
};

export default Submit;
