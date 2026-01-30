import useDynamicList from '../../hooks/useDynamicList';
import FormField from '../shared/FormField';
import TextInput from '../shared/TextInput';
import Select from '../shared/Select';
import { socialNetworks } from '../../constants/formOptions';

/**
 * Formulaire liens sociaux (Partie 4) - VERSION REFACTORISÉE
 * Design épuré et simple
 */
const SocialLinksForm = ({ formData, errors, updateField, updateSocialField }) => {
  const initialSocial = {
    network_id: '',
    url: ''
  };

  const { add, remove, update } = useDynamicList(
    'socials',
    updateField,
    initialSocial,
    updateSocialField
  );

  // Convertir socialNetworks en format compatible avec Select
  const socialNetworkOptions = [
    { value: '', label: 'Sélectionner un réseau' },
    ...socialNetworks.map(network => ({
      value: network.id,
      label: network.label
    }))
  ];

  const handleNetworkChange = (index, value) => {
    // Convertir la valeur en nombre si ce n'est pas vide
    const networkId = value === '' ? '' : parseInt(value);
    update(formData.socials, index, 'network_id', networkId);
  };

  return (
    <div className="space-y-6 pl-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Liens réseaux sociaux</h3>
        <button
          type="button"
          onClick={() => add(formData.socials)}
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
                  onClick={() => remove(formData.socials, index)}
                  className="text-red-500 text-sm"
                >
                  Supprimer
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Réseau social" 
                  required 
                  error={errors[`social_${index}_network_id`]}
                >
                  <Select
                    value={social.network_id || ''}
                    onChange={(e) => handleNetworkChange(index, e.target.value)}
                    error={errors[`social_${index}_network_id`]}
                    options={socialNetworkOptions}
                    placeholder=""
                  />
                </FormField>
                
                <FormField 
                  label="URL" 
                  required 
                  error={errors[`social_${index}_url`]}
                >
                  <TextInput
                    type="url"
                    value={social.url}
                    onChange={(e) => update(formData.socials, index, 'url', e.target.value)}
                    error={errors[`social_${index}_url`]}
                    placeholder="https://exemple.com"
                  />
                  {!errors[`social_${index}_url`] && social.url && (
                    <p className="text-xs text-gray-500 mt-1">
                      L'URL doit commencer par https://
                    </p>
                  )}
                </FormField>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialLinksForm;
