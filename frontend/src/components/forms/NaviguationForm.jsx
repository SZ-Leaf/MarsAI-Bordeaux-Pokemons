/**
 * Composant de navigation pour formulaire multi-étapes
 */
const FormNavigation = ({ 
  currentStep, 
  totalSteps, 
  isSubmitting, 
  onPrevious, 
  onNext, 
  onSubmit 
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className={`flex pl-4 ${isFirstStep ? 'justify-end' : 'justify-between'}`}>
      {!isFirstStep && (
        <button
          onClick={onPrevious}
          className="px-6 py-2 rounded bg-gray-500 text-white"
        >
          Précédent
        </button>
      )}
      
      {!isLastStep ? (
        <button
          onClick={onNext}
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          Suivant
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 text-white'
          }`}
        >
          {isSubmitting ? 'Soumission en cours...' : 'Soumettre le film'}
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
