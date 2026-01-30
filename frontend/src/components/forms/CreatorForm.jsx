import { validateEmail } from '../../utils/validation';
import { filterNameCharacters } from '../../utils/validation';
import FormField from '../shared/FormField';
import TextInput from '../shared/TextInput';
import Select from '../shared/Select';
import CountrySelect from '../shared/CountrySelect';
import PhoneInput from '../shared/PhoneInput';
import { genderOptions, referralSourceOptions } from '../../constants/formOptions';

/**
 * Formulaire infos réalisateur (Partie 3)
 * Design épuré et simple - VERSION REFACTORISÉE
 */
const CreatorForm = ({ formData, errors, updateField }) => {
  const handleEmailBlur = (e) => {
    const email = e.target.value.trim();
    if (email && !validateEmail(email)) {
      // L'erreur sera gérée par la validation globale
    }
  };

  const handleNameChange = (field, value) => {
    const filteredValue = filterNameCharacters(value);
    updateField(field, filteredValue);
  };

  return (
    <div className="space-y-6 pl-4">
      <h2 className="text-2xl font-bold mb-4">Informations du réalisateur</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Prénom" required error={errors.creator_firstname}>
          <TextInput
            value={formData.creator_firstname}
            onChange={(e) => handleNameChange('creator_firstname', e.target.value)}
            error={errors.creator_firstname}
          />
        </FormField>
        
        <FormField label="Nom" required error={errors.creator_lastname}>
          <TextInput
            value={formData.creator_lastname}
            onChange={(e) => handleNameChange('creator_lastname', e.target.value)}
            error={errors.creator_lastname}
          />
        </FormField>
        
        <FormField label="Email" required error={errors.creator_email}>
          <TextInput
            type="email"
            value={formData.creator_email}
            onChange={(e) => {
              const value = e.target.value;
              updateField('creator_email', value);
              if (value.trim() && !validateEmail(value.trim())) {
                // L'erreur sera affichée via la validation globale
              }
            }}
            onBlur={handleEmailBlur}
            error={errors.creator_email}
          />
        </FormField>
        
        <FormField label="Téléphone" error={errors.creator_phone}>
          <PhoneInput
            value={formData.creator_phone || ''}
            onChange={(value) => updateField('creator_phone', value)}
            error={errors.creator_phone}
            placeholder="Numéro de téléphone"
          />
        </FormField>
        
        <FormField label="Mobile" required error={errors.creator_mobile}>
          <PhoneInput
            value={formData.creator_mobile || ''}
            onChange={(value) => updateField('creator_mobile', value)}
            error={errors.creator_mobile}
            placeholder="Numéro de mobile"
          />
        </FormField>
        
        <FormField label="Genre" required error={errors.creator_gender}>
          <Select
            value={formData.creator_gender}
            onChange={(e) => updateField('creator_gender', e.target.value)}
            error={errors.creator_gender}
            options={genderOptions}
          />
        </FormField>
        
        <FormField label="Pays" required error={errors.creator_country}>
          <CountrySelect
            value={formData.creator_country}
            onChange={(value) => updateField('creator_country', value)}
            error={errors.creator_country}
          />
        </FormField>
        
        <FormField label="Source de référence" required error={errors.referral_source}>
          <Select
            value={formData.referral_source}
            onChange={(e) => updateField('referral_source', e.target.value)}
            error={errors.referral_source}
            options={referralSourceOptions}
          />
        </FormField>
      </div>
      
      <FormField label="Adresse" required error={errors.creator_address}>
        <TextInput
          value={formData.creator_address}
          onChange={(e) => updateField('creator_address', e.target.value)}
          error={errors.creator_address}
        />
      </FormField>
    </div>
  );
};

export default CreatorForm;
