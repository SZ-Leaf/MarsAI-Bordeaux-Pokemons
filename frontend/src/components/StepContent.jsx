import CGUForm from './forms/CGUForm.jsx';
import SubmissionForm from './forms/SubmissionForm.jsx';
import FileUploadStep from './FileUploadStep.jsx';
import CreatorStep from './CreatorStep.jsx';

const StepContent = ({ currentStep, formData, errors, updateField }) => {
  // Mapping des étapes vers leurs composants
  const steps = {
    1: <CGUForm formData={formData} errors={errors} updateField={updateField} />,
    2: <SubmissionForm formData={formData} errors={errors} updateField={updateField} />,
    3: <FileUploadStep formData={formData} errors={errors} updateField={updateField} />,
    4: <CreatorStep formData={formData} errors={errors} updateField={updateField} />
  };

  return (
    <div className="bg-white border rounded p-6 pl-8 mb-6">
      {steps[currentStep]}
    </div>
  );
};

export default StepContent;
