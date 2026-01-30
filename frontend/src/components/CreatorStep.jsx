import CreatorForm from './CreatorForm.jsx';
import SocialLinksList from './SocialLinksList.jsx';
import CollaboratorsList from './CollaboratorsList.jsx';

/**
 * Étape 4 : Informations du réalisateur, liens sociaux et collaborateurs
 */
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
