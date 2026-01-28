// src/models/submissions/submissions_model.js
import db from '../../config/db_pool.js';

const pool = db.pool;

export const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM submissions WHERE id = ?',
    [id]
  );
  return rows[0];
};
