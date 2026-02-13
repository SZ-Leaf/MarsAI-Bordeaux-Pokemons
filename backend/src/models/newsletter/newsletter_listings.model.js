// ========== ABONNÉS (table newsletter_listings) ==========

// Récupère un abonné par email (id, confirmed, unsubscribed)
export const getSubscriberByEmail = async (connection, email) => {
   const [rows] = await connection.execute(
      "SELECT id, confirmed, unsubscribed FROM newsletter_listings WHERE email = ?",
      [email]
   );
   return rows[0] ?? null;
};

// Inscrit un email (confirmed = 0, en attente de confirmation)
export const subscribeEmail = async (connection, email, token) => {
   await connection.execute(
      "INSERT INTO newsletter_listings (email, unsubscribe_token, consent_date) VALUES (?, ?, NOW())",
      [email, token]
   );
};

// Confirme l'inscription (double opt-in)
export const confirmSubscription = async (connection, email) => {
   const [result] = await connection.execute(
      "UPDATE newsletter_listings SET confirmed = 1, confirmed_at = NOW() WHERE email = ? AND confirmed = 0",
      [email]
   );
   return result.affectedRows > 0;
};

// Réinscription : réactive un abonné désinscrit (nouveau token, reconfirmation requise)
export const resubscribeEmail = async (connection, email, newUnsubscribeToken) => {
   const [result] = await connection.execute(
      `UPDATE newsletter_listings 
       SET unsubscribed = 0, unsubscribed_at = NULL, unsubscribe_token = ?, confirmed = 0, confirmed_at = NULL, consent_date = NOW() 
       WHERE email = ? AND unsubscribed = 1`,
      [newUnsubscribeToken, email]
   );
   return result.affectedRows > 0;
};

// Marque comme désinscrit (soft delete)
export const unsubscribeEmail = async (connection, token) => {
   const [result] = await connection.execute(
      "UPDATE newsletter_listings SET unsubscribed = 1, unsubscribed_at = NOW() WHERE unsubscribe_token = ?",
      [token]
   );
   return result.affectedRows > 0;
};

// Liste les abonnés actifs (confirmés et non désinscrits)
export const getActiveSubscribers = async (connection) => {
   const [rows] = await connection.execute(
      "SELECT email, unsubscribe_token FROM newsletter_listings WHERE confirmed = 1 AND unsubscribed = 0"
   );
   return rows;
};

// Liste tous les abonnés avec filtres et pagination
// LIMIT/OFFSET en littéraux (MySQL peut refuser les paramètres préparés)
export const getSubscribers = async (connection, { confirmed, unsubscribed, limit = 20, offset = 0 }) => {
   const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
   const offsetNum = Math.max(0, parseInt(offset, 10) || 0);

   let query = "SELECT * FROM newsletter_listings WHERE 1=1";
   const params = [];

   if (confirmed !== undefined) {
      query += " AND confirmed = ?";
      params.push(confirmed);
   }

   if (unsubscribed !== undefined) {
      query += " AND unsubscribed = ?";
      params.push(unsubscribed);
   }

   query += ` ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offsetNum}`;

   const [rows] = await connection.execute(query, params);
   return rows;
};

// Supprime un abonné de la liste
export const deleteSubscriber = async (connection, id) => {
   const [result] = await connection.execute(
      "DELETE FROM newsletter_listings WHERE id = ?",
      [id]
   );
   return result.affectedRows > 0;
};
