import db from "../../config/db_pool.js";
import { sendError, sendSuccess } from "../../helpers/response.helper.js";
import { sendNewsletterBulk } from "../../services/mailer/mailer.mail.js";
import {
   createNewsletter,
   getNewsletters,
   getNewsletterById,
   updateNewsletter,
   deleteNewsletter,
   markNewsletterAsSent
} from "../../models/newsletter/newsletter.model.js";
import { getActiveSubscribers } from "../../models/newsletter/newsletter_listings.model.js";
import { createLog, getNewsletterStats } from "../../models/newsletter/newsletter_logs.model.js";

// ========== ROUTES ADMIN (CAMPAGNES NEWSLETTER) ==========

// Création d'une newsletter (brouillon)
export const create = async (req, res) => {
   const { title, subject, content, subject_en, content_en } = req.body;
   const connection = await db.pool.getConnection();

   try {
      await connection.beginTransaction();

      const newsletterId = await createNewsletter(connection, { title, subject, content, subject_en, content_en });

      await connection.commit();

      const newsletter = await getNewsletterById(connection, newsletterId);

      return sendSuccess(res, 201, "Newsletter créée", "Newsletter created", { newsletter });

   } catch (error) {
      await connection.rollback();
      console.error("Error creating newsletter:", error);
      return sendError(res, 500, "Erreur lors de la création", "Error creating newsletter", error.message);
   } finally {
      connection.release();
   }
};

// Liste des newsletters (avec filtres et pagination)
export const list = async (req, res) => {
   const { status, limit = 20, offset = 0 } = req.query;
   const connection = await db.pool.getConnection();

   try {
      const newsletters = await getNewsletters(connection, {
         status,
         limit: parseInt(limit),
         offset: parseInt(offset)
      });

      return sendSuccess(res, 200, "Newsletters récupérées", "Newsletters retrieved", { newsletters });

   } catch (error) {
      console.error("Error listing newsletters:", error);
      return sendError(res, 500, "Erreur lors de la récupération", "Error retrieving newsletters", error.message);
   } finally {
      connection.release();
   }
};

// Détail d'une newsletter par ID
export const getById = async (req, res) => {
   const { id } = req.params;
   const connection = await db.pool.getConnection();

   try {
      const newsletter = await getNewsletterById(connection, parseInt(id));

      if (!newsletter) {
         return sendError(res, 404, "Newsletter non trouvée", "Newsletter not found", null);
      }

      return sendSuccess(res, 200, "Newsletter récupérée", "Newsletter retrieved", { newsletter });

   } catch (error) {
      console.error("Error getting newsletter:", error);
      return sendError(res, 500, "Erreur lors de la récupération", "Error retrieving newsletter", error.message);
   } finally {
      connection.release();
   }
};

// Mise à jour d'une newsletter
export const update = async (req, res) => {
   const { id } = req.params;
   const { title, subject, content, subject_en, content_en, status } = req.body;
   const connection = await db.pool.getConnection();

   try {
      await connection.beginTransaction();

      const existing = await getNewsletterById(connection, parseInt(id));
      const effectiveStatus = status ?? existing?.status ?? 'draft';
      const updated = await updateNewsletter(connection, parseInt(id), { title, subject, content, subject_en, content_en, status: effectiveStatus });

      if (!updated) {
         await connection.rollback();
         return sendError(res, 404, "Newsletter non trouvée", "Newsletter not found", null);
      }

      await connection.commit();

      const newsletter = await getNewsletterById(connection, parseInt(id));

      return sendSuccess(res, 200, "Newsletter mise à jour", "Newsletter updated", { newsletter });

   } catch (error) {
      await connection.rollback();
      console.error("Error updating newsletter:", error);
      return sendError(res, 500, "Erreur lors de la mise à jour", "Error updating newsletter", error.message);
   } finally {
      connection.release();
   }
};

// Suppression d'une newsletter
export const deleteNewsletterController = async (req, res) => {
   const { id } = req.params;
   const connection = await db.pool.getConnection();

   try {
      const deleted = await deleteNewsletter(connection, parseInt(id));

      if (!deleted) {
         return sendError(res, 404, "Newsletter non trouvée", "Newsletter not found", null);
      }

      return sendSuccess(res, 200, "Newsletter supprimée", "Newsletter deleted", null);

   } catch (error) {
      console.error("Error deleting newsletter:", error);
      return sendError(res, 500, "Erreur lors de la suppression", "Error deleting newsletter", error.message);
   } finally {
      connection.release();
   }
};

// Envoi de la newsletter à tous les abonnés actifs
export const send = async (req, res) => {
   const { id } = req.params;
   const connection = await db.pool.getConnection();

   try {
      await connection.beginTransaction();

      // Récupère la newsletter
      const newsletter = await getNewsletterById(connection, parseInt(id));

      if (!newsletter) {
         await connection.rollback();
         return sendError(res, 404, "Newsletter non trouvée", "Newsletter not found", null);
      }

      if (newsletter.status === "sent") {
         await connection.rollback();
         return sendError(res, 400, "Newsletter déjà envoyée", "Newsletter already sent", null);
      }

      // Récupère les abonnés actifs
      const subscribers = await getActiveSubscribers(connection);

      if (subscribers.length === 0) {
         await connection.rollback();
         return sendError(res, 400, "Aucun abonné actif", "No active subscribers", null);
      }

      // Envoi par batch
      const results = await sendNewsletterBulk(newsletter, subscribers);

      // Enregistre chaque envoi dans les logs
      for (const subscriber of subscribers) {
         const wasSent = results.errors.find(e => e.email === subscriber.email);
         await createLog(
            connection,
            newsletter.id,
            subscriber.email,
            wasSent ? "failed" : "sent",
            wasSent ? wasSent.error : null
         );
      }

      // Passe le statut à "sent"
      await markNewsletterAsSent(connection, newsletter.id);

      await connection.commit();

      return sendSuccess(res, 200, "Newsletter envoyée", "Newsletter sent", {
         sent: results.success,
         failed: results.failed,
         total: subscribers.length
      });

   } catch (error) {
      await connection.rollback();
      console.error("Error sending newsletter:", error);
      return sendError(res, 500, "Erreur lors de l'envoi", "Error sending newsletter", error.message);
   } finally {
      connection.release();
   }
};

// Statistiques d'envoi d'une newsletter
export const getStatsController = async (req, res) => {
   const { id } = req.params;
   const connection = await db.pool.getConnection();

   try {
      const stats = await getNewsletterStats(connection, parseInt(id));

      return sendSuccess(res, 200, "Statistiques récupérées", "Stats retrieved", { stats });

   } catch (error) {
      console.error("Error getting stats:", error);
      return sendError(res, 500, "Erreur lors de la récupération des stats", "Error retrieving stats", error.message);
   } finally {
      connection.release();
   }
};
