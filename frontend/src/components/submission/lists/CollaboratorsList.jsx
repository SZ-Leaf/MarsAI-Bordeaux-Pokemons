import CollaboratorModal from '../../modals/CollaboratorModal.jsx';
import ActionConfirmationModal from '../../modals/ActionConfirmationModal.jsx';
import { useEditableList } from '../../../hooks/useEditableList.js';

const CollaboratorsList = ({ formData, errors, updateField }) => {
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
    currentItems: currentCollaborators
  } = useEditableList('collaborators', formData, updateField);

  return (
    <div className="space-y-4 pl-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contributeurs</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="btn btn-primary"
        >
          + Ajouter un contributeur
        </button>
      </div>
      
      <p className="text-sm text-gray-600">
        Ajoutez les membres de votre équipe qui ont contribué à la création de la vidéo (optionnel).
      </p>
      
      {currentCollaborators.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun contributeur ajouté pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {currentCollaborators.map((collab, index) => (
            <div key={index} className="border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">
                    {collab.firstname} {collab.lastname}
                  </p>
                  <p className="text-sm text-gray-600">{collab.email}</p>
                  <p className="text-sm text-gray-600">
                    {collab.gender} • {collab.role}
                  </p>
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
            </div>
          ))}
        </div>
      )}

      <CollaboratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collaborator={editingIndex !== null && currentCollaborators[editingIndex] ? currentCollaborators[editingIndex] : null}
        collaboratorIndex={editingIndex}
        onSave={handleSave}
        errors={errors}
      />

      <ActionConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Supprimer le contributeur"
        message="Êtes-vous sûr de vouloir supprimer ce contributeur ? Cette action est irréversible."
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};

export default CollaboratorsList;
