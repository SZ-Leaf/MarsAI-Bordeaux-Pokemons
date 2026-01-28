import db from '../../config/db_pool.js';

const pool = db.pool;

export const findById = async (id) => {
  try {
    const sql = 'SELECT * FROM submissions WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  } catch (err) {
    console.error('Erreur DB findById:', err);
  }
};
