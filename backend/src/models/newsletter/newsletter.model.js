// ========== CAMPAGNES NEWSLETTER (table newsletter) ==========

// Crée une newsletter (statut draft)
export const createNewsletter = async (connection, { title, subject, content }) => {
   const [result] = await connection.execute(
      "INSERT INTO newsletter (title, subject, content, status) VALUES (?, ?, ?, ?)",
      [title, subject, content, "draft"]
   );
   return result.insertId;
};

// Liste les newsletters avec filtres et pagination
export const getNewsletters = async (connection, { status, limit = 20, offset = 0 }) => {
   let query = "SELECT * FROM newsletter";
   const params = [];

   if (status) {
      query += " WHERE status = ?";
      params.push(status);
   }

   query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
   params.push(limit, offset);

   const [rows] = await connection.execute(query, params);
   return rows;
};

// Récupère une newsletter par ID
export const getNewsletterById = async (connection, id) => {
   const [rows] = await connection.execute(
      "SELECT * FROM newsletter WHERE id = ?",
      [id]
   );
   return rows[0];
};

// Met à jour une newsletter
export const updateNewsletter = async (connection, id, { title, subject, content, status }) => {
   const [result] = await connection.execute(
      "UPDATE newsletter SET title = ?, subject = ?, content = ?, status = ? WHERE id = ?",
      [title, subject, content, status, id]
   );
   return result.affectedRows > 0;
};

// Supprime une newsletter
export const deleteNewsletter = async (connection, id) => {
   const [result] = await connection.execute(
      "DELETE FROM newsletter WHERE id = ?",
      [id]
   );
   return result.affectedRows > 0;
};

// Passe le statut à "sent" et enregistre la date d'envoi
export const markNewsletterAsSent = async (connection, id) => {
   await connection.execute(
      "UPDATE newsletter SET status = ?, sent_at = NOW() WHERE id = ?",
      ["sent", id]
   );
};
