import db from '../../config/db_pool.js';

// Création / mise à jour de la note + commentaires
<<<<<<< HEAD
export const rateSubmission = async ({ userId, submissionId, rating, comment, playlist }) => {
=======
export const createSelectorMemo = async ({ userId, submissionId, rating, comment, playlist }) => {
>>>>>>> main
  try {
    // insert columns and values
    const insertColumns = ['user_id', 'submission_id'];
    const insertValues = [userId, submissionId];
    
    if (rating !== undefined) {
      insertColumns.push('rating');
      insertValues.push(rating);
    }
    if (comment !== undefined) {
      insertColumns.push('comment');
      insertValues.push(comment);
    }
    if (playlist !== undefined) {
      insertColumns.push('selection_list');
      insertValues.push(playlist);
    }
    
    // update fields only if they are provided
    const updateFields = [];
    const updateValues = [];
    
    if (rating !== undefined) {
      updateFields.push("rating = ?");
      updateValues.push(rating);
    }
    if (comment !== undefined) {
      updateFields.push("comment = ?");
      updateValues.push(comment);
    }
    if (playlist !== undefined) {
      updateFields.push("selection_list = ?");
      updateValues.push(playlist);
    }
    
    // always update updated_at
    updateFields.push("updated_at = NOW()");
    
    // combine all values: insert values first, then update values
    const allValues = [...insertValues, ...updateValues];
    
    const sql = `INSERT INTO selector_memo (${insertColumns.join(', ')}) 
                 VALUES (${insertColumns.map(() => '?').join(', ')}) 
                 ON DUPLICATE KEY UPDATE ${updateFields.join(", ")}`;
    
    const [result] = await db.pool.execute(sql, allValues);
    return result.affectedRows;
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function getPlaylist(user_id, selection_list) {
    const [rows] = await db.pool.execute(
        `SELECT s.*, sm.selection_list, sm.updated_at
        FROM submissions s
        JOIN selector_memo sm ON sm.submission_id = s.id
        WHERE sm.user_id = ?
        AND sm.selection_list = ?
        ORDER BY sm.updated_at DESC`,
        [user_id, selection_list]
    );
    return rows;
};
 
export async function addSubmissionToPlaylist(user_id, submission_id, selection_list) {
    const [result] = await db.pool.execute(`INSERT INTO selector_memo(user_id, submission_id, selection_list) VALUES (?,?,?)
    ON DUPLICATE KEY UPDATE
    selection_list = VALUES(selection_list),
    updated_at = NOW() `, [user_id, submission_id, selection_list]); 

    return result.affectedRows;
};

export async function removeSubmissionFromPlaylist(user_id, submission_id, selection_list) {
    const [result] = await db.pool.execute(`UPDATE selector_memo
    SET selection_list = NULL, updated_at = NOW()
    WHERE user_id = ?
    AND submission_id = ?
    AND selection_list = ?`, [user_id, submission_id, selection_list]);

    return result.affectedRows;
};