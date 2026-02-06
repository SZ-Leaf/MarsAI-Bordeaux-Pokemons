import { Router } from 'express';
import tagsRoutes from './tags.routes.js';
import authRoutes from './auth/auth.routes.js';
import submissionRoutes from './submission/submission.routes.js';
import sponsorsRoutes from './sponsors/sponsors.routes.js';
import youtubeRoutes from './youtube/youtube.routes.js';
import oauthRoutes from './youtube/oauth.routes.js';
import newsletterRoutes from './newsletter/newsletter.routes.js';
import selectorRoutes from './selector/selector.routes.js'

const router = Router();

// Routes de soumission
router.use('/submissions', submissionRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/oauth', oauthRoutes);
router.use('/auth', authRoutes);
router.use('/tags',tagsRoutes);
router.use('/sponsors', sponsorsRoutes);
<<<<<<< HEAD
router.use('/selector', selectorRoutes);
=======
>>>>>>> ed4ee0cc8f934e6cf9bb91d43ca3b6ba223ccd42
router.use('/newsletter', newsletterRoutes);


export default router;
