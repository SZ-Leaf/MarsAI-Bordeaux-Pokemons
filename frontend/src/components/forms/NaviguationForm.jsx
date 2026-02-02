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
          className="btn btn-secondary"
        >
          Précédent
        </button>
      )}
      
      {!isLastStep ? (
        <button
          onClick={onNext}
          className="btn btn-primary"
        >
          Suivant
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`btn ${isSubmitting ? 'btn-secondary' : 'btn-modern'}`}
        >
          {isSubmitting ? 'Soumission en cours...' : 'Soumettre le film'}
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
