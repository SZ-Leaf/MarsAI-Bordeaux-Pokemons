//ajout de tags à une soumission
export async function addTagsToSubmission(connection, submissionId, tagIds = []) {
    //on convertit tagsids en nombre, on utilise Set pour supprimer les doublons puis on reconvertit en tableau et on conserve uniquement les données valides
    const ids = [...new Set((tagIds || []).map(Number))].filter((n) => n > 0);

    if (!ids.length) return 0;
    //on génère dynamiquement les placeholders "(?, ?)" pour chaque tag
    const placeholders = ids.map(() => "(?, ?)").join(", ");
    //les valeurs sont ensuite passées séparément dans params (protection contre l'injection SQL)
    const params = ids.flatMap((tagId) => [submissionId, tagId]);
    // INSERT IGNORE évite une erreur si la relation (submission_id, tag_id) existe déjà dans la table de jointure
    const [result] = await connection.execute(
        `INSERT IGNORE INTO submissions_tags (submission_id, tag_id) VALUES ${placeholders}`,
        params
    );

    return result.affectedRows;
}
//récupération des tags liés à une soumission avec son id
export async function getTagsBySubmissionId(connection, submissionId) {
    const [rows] = await connection.execute(
        "SELECT t.id, t.title FROM submissions_tags st JOIN tags t ON t.id = st.tag_id WHERE st.submission_id = ? ORDER BY t.title ASC",[submissionId]
    );

    return rows
}


export default { addTagsToSubmission, getTagsBySubmissionId}
