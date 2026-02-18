import { Router } from 'express';
import tagsRoutes from './tags.routes.js';
import authRoutes from './auth/auth.routes.js';
import submissionRoutes from './submission/submission.routes.js';
import sponsorsRoutes from './sponsors/sponsors.routes.js';
import youtubeRoutes from './youtube/youtube.routes.js';
import oauthRoutes from './youtube/oauth.routes.js';
import newsletterRoutes from './newsletter/newsletter.routes.js';
import selectorRoutes from './selector/selector.routes.js'
import eventRoutes from './events/event.routes.js';
import reservationRoutes from './events/reservations.routes.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes de soumission
router.use('/submissions', authenticate, submissionRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/oauth', oauthRoutes);
router.use('/auth', authRoutes);
router.use('/tags',tagsRoutes);
router.use('/sponsors', sponsorsRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/selector', selectorRoutes);
router.use('/events', eventRoutes);
router.use('/events', reservationRoutes);


export default router;
