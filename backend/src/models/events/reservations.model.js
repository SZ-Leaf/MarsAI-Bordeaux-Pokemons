import db from '../../config/db_pool.js';

export const createReservation = async ({
  first_name,
  last_name,
  email,
  event_id
}) => {

  const [result] = await db.pool.execute(
    `INSERT INTO reservations(first_name, last_name, email, event_id)
     VALUES (?, ?, ?, ?)`,
    [first_name, last_name, email, event_id]
  );

  return result.insertId;
};

export const confirmReservationWithSeatUpdate = async (reservationId) => {
  const connection = await db.pool.getConnection();

  try {
    await connection.beginTransaction();

    const [reservations] = await connection.execute(
      `SELECT event_id, confirmation
       FROM reservations
       WHERE id = ?`,
      [reservationId]
    );

    if (reservations.length === 0) {
      throw new Error("RESERVATION_NOT_FOUND");
    }

    if (reservations[0].confirmed_at) {
      throw new Error("ALREADY_CONFIRMED");
    }

    const eventId = reservations[0].event_id;

    const [updateEvent] = await connection.execute(
      `UPDATE events
       SET places = places - 1
       WHERE id = ? AND places > 0`,
      [eventId]
    );

    if (updateEvent.affectedRows === 0) {
      throw new Error("NO_PLACES_AVAILABLE");
    }

    await connection.execute(
      `UPDATE reservations
       SET confirmation = NOW()
       WHERE id = ?`,
      [reservationId]
    );

    await connection.commit();
    return true;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
