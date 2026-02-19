import { submissionSteps } from '../../../../../constants/submissionSteps';

const StepContent = ({ currentStep, formData, errors, updateField }) => {
  const stepConfig = submissionSteps.find(step => step.number === currentStep);
  
  if (!stepConfig) return null;
  
  const StepComponent = stepConfig.component;
  
  return (
    <div className="p-2 mb-6">
      <StepComponent 
        formData={formData} 
        errors={errors} 
        updateField={updateField} 
      />
    </div>
  );
};

export default StepContent;
