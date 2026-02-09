// ========== LOGS D'ENVOI (table newsletter_logs) ==========

// Enregistre un envoi (sent ou failed)
export const createLog = async (connection, newsletterId, email, status, errorMessage = null) => {
   await connection.execute(
      "INSERT INTO newsletter_logs (newsletter_id, subscriber_email, status, error_message) VALUES (?, ?, ?, ?)",
      [newsletterId, email, status, errorMessage]
   );
};

// Vérifie si l'email a déjà reçu cette newsletter (évite doublons)
export const checkIfAlreadySent = async (connection, newsletterId, email) => {
   const [rows] = await connection.execute(
      "SELECT id FROM newsletter_logs WHERE newsletter_id = ? AND subscriber_email = ? AND status = 'sent'",
      [newsletterId, email]
   );
   return rows.length > 0;
};

// Calcule les stats d'envoi (total, succès, échecs, taux)
export const getNewsletterStats = async (connection, newsletterId) => {
   const [stats] = await connection.execute(
      `SELECT 
         COUNT(*) as total_sent,
         SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as success_count,
         SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count,
         ROUND(SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as success_rate
      FROM newsletter_logs
      WHERE newsletter_id = ?`,
      [newsletterId]
   );

   return stats[0];
};
