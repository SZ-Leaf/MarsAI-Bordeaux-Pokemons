import db from '../../config/db_pool.js';

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
