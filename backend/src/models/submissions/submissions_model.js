import db from '../../config/db_pool.js';

/**
 * Crée une nouvelle soumission dans la base de données
 * @param {Object} connection - Connexion MySQL (déjà en transaction)
 * @param {Object} data - Données de la soumission validées
 * @param {string} videoPath - Chemin du fichier vidéo
 * @param {string} coverPath - Chemin du fichier cover
 * @param {number|null} durationSeconds - Durée de la vidéo en secondes (calculée avec get-video-duration)
 * @returns {Promise<number>} - ID de la soumission créée
 */
const createSubmission = async (connection, data, videoPath, coverPath, durationSeconds = null) => {
  const [result] = await connection.execute(
    `INSERT INTO submissions (
      cover, video_url, english_title, original_title, language,
      english_synopsis, original_synopsis, classification,
      tech_stack, creative_method, subtitles,
      duration_seconds, youtube_URL,
      creator_gender, creator_email, creator_phone, creator_mobile,
      creator_firstname, creator_lastname, creator_country,
      creator_address, referral_source, terms_of_use
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      coverPath,                      // Chemin cover
      videoPath,                     // Chemin vidéo (sera mis à jour après déplacement)
      data.english_title,
      data.original_title || null,
      data.language,
      data.english_synopsis,
      data.original_synopsis || null,
      data.classification,
      data.tech_stack,
      data.creative_method,
      data.subtitles || null,        // Optionnel
      durationSeconds,               // Durée calculée (peut être null)
      null,                          // youtube_URL NULL (ajouté par admin)
      data.creator_gender,
      data.creator_email,
      data.creator_phone || null,
      data.creator_mobile,
      data.creator_firstname,
      data.creator_lastname,
      data.creator_country,
      data.creator_address,
      data.referral_source,  // Requis
      data.terms_of_use
    ]
  );
  
  return result.insertId;
};

/**
 * Met à jour les chemins des fichiers dans la soumission
 * @param {Object} connection - Connexion MySQL (déjà en transaction)
 * @param {number} submissionId - ID de la soumission
 * @param {string} videoUrl - Chemin final de la vidéo
 * @param {string} cover - Chemin final du cover
 * @param {string|null} subtitles - Chemin final des subtitles (optionnel)
 * @returns {Promise<void>}
 */
const updateFilePaths = async (connection, submissionId, videoUrl, cover, subtitles = null) => {
  await connection.execute(
    'UPDATE submissions SET video_url = ?, cover = ?, subtitles = ? WHERE id = ?',
    [videoUrl, cover, subtitles, submissionId]
  );
};

/**
 * Récupère toutes les soumissions (pour admin)
 * @param {Object} filters - Filtres optionnels (status, limit, offset)
 * @returns {Promise<Array>} - Liste des soumissions
 */
const getSubmissions = async (filters = {}) => {
  const connection = await db.pool.getConnection();
  
  try {
    let query = 'SELECT * FROM submissions';
    const params = [];
    
    if (filters.status) {
      query += ' WHERE moderation_id IN (SELECT id FROM submission_moderation WHERE status = ?)';
      params.push(filters.status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }
    
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Récupère une soumission par son ID avec toutes ses relations
 * @param {number} submissionId - ID de la soumission
 * @returns {Promise<Object|null>} - Soumission complète ou null si non trouvée
 */
const getSubmissionById = async (submissionId) => {
  const connection = await db.pool.getConnection();
  
  try {
    // Récupérer la soumission de base
    const [submissions] = await connection.execute(
      `SELECT s.*, 
              sm.status as moderation_status,
              sm.details as moderation_details,
              sm.created_at as moderation_created_at,
              sm.updated_at as moderation_updated_at
       FROM submissions s
       LEFT JOIN submission_moderation sm ON s.moderation_id = sm.id
       WHERE s.id = ?`,
      [submissionId]
    );
    
    if (submissions.length === 0) {
      return null;
    }
    
    const submission = submissions[0];
    
    // Récupérer les collaborateurs
    const [collaborators] = await connection.execute(
      'SELECT * FROM collaborators WHERE submission_id = ? ORDER BY created_at ASC',
      [submissionId]
    );
    submission.collaborators = collaborators;
    
    // Récupérer les images de galerie
    const [gallery] = await connection.execute(
      'SELECT * FROM gallery WHERE submission_id = ? ORDER BY created_at ASC',
      [submissionId]
    );
    submission.gallery = gallery;
    
    // Récupérer les liens sociaux avec infos réseau
    const [socials] = await connection.execute(
      `SELECT s.*, sn.title as network_title, sn.logo as network_logo
       FROM socials s
       JOIN social_networks sn ON s.network_id = sn.id
       WHERE s.submission_id = ?`,
      [submissionId]
    );
    submission.socials = socials;
    
    // Récupérer les tags
    const [tags] = await connection.execute(
      `SELECT t.* FROM tags t
       JOIN submissions_tags st ON t.id = st.tag_id
       WHERE st.submission_id = ?`,
      [submissionId]
    );
    submission.tags = tags;
    
    // Récupérer les awards (désactivé pour le moment)
    // const [awards] = await connection.execute(
    //   `SELECT a.* FROM awards a
    //    JOIN submissions_awards sa ON a.id = sa.award_id
    //    WHERE sa.submission_id = ?
    //    ORDER BY a.rank ASC`,
    //   [submissionId]
    // );
    // submission.awards = awards;
    
    return submission;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

export default {
  createSubmission,
  updateFilePaths,
  getSubmissions,
  getSubmissionById
};
export const findById = async (id) => {
  try {
    const [rows] = await db.pool.execute('SELECT * FROM submissions WHERE id = ?', [id]);
    return rows[0];
  } catch (err) {
    console.error('Erreur findById:', err);
    throw err;
  }
};

export const updateYoutubeLink = async (youtubeUrl, id) => {
  try {
    const [result] = await db.pool.execute('UPDATE submissions SET youtube_url = ? WHERE id = ?', [youtubeUrl, id]);
    return result.affectedRows;
  } catch (err) {
    console.error('Erreur updateYoutubeLink:', err);
    throw err;
  }
};
