import { useEffect, useRef } from 'react';
import { useSubmission } from '../hooks/useSubmission.js';
import StepIndicator from '../components/StepIndicator.jsx';
import CGUForm from '../components/CGUForm.jsx';
import SubmissionForm from '../components/SubmissionForm.jsx';
import VideoUpload from '../components/VideoUpload.jsx';
import FileUploader from '../components/FileUploader.jsx';
import CreatorForm from '../components/CreatorForm.jsx';
import CollaboratorsList from '../components/CollaboratorsList.jsx';
import GalleryUpload from '../components/GalleryUpload.jsx';
import SocialLinksList from '../components/SocialLinksList.jsx';

/**
 * Page de soumission de film (4 étapes)
 * Étape 1 : Conditions d'utilisation
 * Étape 2 : Informations vidéo (champs texte uniquement)
 * Étape 3 : Uploads de fichiers (vidéo, cover, srt, gallery)
 * Étape 4 : Réalisateur et Contributeurs
 * Design épuré et simple
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
  
  const prevStepRef = useRef(currentStep);
  const prevErrorsRef = useRef(errors);
  
  // Défilement vers le haut lors du changement d'étape
  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);
  
  // Défilement vers le premier champ en erreur
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0 && JSON.stringify(prevErrorsRef.current) !== JSON.stringify(errors)) {
      // Attendre un peu pour que le DOM soit mis à jour
      setTimeout(() => {
        // Chercher le premier champ en erreur en cherchant les éléments avec border-red-500
        // ou les messages d'erreur
        
        // Chercher d'abord les messages d'erreur (plus fiable)
        const errorMessages = document.querySelectorAll('.text-red-500');
        if (errorMessages.length > 0) {
          const firstError = errorMessages[0];
          // Chercher le champ associé (input/textarea/select avant le message d'erreur)
          let fieldElement = firstError.previousElementSibling;
          if (!fieldElement || (fieldElement.tagName !== 'INPUT' && fieldElement.tagName !== 'TEXTAREA' && fieldElement.tagName !== 'SELECT')) {
            // Chercher dans le parent
            const parent = firstError.parentElement;
            if (parent) {
              fieldElement = parent.querySelector('input, textarea, select');
            }
          }
          
          if (fieldElement) {
            fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            fieldElement.focus();
            return;
          } else {
            // Si pas de champ trouvé, scroller vers le message d'erreur
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
          }
        }
        
        // Fallback : chercher les champs avec border-red-500
        const errorFields = document.querySelectorAll('.border-red-500');
        if (errorFields.length > 0) {
          const firstField = errorFields[0];
          firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (firstField.tagName === 'INPUT' || firstField.tagName === 'TEXTAREA' || firstField.tagName === 'SELECT') {
            firstField.focus();
          }
          return;
        }
        
        // Dernier recours : remonter en haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
      
      prevErrorsRef.current = errors;
    }
  }, [errors]);
  
  const handleSubmit = async () => {
    // Valider l'étape 4 avant de soumettre
    if (!validateStep(4)) {
      // Les erreurs sont déjà définies par validateStep
      // Le useEffect gérera le défilement vers les erreurs
      return;
    }
    
    try {
      await submit();
    } catch {
      // Erreur déjà gérée dans le hook 
    }
  };
  
  if (submitSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border border-green-500 rounded p-6 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Soumission réussie !
          </h2>
          <p className="text-green-700 mb-4">
            Votre film a été soumis avec succès.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            ID de soumission : {submitSuccess.submission_id}
          </p>
          {submitSuccess.duration_seconds && (
            <p className="text-sm text-gray-600 mb-4">
              Durée : {Math.floor(submitSuccess.duration_seconds / 60)}min {submitSuccess.duration_seconds % 60}sec
            </p>
          )}
          <button
            onClick={reset}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Soumettre un autre film
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 pl-8">
      <h1 className="text-3xl font-bold mb-8">Soumission de film</h1>
      
      <StepIndicator currentStep={currentStep} totalSteps={4} />
      
      <div className="bg-white border rounded p-6 pl-8 mb-6">
        {/* Partie 1 : CGU */}
        {currentStep === 1 && (
          <CGUForm
            formData={formData}
            errors={errors}
            updateField={updateField}
          />
        )}
        
        {/* Partie 2 : Informations vidéo (champs texte uniquement) */}
        {currentStep === 2 && (
          <SubmissionForm
            formData={formData}
            errors={errors}
            updateField={updateField}
          />
        )}
        
        {/* Partie 3 : Uploads de fichiers */}
        {currentStep === 3 && (
          <div className="space-y-6 pl-4">
            <h2 className="text-2xl font-bold mb-4">Upload des fichiers</h2>
            
            <VideoUpload
              value={formData.video}
              onChange={(file) => updateField('video', file)}
              error={errors.video}
            />
            
            <FileUploader
              label="Image de couverture"
              accept="image/jpeg,image/jpg,image/png"
              maxSizeMB={5}
              value={formData.cover}
              onChange={(file) => updateField('cover', file)}
              error={errors.cover}
              required={true}
            />
            
            <FileUploader
              label="Sous-titres (.srt)"
              accept=".srt"
              value={formData.subtitles}
              onChange={(file) => updateField('subtitles', file)}
              error={errors.subtitles}
              required={false}
            />
            
            <GalleryUpload
              formData={formData}
              errors={errors}
              updateField={updateField}
            />
          </div>
        )}
        
        {/* Partie 4 : Réalisateur et Contributeurs */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <CreatorForm
              formData={formData}
              errors={errors}
              updateField={updateField}
            />
            
            <div className="border-t pt-6">
              <SocialLinksList
                formData={formData}
                errors={errors}
                updateField={updateField}
              />
            </div>
            
            <div className="border-t pt-6">
              <CollaboratorsList
                formData={formData}
                errors={errors}
                updateField={updateField}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Messages d'erreur */}
      {submitError && (
        <div className="bg-red-50 border border-red-500 rounded p-4 mb-6">
          <p className="text-red-700">{submitError}</p>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex justify-between pl-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded ${currentStep === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 text-white'}`}
        >
          Précédent
        </button>
        
        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Suivant
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white'}`}
          >
            {isSubmitting ? 'Soumission en cours...' : 'Soumettre le film'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Submit;
