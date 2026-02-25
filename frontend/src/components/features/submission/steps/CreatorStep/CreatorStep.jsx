import { CreatorForm } from '../../forms';
import SocialLinksList from '../../lists/SocialLinksList';
import CollaboratorsList from '../../lists/CollaboratorsList';
import { Recaptcha } from '../../../../shared/ui';

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

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

      <div className="border-t pt-6 flex flex-col items-center gap-3">
        <p className="text-sm text-gray-300 mb-1 text-center">
          Vérification anti-robot
        </p>
        <div className="flex justify-center">
          <Recaptcha
            siteKey={siteKey}
            onChange={(token) => updateField('recaptchaToken', token || '')}
            onExpire={() => updateField('recaptchaToken', '')}
            error={errors.recaptchaToken}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatorStep;
