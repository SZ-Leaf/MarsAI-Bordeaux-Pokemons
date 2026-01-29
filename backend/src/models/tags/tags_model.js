//fichier model pour Tags dédié à la gestion des requêtes SQL
import db from  "../../config/db_pool.js";

//récupération de tous les tags 
export async function getAllTags() {
    const [rows] = await db.pool.execute(
        "SELECT id, title FROM tags ORDER BY title ASC"
    );
    return rows;
}
//récupération d'un tag grâce à son id
export async function getTagById(id) {
    const [rows] = await db.pool.execute(
        "SELECT id, title FROM tags WHERE id=?",[id]
    );
    return rows[0] ?? null;
}
//création d'un tag
export async function createTag({title}) {
    const [result] = await db.pool.execute(
        "INSERT INTO tags (title) VALUES(?)",[title]
    );
    return result.insertId;
}
export async function getPopularTags(limit = 10) {
    const safeLimit = Math.max(1,parseInt(limit, 10) || 10)
    const [rows] = await db.pool.execute(
        `SELECT t.id, t.title, COUNT(*) AS usage_count FROM submissions_tags st JOIN tags t ON t.id = st.tag_id GROUP BY t.id, t.title ORDER BY usage_count DESC LIMIT ${safeLimit}`
    );
    return rows;
    
}

export default { getAllTags, getTagById, createTag, getPopularTags};
