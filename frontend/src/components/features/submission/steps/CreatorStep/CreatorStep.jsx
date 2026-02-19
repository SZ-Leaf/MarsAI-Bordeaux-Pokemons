import { CreatorForm } from '../../forms';
import SocialLinksList from '../../lists/SocialLinksList';
import CollaboratorsList from '../../lists/CollaboratorsList';

const CreatorStep = ({ formData, errors, updateField }) => {
  return (
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
  );
};

export default CreatorStep;
