import FormField from '../shared/FormField';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import Select from '../shared/Select';
import Tag from '../tags/Tags';
import { classificationOptions } from '../../constants/formOptions';

/**
 * Formulaire principal (Partie 2) - Métadonnées vidéo + upload
 * Design épuré et simple - VERSION REFACTORISÉE
 */
const SubmissionForm = ({ formData, errors, updateField }) => {
  return (
    <div className="space-y-6 pl-4">
      <h2 className="text-2xl font-bold mb-4">Informations sur la vidéo</h2>
      
      {/* Métadonnées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Titre anglais" required error={errors.english_title}>
          <TextInput
            value={formData.english_title}
            onChange={(e) => updateField('english_title', e.target.value)}
            error={errors.english_title}
            maxLength={255}
            variant="dark"
          />
        </FormField>
        
        <FormField label="Titre original" error={errors.original_title}>
          <TextInput
            value={formData.original_title}
            onChange={(e) => updateField('original_title', e.target.value)}
            error={errors.original_title}
            maxLength={255}
            variant="dark"
          />
        </FormField>
        
        <FormField label="Langue" required error={errors.language}>
          <TextInput
            value={formData.language}
            onChange={(e) => updateField('language', e.target.value)}
            error={errors.language}
            placeholder="ex: French, English"
            variant="dark"
          />
        </FormField>
        
        <FormField label="Classification" required error={errors.classification}>
          <Select
            value={formData.classification}
            onChange={(e) => updateField('classification', e.target.value)}
            error={errors.classification}
            options={classificationOptions}
          />
        </FormField>
      </div>
      
      <FormField label="Synopsis anglais" required error={errors.english_synopsis}>
        <TextArea
          value={formData.english_synopsis}
          onChange={(e) => updateField('english_synopsis', e.target.value)}
          error={errors.english_synopsis}
          rows={4}
          maxLength={300}
          showCounter={true}
          placeholder="Résumé de votre vidéo (max 300 caractères)"
          variant="dark"
        />
      </FormField>
      
      <FormField label="Synopsis original" error={errors.original_synopsis}>
        <TextArea
          value={formData.original_synopsis}
          onChange={(e) => updateField('original_synopsis', e.target.value)}
          error={errors.original_synopsis}
          rows={4}
          maxLength={300}
          showCounter={true}
          placeholder="Résumé dans la langue originale (max 300 caractères)"
          variant="dark"
        />
      </FormField>
      
      <FormField label="Stack technique" required error={errors.tech_stack}>
        <TextArea
          value={formData.tech_stack}
          onChange={(e) => updateField('tech_stack', e.target.value)}
          error={errors.tech_stack}
          rows={3}
          maxLength={500}
          showCounter={true}
          placeholder="Technologies utilisées (max 500 caractères)"
          variant="dark"
        />
      </FormField>
      
      <FormField label="Méthode créative" required error={errors.creative_method}>
        <TextArea
          value={formData.creative_method}
          onChange={(e) => updateField('creative_method', e.target.value)}
          error={errors.creative_method}
          rows={3}
          maxLength={500}
          showCounter={true}
          placeholder="Décrivez votre méthode créative (max 500 caractères)"
          variant="dark"
        />
      </FormField>

      <FormField>
        <Tag
          value={formData.tags}
          onChange={(tags) => updateField("tags", tags)}
          />
      </FormField>

      
    </div>
  );
};

export default SubmissionForm;
