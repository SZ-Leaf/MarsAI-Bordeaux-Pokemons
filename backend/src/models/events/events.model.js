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

export const getEvents = async (filters = {}) => {
  const { title, start_date, end_date, timeframe } = filters;

  let query = `
    SELECT e.*, COUNT(r.id) AS reservations
    FROM events e
    LEFT JOIN reservations r ON r.event_id = e.id
  `;

  const params = [];

  if (title) {
    query += ' AND e.title LIKE ?';
    params.push(`%${title}%`);
  }

  if (timeframe === 'upcoming') {
    query += ' AND e.end_date >= NOW()';
  } else if (timeframe === 'past') {
    query += ' AND e.end_date < NOW()';
  }

  if (start_date) {
    query += ' AND e.start_date >= ?';
    params.push(start_date);
  }

  if (end_date) {
    query += ' AND e.end_date <= ?';
    params.push(end_date);
  }

  query += `
    GROUP BY e.id
    ORDER BY e.start_date ${timeframe === 'upcoming' ? 'ASC' : 'DESC'}
  `;

  const [rows] = await db.pool.execute(query, params);
  return rows;
};
export const getEventById = async (eventId) => {
  const [rows] = await db.pool.execute(
    'SELECT * FROM events WHERE id = ?',
    [eventId]
  );
  return rows[0];
};
