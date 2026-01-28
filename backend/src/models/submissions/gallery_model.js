import db from '../../config/db_pool.js';

/**
 * Crée plusieurs images de galerie pour une soumission
 * @param {number} submissionId - ID de la soumission
 * @param {Array<string>} filenames - Tableau des chemins des fichiers
 * @returns {Promise<void>}
 */
const createGalleryImages = async (submissionId, filenames) => {
  if (!filenames || filenames.length === 0) {
    return;
  }
  
  const connection = await db.pool.getConnection();
  
  try {
    // Préparer les valeurs pour INSERT multiple
    const values = filenames.map(filename => [filename, submissionId]);
    
    // INSERT multiple avec une seule requête
    const placeholders = filenames.map(() => '(?, ?)').join(', ');
    const flatValues = values.flat();
    
    await connection.execute(
      `INSERT INTO gallery (filename, submission_id) VALUES ${placeholders}`,
      flatValues
    );
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Supprime une image de galerie
 * @param {number} galleryId - ID de l'image
 * @returns {Promise<void>}
 */
const deleteGalleryImage = async (galleryId) => {
  const connection = await db.pool.getConnection();
  
  try {
    await connection.execute('DELETE FROM gallery WHERE id = ?', [galleryId]);
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Récupère toutes les images d'une soumission
 * @param {number} submissionId - ID de la soumission
 * @returns {Promise<Array>} - Liste des images
 */
const getGalleryBySubmissionId = async (submissionId) => {
  const connection = await db.pool.getConnection();
  
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM gallery WHERE submission_id = ? ORDER BY created_at ASC',
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
  createGalleryImages,
  deleteGalleryImage,
  getGalleryBySubmissionId
};
