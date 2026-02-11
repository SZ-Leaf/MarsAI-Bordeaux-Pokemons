import useDynamicList from '../../hooks/useDynamicList';
import FormField from '../shared/FormField';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import Select from '../shared/Select';
import { genderOptions } from '../../constants/formOptions';

/**
 * Formulaire collaborateurs (Partie 4) - VERSION REFACTORISÉE
 * Design épuré et simple
 */
const CollaboratorsForm = ({ formData, errors, updateField, updateCollaboratorField }) => {
  const initialCollaborator = {
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    role: ''
  };

  const { add, remove, update } = useDynamicList(
    'collaborators',
    updateField,
    initialCollaborator,
    updateCollaboratorField
  );

  return (
    <div className="space-y-6 pl-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contributeurs</h2>
        <button
          type="button"
          onClick={() => add(formData.collaborators)}
          className="btn btn-primary"
        >
          + Ajouter un contributeur
        </button>
      </div>
      
      <p className="text-sm text-gray-600">
        Ajoutez les membres de votre équipe qui ont contribué à la création de la vidéo (optionnel).
      </p>
      
      {formData.collaborators.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun contributeur ajouté pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {formData.collaborators.map((collab, index) => (
            <div key={index} className="border rounded p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Contributeur {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => remove(formData.collaborators, index)}
                  className="text-red-500 text-sm"
                >
                  Supprimer
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Prénom" 
                  required 
                  error={errors[`collaborators_${index}_firstname`]}
                >
                  <TextInput
                    value={collab.firstname}
                    onChange={(e) => update(formData.collaborators, index, 'firstname', e.target.value)}
                    error={errors[`collaborators_${index}_firstname`]}
                    variant="dark"
                  />
                </FormField>
                
                <FormField 
                  label="Nom" 
                  required 
                  error={errors[`collaborators_${index}_lastname`]}
                >
                  <TextInput
                    value={collab.lastname}
                    onChange={(e) => update(formData.collaborators, index, 'lastname', e.target.value)}
                    error={errors[`collaborators_${index}_lastname`]}
                    variant="dark"
                  />
                </FormField>
                
                <FormField 
                  label="Email" 
                  required 
                  error={errors[`collaborators_${index}_email`]}
                >
                  <TextInput
                    type="email"
                    value={collab.email}
                    onChange={(e) => update(formData.collaborators, index, 'email', e.target.value)}
                    error={errors[`collaborators_${index}_email`]}
                    variant="dark"
                  />
                </FormField>
                
                <FormField 
                  label="Genre" 
                  required 
                  error={errors[`collaborators_${index}_gender`]}
                >
                  <Select
                    value={collab.gender}
                    onChange={(e) => update(formData.collaborators, index, 'gender', e.target.value)}
                    error={errors[`collaborators_${index}_gender`]}
                    options={genderOptions}
                    variant="dark"
                  />
                </FormField>
                
                <FormField 
                  label="Rôle" 
                  required 
                  error={errors[`collaborators_${index}_role`]}
                  className="md:col-span-2"
                >
                  <TextArea
                    value={collab.role}
                    onChange={(e) => update(formData.collaborators, index, 'role', e.target.value)}
                    error={errors[`collaborators_${index}_role`]}
                    rows={2}
                    maxLength={500}
                    placeholder="Rôle dans la production (ex: Director, Producer, Editor)"
                    variant="dark"
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaboratorsForm;
