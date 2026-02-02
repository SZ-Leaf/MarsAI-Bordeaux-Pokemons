import SocialModal from '../../modals/SocialModal.jsx';
import ActionConfirmationModal from '../../modals/ActionConfirmationModal.jsx';
import { useEditableList } from '../../../hooks/useEditableList.js';
import { socialNetworks } from '../../../constants/formOptions.js';

const SocialLinksList = ({ formData, errors, updateField }) => {
  const {
    isModalOpen,
    setIsModalOpen,
    editingIndex,
    isDeleteModalOpen,
    handleAdd,
    handleEdit,
    handleSave,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    currentItems: currentSocials
  } = useEditableList('socials', formData, updateField);

  const getNetworkLabel = (networkId) => {
    const network = socialNetworks.find(n => n.id === networkId);
    return network ? network.label : 'Inconnu';
  };

  return (
    <div className="space-y-4 pl-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Liens réseaux sociaux</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="btn btn-primary"
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
                  onClick={() => handleDeleteClick(index)}
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

      <ActionConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Supprimer le lien réseau social"
        message="Êtes-vous sûr de vouloir supprimer ce lien réseau social ? Cette action est irréversible."
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};

export default SocialLinksList;
