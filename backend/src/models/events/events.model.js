import db from '../../config/db_pool.js';

export async function createEvent({
  title,
  cover,
  description,
  start_date,
  end_date,
  location,
  places,
  user_id
}) {
  const [result] = await db.pool.execute(
    `INSERT INTO events
    (title, cover, description, start_date, end_date, location, places, user_id)
    VALUES (?,?,?,?,?,?,?,?)`,
    [title, cover, description, start_date, end_date, location, places, user_id]
  );

  return result.insertId;
}

export const updateEventCover = async (eventId, coverUrl) => {
  await db.pool.execute(
    'UPDATE events SET cover = ? WHERE id = ?',
    [coverUrl, eventId]
  );
};

export const updateEvent = async (
  eventId,
  { title, description, start_date, end_date, location, places }
) => {
  await db.pool.execute(
    `UPDATE events
     SET title = ?,
         description = ?,
         start_date = ?,
         end_date = ?,
         location = ?,
         places = ?
     WHERE id = ?`,
    [title, description, start_date, end_date, location, places, eventId]
  );
};

export const deleteEvent = async (eventId) => {
  await db.pool.execute(
    'DELETE FROM events WHERE id = ?',
    [eventId]
  );
};

export const getEvents = async () => {
  const [rows] = await db.pool.execute(
    'SELECT * FROM events ORDER BY id DESC'
  );
  return rows;
};

export const getEventById = async (eventId) => {
  const [rows] = await db.pool.execute(
    'SELECT * FROM events WHERE id = ?',
    [eventId]
  );
  return rows[0];
};
