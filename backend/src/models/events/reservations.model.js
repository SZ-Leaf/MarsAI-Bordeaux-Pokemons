import db from '../../config/db_pool.js';

export const createReservation = async ({first_name, last_name, email, event_id}) => {
  const [result] = await db.pool.execute(
    `INSERT INTO reservations(first_name, last_name, email, event_id) VALUES (?, ?, ?, ?)`,
    [first_name, last_name, email, event_id]
  );
  return result.insertId;
}
