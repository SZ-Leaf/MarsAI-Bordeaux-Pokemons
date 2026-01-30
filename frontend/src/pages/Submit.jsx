import { useState } from 'react';
import { useSubmission } from '../hooks/useSubmission.js';
import { useScrollOnStepChange } from '../hooks/useScrollOnStepChange.js';
import { useScrollToError } from '../hooks/useScrollToError.js';
import StepIndicator from '../components/StepIndicator.jsx';
import StepContent from '../components/StepContent.jsx';
import FormNavigation from '../components/FormNavigation.jsx';
import SubmissionSuccess from '../components/SubmissionSuccess.jsx';
import ConfirmationModal from '../components/ConfirmationModal.jsx';

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
  
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  // Hooks personnalisés pour la gestion du scroll
  useScrollOnStepChange(currentStep);
  useScrollToError(errors);
  
  // Gestion de la soumission avec validation
  const handleSubmitClick = () => {
    if (!validateStep(4)) return;
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmationModal(false);
    try {
      await submit();
    } catch {
      // Erreur déjà gérée dans le hook 
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmationModal(false);
  };
  
  // Affichage du message de succès
  if (submitSuccess) {
    return <SubmissionSuccess submitSuccess={submitSuccess} onReset={reset} />;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 pl-8">
      <h1 className="text-3xl font-bold mb-8">Soumission de film</h1>
      
      <StepIndicator currentStep={currentStep} totalSteps={4} />
      
      <StepContent 
        currentStep={currentStep}
        formData={formData}
        errors={errors}
        updateField={updateField}
      />
      
      {/* Messages d'erreur globaux */}
      {submitError && (
        <div className="bg-red-50 border border-red-500 rounded p-4 mb-6">
          <p className="text-red-700">{submitError}</p>
        </div>
      )}
      
      <FormNavigation
        currentStep={currentStep}
        totalSteps={4}
        isSubmitting={isSubmitting}
        onPrevious={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmitClick}
      />

      {/* Modale de confirmation */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      />
    </div>
  );
};

export default Submit;
