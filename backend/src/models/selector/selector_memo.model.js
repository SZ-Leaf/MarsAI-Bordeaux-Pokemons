import db from '../../config/db_pool.js';

// Création / mise à jour de la note + commentaires
export const upsertSelectorMemo = async ({ userId, submissionId, rating, comment }) => {
  const [result] = await db.pool.execute(
    `INSERT INTO selector_memo (user_id, submission_id, rating, comment, selection_list)
     VALUES (?, ?, ?, ?, '1')
     ON DUPLICATE KEY UPDATE
       rating = VALUES(rating),
       comment = VALUES(comment),
       updated_at = CURRENT_TIMESTAMP`,
    [userId, submissionId, rating, comment || '']
  );
  return result;
};