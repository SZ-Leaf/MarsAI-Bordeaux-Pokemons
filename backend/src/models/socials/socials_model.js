import db from '../../config/db_pool.js';

/**
 * Crée plusieurs liens sociaux pour une soumission
 * @param {number} submissionId - ID de la soumission
 * @param {Array} socials - Tableau de liens sociaux { network_id, url }
 * @returns {Promise<void>}
 */
const createSocials = async (submissionId, socials) => {
  if (!socials || socials.length === 0) {
    return;
  }
  
  const connection = await db.pool.getConnection();
  
  try {
    // Préparer les valeurs pour INSERT multiple
    const values = socials.map(social => [
      social.url,
      submissionId,
      social.network_id
    ]);
    
    // INSERT multiple avec une seule requête
    const placeholders = socials.map(() => '(?, ?, ?)').join(', ');
    const flatValues = values.flat();
    
    await connection.query(
      `INSERT INTO socials (url, submission_id, network_id) VALUES ${placeholders}`,
      flatValues
    );
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Récupère tous les liens sociaux d'une soumission
 * @param {number} submissionId - ID de la soumission
 * @returns {Promise<Array>} - Liste des liens sociaux avec infos réseau
 */
const getSocialsBySubmissionId = async (submissionId) => {
  const connection = await db.pool.getConnection();
  
  try {
    const [rows] = await connection.query(
      `SELECT s.*, sn.title as network_title, sn.logo as network_logo 
       FROM socials s 
       JOIN social_networks sn ON s.network_id = sn.id 
       WHERE s.submission_id = ?`,
      [submissionId]
    );
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

export default {
  createSocials,
  getSocialsBySubmissionId
};
