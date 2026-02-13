import { Router } from 'express';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validation.js';
import { subscribeSchema, newsletterSchema } from '../../utils/schemas/newsletter.schemas.js';
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
router.post('/subscribe', validate(subscribeSchema), subscribe);
router.get('/confirm', confirm);
router.get('/unsubscribe', unsubscribe);

// ========== ROUTES ADMIN ==========

router.post('/admin', authenticate, requireRole([2, 3]), validate(newsletterSchema), create);
router.get('/admin', authenticate, requireRole([2, 3]), list);
// Routes /admin/subscribers AVANT /admin/:id pour ne pas capturer "subscribers" comme id
router.get('/admin/subscribers', authenticate, requireRole([2, 3]), listSubscribers);
router.delete('/admin/subscribers/:id', authenticate, requireRole([2, 3]), deleteSubscriberController);

router.get('/admin/:id', authenticate, requireRole([2, 3]), getById);
router.patch('/admin/:id', authenticate, requireRole([2, 3]), validate(newsletterSchema), update);
router.delete('/admin/:id', authenticate, requireRole([2, 3]), deleteNewsletterController);
router.post('/admin/:id/send', authenticate, requireRole([2, 3]), send);
router.get('/admin/:id/stats', authenticate, requireRole([2, 3]), getStatsController);

export default router;
