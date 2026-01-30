import Checkbox from '../shared/Checkbox';

/**
 * Formulaire CGU - VERSION REFACTORISÉE
 */
const CGUForm = ({ formData, errors, updateField }) => {
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
      
      <div className="bg-gray-100 p-4 rounded text-sm">
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
