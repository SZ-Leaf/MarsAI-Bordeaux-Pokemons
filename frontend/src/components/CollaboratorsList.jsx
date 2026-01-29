import { useState } from 'react';
import CollaboratorModal from './CollaboratorModal.jsx';

/**
 * Liste des contributeurs avec modals pour ajout/modification
 */
const CollaboratorsList = ({ formData, errors, updateField }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAdd = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = (collaboratorData, index) => {
    const currentCollaborators = formData.collaborators || [];
    const newCollaborators = [...currentCollaborators];
    if (index !== null) {
      // Modification
      newCollaborators[index] = collaboratorData;
    } else {
      // Ajout
      newCollaborators.push(collaboratorData);
    }
    updateField('collaborators', newCollaborators);
  };

  const handleDelete = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contributeur ?')) {
      const currentCollaborators = formData.collaborators || [];
      const newCollaborators = currentCollaborators.filter((_, i) => i !== index);
      updateField('collaborators', newCollaborators);
    }
  };

  const currentCollaborators = formData.collaborators || [];

  return (
    <div className="space-y-4 pl-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contributeurs</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                    onClick={() => handleDelete(index)}
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
    </div>
  );
};

export default CollaboratorsList;
