import { useState, useEffect } from 'react';
import ModalSubmit from './ModalSubmit.jsx';
import { validateEmail, validateName } from '../utils/validation.js';

/**
 * Modal pour ajouter/modifier un contributeur
 */
const CollaboratorModal = ({ isOpen, onClose, collaborator, collaboratorIndex, onSave, errors }) => {
  // Calculer les données initiales basées sur le collaborator
  const initialFormData = collaborator ? {
    firstname: collaborator.firstname || '',
    lastname: collaborator.lastname || '',
    email: collaborator.email || '',
    gender: collaborator.gender || '',
    role: collaborator.role || ''
  } : {
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    role: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [localErrors, setLocalErrors] = useState({});

  // Réinitialiser le formulaire quand le collaborator change (seulement quand le modal s'ouvre)
  useEffect(() => {
    if (isOpen) {
      const newFormData = collaborator ? {
        firstname: collaborator.firstname || '',
        lastname: collaborator.lastname || '',
        email: collaborator.email || '',
        gender: collaborator.gender || '',
        role: collaborator.role || ''
      } : {
        firstname: '',
        lastname: '',
        email: '',
        gender: '',
        role: ''
      };
      // Utiliser setTimeout pour éviter l'appel synchrone
      setTimeout(() => {
        setFormData(newFormData);
        setLocalErrors({});
      }, 0);
    }
  }, [collaborator, isOpen]);

  const handleChange = (field, value) => {
    // Filtrer les caractères non autorisés pour les champs nom/prénom
    let filteredValue = value;
    if (field === 'firstname' || field === 'lastname') {
      // Uniquement lettres (avec accents), espaces, tirets et apostrophes
      filteredValue = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: filteredValue
    }));
    
    // Validation en temps réel
    const newErrors = { ...localErrors };
    if (field === 'email') {
      if (!filteredValue.trim()) {
        newErrors.email = 'L\'email est requis';
      } else if (!validateEmail(filteredValue.trim())) {
        newErrors.email = 'Email invalide';
      } else {
        delete newErrors.email;
      }
    } else if (field === 'firstname' || field === 'lastname') {
      if (!filteredValue.trim()) {
        newErrors[field] = 'Ce champ est requis';
      } else if (!validateName(filteredValue.trim())) {
        newErrors[field] = 'Ce champ ne doit contenir que des lettres';
      } else {
        delete newErrors[field];
      }
    } else {
      if (!filteredValue.trim()) {
        newErrors[field] = 'Ce champ est requis';
      } else {
        delete newErrors[field];
      }
      if (field === 'role' && filteredValue.trim().length > 500) {
        newErrors.role = 'Le rôle ne peut pas dépasser 500 caractères';
      } else if (field === 'role') {
        delete newErrors.role;
      }
    }
    setLocalErrors(newErrors);
  };

  const handleSave = () => {
    // Validation finale
    const finalErrors = {};
    if (!formData.firstname.trim()) {
      finalErrors.firstname = 'Le prénom est requis';
    } else if (!validateName(formData.firstname.trim())) {
      finalErrors.firstname = 'Le prénom ne doit contenir que des lettres';
    }
    if (!formData.lastname.trim()) {
      finalErrors.lastname = 'Le nom est requis';
    } else if (!validateName(formData.lastname.trim())) {
      finalErrors.lastname = 'Le nom ne doit contenir que des lettres';
    }
    if (!formData.email.trim()) {
      finalErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email.trim())) {
      finalErrors.email = 'Email invalide';
    }
    if (!formData.gender.trim()) {
      finalErrors.gender = 'Le genre est requis';
    }
    if (!formData.role.trim()) {
      finalErrors.role = 'Le rôle est requis';
    } else if (formData.role.trim().length > 500) {
      finalErrors.role = 'Le rôle ne peut pas dépasser 500 caractères';
    }

    if (Object.keys(finalErrors).length > 0) {
      setLocalErrors(finalErrors);
      return;
    }

    onSave(formData, collaboratorIndex);
    onClose();
  };

  return (
    <ModalSubmit
      isOpen={isOpen}
      onClose={onClose}
      title={collaboratorIndex !== null ? 'Modifier le contributeur' : 'Ajouter un contributeur'}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstname}
              onChange={(e) => handleChange('firstname', e.target.value)}
              className={`w-full border rounded p-2 ${localErrors.firstname || (errors && errors[`collaborator_${collaboratorIndex}_firstname`]) ? 'border-red-500' : ''}`}
            />
            {(localErrors.firstname || (errors && errors[`collaborator_${collaboratorIndex}_firstname`])) && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.firstname || errors[`collaborator_${collaboratorIndex}_firstname`]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastname}
              onChange={(e) => handleChange('lastname', e.target.value)}
              className={`w-full border rounded p-2 ${localErrors.lastname || (errors && errors[`collaborator_${collaboratorIndex}_lastname`]) ? 'border-red-500' : ''}`}
            />
            {(localErrors.lastname || (errors && errors[`collaborator_${collaboratorIndex}_lastname`])) && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.lastname || errors[`collaborator_${collaboratorIndex}_lastname`]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full border rounded p-2 ${localErrors.email || (errors && errors[`collaborator_${collaboratorIndex}_email`]) ? 'border-red-500' : ''}`}
            />
            {(localErrors.email || (errors && errors[`collaborator_${collaboratorIndex}_email`])) && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.email || errors[`collaborator_${collaboratorIndex}_email`]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Genre <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={`w-full border rounded p-2 ${localErrors.gender || (errors && errors[`collaborator_${collaboratorIndex}_gender`]) ? 'border-red-500' : ''}`}
            >
              <option value="">Sélectionner</option>
              <option value="Male">Homme</option>
              <option value="Female">Femme</option>
              <option value="Other">Autre</option>
            </select>
            {(localErrors.gender || (errors && errors[`collaborator_${collaboratorIndex}_gender`])) && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.gender || errors[`collaborator_${collaboratorIndex}_gender`]}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Rôle <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className={`w-full border rounded p-2 ${localErrors.role || (errors && errors[`collaborator_${collaboratorIndex}_role`]) ? 'border-red-500' : ''}`}
              rows={2}
              maxLength={500}
              placeholder="Rôle dans la production (ex: Director, Producer, Editor)"
            />
            {(localErrors.role || (errors && errors[`collaborator_${collaboratorIndex}_role`])) && (
              <p className="text-red-500 text-sm mt-1">
                {localErrors.role || errors[`collaborator_${collaboratorIndex}_role`]}
              </p>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {formData.role.length}/500 caractères
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {collaboratorIndex !== null ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </ModalSubmit>
  );
};

export default CollaboratorModal;
