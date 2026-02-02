import db from "../../config/db_pool.js"

export async function addTagsToSubmission(submissionId, tagIds) {
    const values = tagIds.map((tagId) => [submissionId, tagId]);

    const [result] = await db.pool.execute(
        "INSERT INTO submissions_tags (submission_id,tag_id) VALUES ?", [values]
    ); 

    return result.affectedRows
}

export async function getTagsBySubmissionId(submissionId) {

    const [rows] = await db.pool.execute(
        "SELECT t.id, t.title FROM submissions_tags st JOIN tags t ON t.id = st.tag_id WHERE st.submission_id = ? ORDER BY t.title ASC",[submissionId]
    );

    return rows
}


export default { addTagsToSubmission, getTagsBySubmissionId}