import db from '../../config/db_pool.js';

export const findById = async (id) => {
  try {
    const [rows] = await db.pool.execute('SELECT * FROM submissions WHERE id = ?', [id]);
    return rows[0];
  } catch (err) {
    console.error('Erreur findById:', err);
  }
};
