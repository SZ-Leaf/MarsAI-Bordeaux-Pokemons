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
// récupération d'un tag grâce à son titre
export async function getTagByTitle(title) {
  const [rows] = await db.pool.execute(
    "SELECT id, title FROM tags WHERE LOWER(title) = LOWER(?) LIMIT 1",
    [title]
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
//récupération des tags les plus populaires avec une limite fixée à 10
export async function getPopularTags(limit = 10) {

    const [rows] = await db.pool.execute(
        `SELECT t.id, t.title, COUNT(*) AS usage_count FROM submissions_tags st JOIN tags t ON t.id = st.tag_id GROUP BY t.id, t.title ORDER BY usage_count DESC `
    );
    return rows;
    
}
//requête qui recherche les titres des tags (utilisée pour l'autocompletion)  
export async function searchTags(search, limit = 10) {
    const query = `%${search.toLowerCase()}%`;

    const [rows] = await db.pool.execute(
        "SELECT id, title FROM tags WHERE LOWER(title) LIKE ? ORDER BY title ASC",
        [query]
    );
    return rows;
}




export default { getAllTags, getTagById, createTag, getPopularTags, getTagByTitle, searchTags};
