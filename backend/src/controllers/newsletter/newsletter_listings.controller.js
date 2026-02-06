import db from "../../config/db_pool.js";
import { sendError, sendSuccess } from "../../helpers/response.helper.js";
import {
   generateNewsletterConfirmToken,
   verifyNewsletterConfirmToken,
   generateNewsletterUnsubscribeToken,
   verifyNewsletterUnsubscribeToken
} from "../../services/mailer/mailer.tokens.js";
import { sendNewsletterConfirmation } from "../../services/mailer/mailer.mail.js";
import {
   getSubscriberByEmail,
   subscribeEmail,
   resubscribeEmail,
   confirmSubscription,
   unsubscribeEmail,
   getSubscribers,
   deleteSubscriber
} from "../../models/newsletter/newsletter_listings.model.js";

// ========== ROUTES PUBLIQUES (ABONNÉS) ==========

// Inscription à la newsletter (envoie email de confirmation)
export const subscribe = async (req, res) => {
   const { email, consent } = req.body;
   const connection = await db.pool.getConnection();

   try {
      await connection.beginTransaction();

      // Vérifie si déjà inscrit
      const sub = await getSubscriberByEmail(connection, email);

      if (sub) {
         if (sub.confirmed && !sub.unsubscribed) {
            return sendError(res, 409, "Vous êtes déjà inscrit", "Already subscribed", null);
         }

         if (sub.unsubscribed) {
            // Réinscription : réactive la ligne et envoie un nouvel email de confirmation
            const confirmToken = generateNewsletterConfirmToken(email);
            const unsubscribeToken = generateNewsletterUnsubscribeToken();
            const reactivated = await resubscribeEmail(connection, email, unsubscribeToken);
            if (!reactivated) {
               return sendError(res, 500, "Erreur lors de la réinscription", "Error resubscribing", null);
            }
            await sendNewsletterConfirmation(email, confirmToken);
            await connection.commit();
            return sendSuccess(res, 201, "Vérifiez votre email pour confirmer", "Check your email to confirm", null);
         }

         if (!sub.confirmed) {
            return sendError(res, 409, "Inscription en attente de confirmation", "Pending confirmation", null);
         }
      }

      // Génère les tokens (JWT confirmation + crypto désinscription)
      const confirmToken = generateNewsletterConfirmToken(email);
      const unsubscribeToken = generateNewsletterUnsubscribeToken();

      // Enregistre l'abonné en BDD
      await subscribeEmail(connection, email, unsubscribeToken);

      // Envoie l'email de confirmation
      await sendNewsletterConfirmation(email, confirmToken);

      await connection.commit();

      return sendSuccess(res, 201, "Vérifiez votre email pour confirmer", "Check your email to confirm", null);

   } catch (error) {
      await connection.rollback();
      console.error("Error subscribing:", error);
      return sendError(res, 500, "Erreur lors de l'inscription", "Error subscribing", error.message);
   } finally {
      connection.release();
   }
};

// Confirmation de l'inscription (clic sur le lien dans l'email)
export const confirm = async (req, res) => {
   const { token } = req.query;
   if (!token) {
      return sendError(res, 400, "Token manquant", "Token missing", null);
   }
   const connection = await db.pool.getConnection();

   try {
      const email = verifyNewsletterConfirmToken(token);

      const confirmed = await confirmSubscription(connection, email);

      if (!confirmed) {
         return sendError(res, 404, "Inscription déjà confirmée ou inexistante", "Already confirmed or not found", null);
      }

      return sendSuccess(res, 200, "Inscription confirmée", "Subscription confirmed", null);

   } catch (error) {
      console.error("Error confirming:", error);
      return sendError(res, 400, "Token invalide ou expiré", "Invalid or expired token", error.message);
   } finally {
      connection.release();
   }
};

// Désinscription (lien dans chaque newsletter)
export const unsubscribe = async (req, res) => {
   const { token } = req.query;
   if (!token) {
      return sendError(res, 400, "Token manquant", "Token missing", null);
   }
   const connection = await db.pool.getConnection();

   try {
      const email = await verifyNewsletterUnsubscribeToken(token);

      const unsubscribed = await unsubscribeEmail(connection, token);

      if (!unsubscribed) {
         return sendError(res, 404, "Abonnement non trouvé", "Subscription not found", null);
      }

      return sendSuccess(res, 200, "Désinscription réussie", "Unsubscribed successfully", null);

   } catch (error) {
      console.error("Error unsubscribing:", error);
      return sendError(res, 400, "Token invalide", "Invalid token", error.message);
   } finally {
      connection.release();
   }
};

// ========== ROUTES ADMIN (GESTION DES ABONNÉS) ==========

// Liste des abonnés (avec filtres et pagination)
export const listSubscribers = async (req, res) => {
   const { confirmed, unsubscribed, limit = 20, offset = 0 } = req.query;
   const connection = await db.pool.getConnection();

   try {
      const subscribers = await getSubscribers(connection, {
         confirmed: confirmed !== undefined ? parseInt(confirmed) : undefined,
         unsubscribed: unsubscribed !== undefined ? parseInt(unsubscribed) : undefined,
         limit: parseInt(limit),
         offset: parseInt(offset)
      });

      return sendSuccess(res, 200, "Abonnés récupérés", "Subscribers retrieved", { subscribers });

   } catch (error) {
      console.error("Error listing subscribers:", error);
      return sendError(res, 500, "Erreur lors de la récupération", "Error retrieving subscribers", error.message);
   } finally {
      connection.release();
   }
};

// Suppression d'un abonné
export const deleteSubscriberController = async (req, res) => {
   const { id } = req.params;
   const connection = await db.pool.getConnection();

   try {
      const deleted = await deleteSubscriber(connection, parseInt(id));

      if (!deleted) {
         return sendError(res, 404, "Abonné non trouvé", "Subscriber not found", null);
      }

      return sendSuccess(res, 200, "Abonné supprimé", "Subscriber deleted", null);

   } catch (error) {
      console.error("Error deleting subscriber:", error);
      return sendError(res, 500, "Erreur lors de la suppression", "Error deleting subscriber", error.message);
   } finally {
      connection.release();
   }
};
