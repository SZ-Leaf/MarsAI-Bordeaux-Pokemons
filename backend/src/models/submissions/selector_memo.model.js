import db from "../../config/db_pool.js"

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

export default {getPlaylist, addSubmissionToPlaylist, removeSubmissionFromPlaylist}