import { useState, useEffect } from 'react';
import ModalSubmit from './ModalSubmit.jsx';
import { validateURL } from '../utils/validation.js';

/**
 * Modal pour ajouter/modifier un réseau social
 */
const SocialModal = ({ isOpen, onClose, social, socialIndex, onSave, errors }) => {
  const [formData, setFormData] = useState({
    network_id: '',
    url: ''
  });
  const [localErrors, setLocalErrors] = useState({});

  // Réseaux sociaux disponibles
  const socialNetworks = [
    { id: 1, title: 'fb', label: 'Facebook' },
    { id: 2, title: 'ig', label: 'Instagram' },
    { id: 3, title: 'linkedin', label: 'LinkedIn' },
    { id: 4, title: 'x', label: 'X (Twitter)' },
    { id: 5, title: 'tiktok', label: 'TikTok' },
    { id: 6, title: 'website', label: 'Site web' }
  ];

  useEffect(() => {
    if (social) {
      setFormData({
        network_id: social.network_id || '',
        url: social.url || ''
      });
    } else {
      setFormData({
        network_id: '',
        url: ''
      });
    }
    setLocalErrors({});
  }, [social, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'network_id' ? (value === '' ? '' : parseInt(value)) : value
    }));
    
    // Validation en temps réel
    const newErrors = { ...localErrors };
    if (field === 'network_id') {
      if (!value || value === '') {
        newErrors.network_id = 'Le réseau social est requis';
      } else {
        delete newErrors.network_id;
      }
    } else if (field === 'url') {
      if (!value.trim()) {
        newErrors.url = 'L\'URL est requise';
      } else if (!validateURL(value.trim())) {
        newErrors.url = 'URL invalide. L\'URL doit commencer par https://';
      } else {
        delete newErrors.url;
      }
    }
    setLocalErrors(newErrors);
  };

  const handleSave = () => {
    // Validation finale
    const finalErrors = {};
    if (!formData.network_id || formData.network_id === '') {
      finalErrors.network_id = 'Le réseau social est requis';
    }
    if (!formData.url || !formData.url.trim()) {
      finalErrors.url = 'L\'URL est requise';
    } else if (!validateURL(formData.url.trim())) {
      finalErrors.url = 'URL invalide. L\'URL doit commencer par https://';
    }

    if (Object.keys(finalErrors).length > 0) {
      setLocalErrors(finalErrors);
      return;
    }

    onSave(formData, socialIndex);
    onClose();
  };

  return (
    <ModalSubmit
      isOpen={isOpen}
      onClose={onClose}
      title={socialIndex !== null ? 'Modifier le lien réseau social' : 'Ajouter un lien réseau social'}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Réseau social <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.network_id || ''}
            onChange={(e) => handleChange('network_id', e.target.value)}
            className={`w-full border rounded p-2 ${localErrors.network_id || (errors && errors[`social_${socialIndex}_network_id`]) ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionner un réseau</option>
            {socialNetworks.map(network => (
              <option key={network.id} value={network.id}>
                {network.label}
              </option>
            ))}
          </select>
          {(localErrors.network_id || (errors && errors[`social_${socialIndex}_network_id`])) && (
            <p className="text-red-500 text-sm mt-1">
              {localErrors.network_id || errors[`social_${socialIndex}_network_id`]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className={`w-full border rounded p-2 ${localErrors.url || (errors && errors[`social_${socialIndex}_url`]) ? 'border-red-500' : ''}`}
            placeholder="https://exemple.com"
          />
          {(localErrors.url || (errors && errors[`social_${socialIndex}_url`])) && (
            <p className="text-red-500 text-sm mt-1">
              {localErrors.url || errors[`social_${socialIndex}_url`]}
            </p>
          )}
          {!localErrors.url && !errors?.[`social_${socialIndex}_url`] && formData.url && (
            <p className="text-xs text-gray-500 mt-1">
              L'URL doit commencer par https://
            </p>
          )}
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
            {socialIndex !== null ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </ModalSubmit>
  );
};

export default SocialModal;
