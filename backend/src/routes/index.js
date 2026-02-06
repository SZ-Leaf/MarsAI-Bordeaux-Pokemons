import { Router } from 'express';
import tagsRoutes from './tags.routes.js'
import authRoutes from './auth/auth.routes.js';
import submissionRoutes from './submission/submission.routes.js';
import youtubeRoutes from './youtube/youtube.routes.js';
import oauthRoutes from './youtube/oauth.routes.js';
import newsletterRoutes from './newsletter/newsletter.routes.js';

const router = Router();

// Routes de soumission
router.use('/submissions', submissionRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/oauth', oauthRoutes);
router.use('/auth', authRoutes);
router.use('/tags',tagsRoutes);

// Routes NewsLetter
router.use('/newsletter', newsletterRoutes);


export default router;
