import { Router } from 'express';
import tagsRoutes from './tags.routes.js';
import authRoutes from './auth/auth.routes.js';
import submissionRoutes from './submission/submission.routes.js';
import sponsorsRoutes from './sponsors/sponsors.routes.js';
import oauthRoutes from './youtube/oauth.routes.js';
import newsletterRoutes from './newsletter/newsletter.routes.js';
import selectorRoutes from './selector/selector.routes.js'
import eventRoutes from './events/event.routes.js';
import reservationRoutes from './events/reservations.routes.js';
import juryRoutes from './jury/jury.routes.js';
import awardsRoutes from './awards/awards.routes.js';

const router = Router();

router.use('/submissions', submissionRoutes);
router.use('/oauth', oauthRoutes);
router.use('/auth', authRoutes);
router.use('/tags',tagsRoutes);
router.use('/sponsors', sponsorsRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/selector', selectorRoutes);
router.use('/events', eventRoutes);
router.use('/events', reservationRoutes);
router.use('/jury', juryRoutes);
router.use('/awards', awardsRoutes);


export default router;
