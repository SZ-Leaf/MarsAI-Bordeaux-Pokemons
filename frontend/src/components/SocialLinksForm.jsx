/**
 * Formulaire liens sociaux (Partie 4)
 * Design épuré et simple
 */
const SocialLinksForm = ({ formData, errors, updateField }) => {
  // Réseaux sociaux disponibles (devrait venir de l'API mais hardcodé pour l'instant)
  const socialNetworks = [
    { id: 1, title: 'fb', label: 'Facebook' },
    { id: 2, title: 'ig', label: 'Instagram' },
    { id: 3, title: 'linkedin', label: 'LinkedIn' },
    { id: 4, title: 'x', label: 'X (Twitter)' },
    { id: 5, title: 'tiktok', label: 'TikTok' },
    { id: 6, title: 'website', label: 'Site web' }
  ];
  
  const addSocial = () => {
    const newSocials = [
      ...formData.socials,
      {
        network_id: '',
        url: ''
      }
    ];
    updateField('socials', newSocials);
  };
  
  const removeSocial = (index) => {
    const newSocials = formData.socials.filter((_, i) => i !== index);
    updateField('socials', newSocials);
  };
  
  const updateSocial = (index, field, value) => {
    const newSocials = [...formData.socials];
    newSocials[index] = {
      ...newSocials[index],
      [field]: value
    };
    updateField('socials', newSocials);
  };
  
  return (
    <div className="space-y-6 pl-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Liens réseaux sociaux</h3>
        <button
          type="button"
          onClick={addSocial}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Ajouter un lien
        </button>
      </div>
      
      <p className="text-sm text-gray-600">
        Ajoutez les liens vers vos réseaux sociaux ou votre site web (optionnel).
      </p>
      
      {formData.socials.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun lien ajouté pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {formData.socials.map((social, index) => (
            <div key={index} className="border rounded p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Lien {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSocial(index)}
                  className="text-red-500 text-sm"
                >
                  Supprimer
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Réseau social</label>
                  <select
                    value={social.network_id}
                    onChange={(e) => updateSocial(index, 'network_id', parseInt(e.target.value))}
                    className={`w-full border rounded p-2 ${errors[`social_${index}_network_id`] ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionner</option>
                    {socialNetworks.map(network => (
                      <option key={network.id} value={network.id}>
                        {network.label}
                      </option>
                    ))}
                  </select>
                  {errors[`social_${index}_network_id`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`social_${index}_network_id`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => updateSocial(index, 'url', e.target.value)}
                    className={`w-full border rounded p-2 ${errors[`social_${index}_url`] ? 'border-red-500' : ''}`}
                    placeholder="https://..."
                  />
                  {errors[`social_${index}_url`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`social_${index}_url`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialLinksForm;
