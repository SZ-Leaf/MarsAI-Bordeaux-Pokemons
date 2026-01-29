import { useSubmission } from '../hooks/useSubmission.js';
import StepIndicator from '../components/StepIndicator.jsx';
import CGUForm from '../components/CGUForm.jsx';
import SubmissionForm from '../components/SubmissionForm.jsx';
import VideoUpload from '../components/VideoUpload.jsx';
import FileUploader from '../components/FileUploader.jsx';
import CreatorForm from '../components/CreatorForm.jsx';
import CollaboratorsForm from '../components/CollaboratorsForm.jsx';
import GalleryUpload from '../components/GalleryUpload.jsx';
import SocialLinksForm from '../components/SocialLinksForm.jsx';

/**
 * Page de soumission de film (4 étapes)
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
    updateCollaboratorField,
    updateSocialField,
    nextStep,
    prevStep,
    submit,
    reset,
    validateStep
  } = useSubmission();
  
  const handleSubmit = async () => {
    // Valider l'étape 4 avant de soumettre
    if (!validateStep(4)) {
      // Les erreurs sont déjà définies par validateStep
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
        
        {/* Partie 2 : Infos vidéo + upload */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <SubmissionForm
              formData={formData}
              errors={errors}
              updateField={updateField}
            />
            
            <div className="border-t pt-6">
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
          </div>
        )}
        
        {/* Partie 3 : Infos réalisateur */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <CreatorForm
              formData={formData}
              errors={errors}
              updateField={updateField}
            />
            
            <div className="border-t pt-6">
              <SocialLinksForm
                formData={formData}
                errors={errors}
                updateField={updateField}
                updateSocialField={updateSocialField}
              />
            </div>
          </div>
        )}
        
        {/* Partie 4 : Contributeurs */}
        {currentStep === 4 && (
            <CollaboratorsForm
              formData={formData}
              errors={errors}
              updateField={updateField}
              updateCollaboratorField={updateCollaboratorField}
            />
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
