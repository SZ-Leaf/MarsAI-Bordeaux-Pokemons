import db from '../../config/db_pool.js';

/**
 * Crée plusieurs collaborateurs pour une soumission
 * @param {Object} connection - Connexion MySQL (déjà en transaction)
 * @param {number} submissionId - ID de la soumission
 * @param {Array} collaborators - Tableau de collaborateurs
 * @returns {Promise<void>}
 */
const createCollaborators = async (connection, submissionId, collaborators) => {
  if (!collaborators || collaborators.length === 0) {
    return;
  }
  
  // Préparer les valeurs pour INSERT multiple
  const values = collaborators.map(collab => [
    collab.firstname,
    collab.lastname,
    collab.email,
    collab.gender,
    collab.role,
    submissionId
  ]);
  
  // INSERT multiple avec une seule requête
  const placeholders = collaborators.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
  const flatValues = values.flat();
  
  await connection.execute(
    `INSERT INTO collaborators (firstname, lastname, email, gender, role, submission_id) 
     VALUES ${placeholders}`,
    flatValues
  );
};

/**
 * Met à jour un collaborateur
 * @param {number} collaboratorId - ID du collaborateur
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<void>}
 */
const updateCollaborator = async (collaboratorId, data) => {
  const connection = await db.pool.getConnection();
  
  try {
    const fields = [];
    const values = [];
    
    if (data.firstname) {
      fields.push('firstname = ?');
      values.push(data.firstname);
    }
    if (data.lastname) {
      fields.push('lastname = ?');
      values.push(data.lastname);
    }
    if (data.email) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.gender) {
      fields.push('gender = ?');
      values.push(data.gender);
    }
    if (data.role) {
      fields.push('role = ?');
      values.push(data.role);
    }
    
    if (fields.length === 0) {
      return;
    }
    
    values.push(collaboratorId);
    
    await connection.execute(
      `UPDATE collaborators SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Supprime un collaborateur
 * @param {number} collaboratorId - ID du collaborateur
 * @returns {Promise<void>}
 */
const deleteCollaborator = async (collaboratorId) => {
  const connection = await db.pool.getConnection();
  
  try {
    await connection.execute('DELETE FROM collaborators WHERE id = ?', [collaboratorId]);
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

export default {
  createCollaborators,
  updateCollaborator,
  deleteCollaborator
};
