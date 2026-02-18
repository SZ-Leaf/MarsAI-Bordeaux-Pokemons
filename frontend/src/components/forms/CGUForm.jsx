import { useEffect } from 'react';
import Checkbox from '../shared/Checkbox';
import Recaptcha from '../Recaptcha/Recaptcha';

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

/**
 * Formulaire CGU - VERSION REFACTORISÉE (avec reCAPTCHA Google)
 */
const CGUForm = ({ formData, errors, updateField }) => {
  // En dev sans clé reCAPTCHA, on met un token factice pour que la validation passe
  useEffect(() => {
    if (!siteKey && !formData.recaptchaToken) {
      updateField('recaptchaToken', 'dev-bypass');
    }
  }, [siteKey, formData.recaptchaToken, updateField]);

  return (
    <div className="space-y-6 pl-4">
      <h2 className="text-2xl font-bold mb-4">Conditions d'utilisation</h2>
      
      <div className="space-y-4">
        <Checkbox
          id="termsAccepted"
          checked={formData.termsAccepted}
          onChange={(e) => updateField('termsAccepted', e.target.checked)}
          label="J'accepte les conditions d'utilisation du festival"
          error={errors.termsAccepted}
        />
        
        <Checkbox
          id="ageConfirmed"
          checked={formData.ageConfirmed}
          onChange={(e) => updateField('ageConfirmed', e.target.checked)}
          label="Je confirme avoir 18 ans ou plus"
          error={errors.ageConfirmed}
        />
      </div>

      <div>
        <p className="text-sm text-gray-300 mb-2">Vérification anti-robot</p>
        <Recaptcha
          siteKey={siteKey}
          onChange={(token) => updateField('recaptchaToken', token || '')}
          onExpire={() => updateField('recaptchaToken', '')}
          error={errors.recaptchaToken}
        />
      </div>
      
      <div className="bg-surface p-4 rounded text-sm text-gray-300">
        <p className="mb-2">
          En soumettant votre film, vous acceptez que celui-ci soit évalué par le jury du festival.
        </p>
        <p>
          Les films sélectionnés pourront être diffusés lors des événements du festival.
        </p>
      </div>
    </div>
  );
};

export default CGUForm;
