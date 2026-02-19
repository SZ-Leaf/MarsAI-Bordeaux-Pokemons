import { submissionSteps } from '../../../../../constants/submissionSteps';

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-2" style={{ gap: '1rem' }}>
        {submissionSteps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-gray-200 border-gray-300 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <span className={`text-xs mt-2 text-center whitespace-nowrap ${isActive ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                  {step.title}
                </span>
              </div>
              {index < submissionSteps.length - 1 && (
                <div
                  className={`h-1 w-16 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
