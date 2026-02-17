export const createReservationWithSeatUpdate = async ({ first_name, last_name, email, event_id }) => {
  const connection = await db.pool.getConnection();

  try {
    await connection.beginTransaction();

    const [updateResult] = await connection.execute(
      `UPDATE events
       SET places = places - 1
       WHERE id = ? AND places > 0`,
      [event_id]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error('NO_PLACES_AVAILABLE');
    }

    const [reservationResult] = await connection.execute(
      `INSERT INTO reservations(first_name, last_name, email, event_id)
       VALUES (?, ?, ?, ?)`,
      [first_name, last_name, email, event_id]
    );

    await connection.commit();

    return reservationResult.insertId;

  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('EMAIL_ALREADY_REGISTERED');
    }

    throw error;
  } finally {
    connection.release();
  }
};
