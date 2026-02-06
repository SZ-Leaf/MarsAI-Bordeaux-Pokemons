import db from '../../config/db_pool.js';

export const getTagsBySubmissionId = async (submissionId) => {
  const connection = await db.pool.getConnection();
  try {
    const [tags] = await connection.execute(
      `SELECT t.id, t.title
       FROM tags t
       JOIN submissions_tags st ON t.id = st.tag_id
       WHERE st.submission_id = ?`,
      [submissionId]
    );
    return tags;
  } finally {
    connection.release();
  }
};
