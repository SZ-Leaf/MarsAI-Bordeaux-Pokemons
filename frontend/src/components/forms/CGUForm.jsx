const CGUForm = ({ formData, errors, updateField }) => {
  return (
    <div className="space-y-6 pl-4">
      <h2 className="text-2xl font-bold mb-4">Conditions d'utilisation</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={formData.termsAccepted}
            onChange={(e) => updateField('termsAccepted', e.target.checked)}
            className="mt-1 mr-3"
          />
          <label htmlFor="termsAccepted" className="flex-1">
            J'accepte les conditions d'utilisation du festival
            {errors.termsAccepted && (
              <span className="block text-red-500 text-sm mt-1">
                {errors.termsAccepted}
              </span>
            )}
          </label>
        </div>
        
        <div className="flex items-start">
          <input
            type="checkbox"
            id="ageConfirmed"
            checked={formData.ageConfirmed}
            onChange={(e) => updateField('ageConfirmed', e.target.checked)}
            className="mt-1 mr-3"
          />
          <label htmlFor="ageConfirmed" className="flex-1">
            Je confirme avoir 18 ans ou plus
            {errors.ageConfirmed && (
              <span className="block text-red-500 text-sm mt-1">
                {errors.ageConfirmed}
              </span>
            )}
          </label>
        </div>
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
