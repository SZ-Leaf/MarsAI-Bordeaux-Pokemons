import db from '../../config/db_pool.js';

export async function createSponsor({name, cover, url}) {
    const [result] = await db.pool.execute(
      "INSERT INTO sponsors (name, cover, url) VALUES(?,?,?)",[name, cover, url]
    );
    return result.insertId;
}

export const updateSponsorCover = async (sponsorId, coverUrl) => {
  const connection = await db.pool.getConnection();
  try {
    await connection.execute(
      'UPDATE sponsors SET cover = ? WHERE id = ?',
      [coverUrl, sponsorId]
    );
  } finally {
    connection.release();
  }
};
