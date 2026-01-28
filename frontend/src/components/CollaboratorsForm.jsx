/**
 * Formulaire collaborateurs (Partie 4)
 * Design épuré et simple
 */
const CollaboratorsForm = ({ formData, errors, updateField }) => {
  const addCollaborator = () => {
    const newCollaborators = [
      ...formData.collaborators,
      {
        firstname: '',
        lastname: '',
        email: '',
        gender: '',
        role: ''
      }
    ];
    updateField('collaborators', newCollaborators);
  };
  
  const removeCollaborator = (index) => {
    const newCollaborators = formData.collaborators.filter((_, i) => i !== index);
    updateField('collaborators', newCollaborators);
  };
  
  const updateCollaborator = (index, field, value) => {
    const newCollaborators = [...formData.collaborators];
    newCollaborators[index] = {
      ...newCollaborators[index],
      [field]: value
    };
    updateField('collaborators', newCollaborators);
  };
  
  return (
    <div className="space-y-6 pl-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contributeurs</h2>
        <button
          type="button"
          onClick={addCollaborator}
          className="bg-blue-500 text-white px-4 py-2 rounded"
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
                  onClick={() => removeCollaborator(index)}
                  className="text-red-500 text-sm"
                >
                  Supprimer
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    type="text"
                    value={collab.firstname}
                    onChange={(e) => updateCollaborator(index, 'firstname', e.target.value)}
                    className={`w-full border rounded p-2 ${errors[`collaborator_${index}_firstname`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`collaborator_${index}_firstname`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`collaborator_${index}_firstname`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={collab.lastname}
                    onChange={(e) => updateCollaborator(index, 'lastname', e.target.value)}
                    className={`w-full border rounded p-2 ${errors[`collaborator_${index}_lastname`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`collaborator_${index}_lastname`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`collaborator_${index}_lastname`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={collab.email}
                    onChange={(e) => updateCollaborator(index, 'email', e.target.value)}
                    className={`w-full border rounded p-2 ${errors[`collaborator_${index}_email`] ? 'border-red-500' : ''}`}
                  />
                  {errors[`collaborator_${index}_email`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`collaborator_${index}_email`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Genre</label>
                  <select
                    value={collab.gender}
                    onChange={(e) => updateCollaborator(index, 'gender', e.target.value)}
                    className={`w-full border rounded p-2 ${errors[`collaborator_${index}_gender`] ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Male">Homme</option>
                    <option value="Female">Femme</option>
                    <option value="Other">Autre</option>
                  </select>
                  {errors[`collaborator_${index}_gender`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`collaborator_${index}_gender`]}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Rôle</label>
                  <textarea
                    value={collab.role}
                    onChange={(e) => updateCollaborator(index, 'role', e.target.value)}
                    className={`w-full border rounded p-2 ${errors[`collaborator_${index}_role`] ? 'border-red-500' : ''}`}
                    rows={2}
                    maxLength={500}
                    placeholder="Rôle dans la production (ex: Director, Producer, Editor)"
                  />
                  {errors[`collaborator_${index}_role`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`collaborator_${index}_role`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaboratorsForm;
