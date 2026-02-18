import db from '../../config/db_pool.js';

// Création / mise à jour de la note + commentaires
export const createSelectorMemo = async ({ userId, submissionId, rating, comment, playlist }) => {
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
//fonction qui récupère toutes les soumissions d'une playlist pour un utilisateur donné

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
//récupération de toutes les playlists d'un user (utlisation du count pour avoir le nombre)
export async function getAllPlaylists(user_id) {
  const [rows] = await db.pool.execute(
    `SELECT selection_list, COUNT(*) as count
    FROM selector_memo WHERE user_id = ? AND selection_list IS NOT NULL
    GROUP BY selection_list`,
    [user_id]
  );
  return rows;
}
//fonction qui ajoute une soumission à une playlist 
export async function addSubmissionToPlaylist(user_id, submission_id, selection_list) {
    const [result] = await db.pool.execute(`INSERT INTO selector_memo(user_id, submission_id, selection_list) VALUES (?,?,?)
    ON DUPLICATE KEY UPDATE
    selection_list = VALUES(selection_list),
    updated_at = NOW() `, [user_id, submission_id, selection_list]); 

    return result.affectedRows;
};
//fonction qui retire une soumission d'une playlist et qui la remet à null
export async function removeSubmissionFromPlaylist(user_id, submission_id) {
    const [result] = await db.pool.execute(`UPDATE selector_memo
      SET selection_list = NULL, updated_at = NOW()
      WHERE user_id = ?
      AND submission_id = ?`,
      [user_id, submission_id]
    );

    return result.affectedRows;
};
//récupération du statut d'une playlist pour une soumission donnée et son user_id
export async function getSelectionForSubmission(user_id, submission_id) {
  const [rows] = await db.pool.execute(
    `SELECT selection_list
     FROM selector_memo
     WHERE user_id = ? AND submission_id = ?
     LIMIT 1`,
    [user_id, submission_id]
  );
  return rows[0]?.selection_list ?? null; // "FAVORITES", "WATCH_LATER", "REPORT", null
};
//récupération des vidéos qu'un selector n'aura ni commenter, ni noter ni ajouter à une playlist
export async function findPendingSubmissions(user_id, { limit = 24, offset = 0 } = {}) {
  const userId = Number(user_id);
  const lim = Math.min(parseInt(limit, 10) || 24, 100);
  const off = Math.max(parseInt(offset, 10) || 0, 0);

  const [rows] = await db.pool.execute(
    `SELECT s.*
     FROM submissions s
     LEFT JOIN selector_memo m
      ON m.submission_id = s.id
     AND m.user_id = ?
     WHERE m.id IS NULL
     ORDER BY s.created_at DESC
     LIMIT ${lim} OFFSET ${off}
    `,
    [userId]
  );

  return rows;
}

//récupération du nombre de vidéos en pending pour un selector
export async function countPendingSubmissions(user_id) {
  const userId = Number(user_id);
  const [rows] = await db.pool.execute(
   `SELECT COUNT(*) AS total
    FROM submissions s
    LEFT JOIN selector_memo m
      ON m.submission_id = s.id
    AND m.user_id = ?
    WHERE m.id IS NULL
    `,
    [userId]
  );

  //si rows[0] existe retourne le nombre correspondant au total sinon retourne 0
  return rows[0]?.total ?? 0;
}


  
  