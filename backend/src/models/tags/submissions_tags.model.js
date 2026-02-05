export async function addTagsToSubmission(connection, submissionId, tagIds = []) {
    const ids = [...new Set((tagIds || []).map(Number))].filter((n) => n > 0);

    if (!ids.length) return 0;

    const placeholders = ids.map(() => "(?, ?)").join(", ");
    const params = ids.flatMap((tagId) => [submissionId, tagId]);

    const [result] = await connection.execute(
        `INSERT IGNORE INTO submissions_tags (submission_id, tag_id) VALUES ${placeholders}`,
        params
    );

    return result.affectedRows;
}

export async function getTagsBySubmissionId(connection, submissionId) {
    const [rows] = await connection.execute(
        "SELECT t.id, t.title FROM submissions_tags st JOIN tags t ON t.id = st.tag_id WHERE st.submission_id = ? ORDER BY t.title ASC",[submissionId]
    );

    return rows
}


export default { addTagsToSubmission, getTagsBySubmissionId}
