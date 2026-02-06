import db from '../../config/db_pool.js';

export async function createSponsor({ name, cover, url }) {
  const [result] = await db.pool.execute(
    "INSERT INTO sponsors (name, cover, url) VALUES (?,?,?)",
    [name, cover, url]
  );
  return result.insertId;
}

export const updateSponsorCover = async (sponsorId, coverUrl) => {
  await db.pool.execute(
    'UPDATE sponsors SET cover = ? WHERE id = ?',
    [coverUrl, sponsorId]
  );
};

export const deleteSponsor = async (sponsorId) => {
  await db.pool.execute(
    'DELETE FROM sponsors WHERE id = ?',
    [sponsorId]
  );
};
export const getSponsors = async () => {
  const [rows] = await db.pool.execute('SELECT * FROM sponsors ORDER BY id DESC');
  return rows;
};
