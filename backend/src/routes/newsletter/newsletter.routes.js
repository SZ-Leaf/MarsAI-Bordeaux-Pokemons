import { Router } from 'express';
import {
   create,
   list,
   getById,
   update,
   deleteNewsletterController,
   send,
   getStatsController
} from '../../controllers/newsletter/newsletter.controller.js';
import {
   subscribe,
   confirm,
   unsubscribe,
   listSubscribers,
   deleteSubscriberController
} from '../../controllers/newsletter/newsletter_listings.controller.js';

const router = Router();

// ========== ROUTES PUBLIQUES ==========
router.post('/subscribe', subscribe);           // Inscription
router.get('/confirm', confirm);                // Confirmation (double opt-in) ?token=xxx
router.get('/unsubscribe', unsubscribe);        // Désinscription ?token=xxx

// ========== ROUTES ADMIN ==========
router.post('/admin', create);
router.get('/admin', list);
router.get('/admin/:id', getById);
router.patch('/admin/:id', update);
router.delete('/admin/:id', deleteNewsletterController);

// Envoi
router.post('/admin/:id/send', send);

// Statistiques
router.get('/admin/:id/stats', getStatsController);

// Gestion des abonnés
router.get('/admin/subscribers', listSubscribers);
router.delete('/admin/subscribers/:id', deleteSubscriberController);

export default router;
