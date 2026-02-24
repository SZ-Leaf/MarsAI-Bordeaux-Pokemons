import { submissionSteps } from '../../../../../constants/submissionSteps';

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="submission-steps-wrapper">
      <div className="submission-steps-track">
        {submissionSteps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div key={step.number} className="submission-step">
              <div className="submission-step-inner">
                <div
                  className={`submission-step-circle ${
                    isActive
                      ? 'submission-step-circle--active'
                      : isCompleted
                      ? 'submission-step-circle--completed'
                      : 'submission-step-circle--pending'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <span
                  className={`submission-step-label ${
                    isActive
                      ? 'submission-step-label--active'
                      : 'submission-step-label--inactive'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
