import { useState } from 'react';
import SocialModal from './SocialModal.jsx';

/**
 * Liste des réseaux sociaux avec modals pour ajout/modification
 */
const SocialLinksList = ({ formData, errors, updateField }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const socialNetworks = [
    { id: 1, title: 'fb', label: 'Facebook' },
    { id: 2, title: 'ig', label: 'Instagram' },
    { id: 3, title: 'linkedin', label: 'LinkedIn' },
    { id: 4, title: 'x', label: 'X (Twitter)' },
    { id: 5, title: 'tiktok', label: 'TikTok' },
    { id: 6, title: 'website', label: 'Site web' }
  ];

  const getNetworkLabel = (networkId) => {
    const network = socialNetworks.find(n => n.id === networkId);
    return network ? network.label : 'Inconnu';
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = (socialData, index) => {
    const currentSocials = formData.socials || [];
    const newSocials = [...currentSocials];
    if (index !== null) {
      // Modification
      newSocials[index] = socialData;
    } else {
      // Ajout
      newSocials.push(socialData);
    }
    updateField('socials', newSocials);
  };

  const handleDelete = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce lien réseau social ?')) {
      const currentSocials = formData.socials || [];
      const newSocials = currentSocials.filter((_, i) => i !== index);
      updateField('socials', newSocials);
    }
  };

  const currentSocials = formData.socials || [];

  return (
    <div className="space-y-4 pl-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Liens réseaux sociaux</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Ajouter un lien
        </button>
      </div>
      
      <p className="text-sm text-gray-600">
        Ajoutez les liens vers vos réseaux sociaux ou votre site web (optionnel).
      </p>
      
      {currentSocials.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun lien ajouté pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {currentSocials.map((social, index) => (
            <div key={index} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{getNetworkLabel(social.network_id)}</p>
                <p className="text-sm text-gray-600 break-all">{social.url}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SocialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        social={editingIndex !== null && currentSocials[editingIndex] ? currentSocials[editingIndex] : null}
        socialIndex={editingIndex}
        onSave={handleSave}
        errors={errors}
      />
    </div>
  );
};

export default SocialLinksList;
