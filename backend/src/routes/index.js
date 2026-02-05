import { Router } from 'express';
import tagsRoutes from './tags.routes.js';
import authRoutes from './auth/auth.routes.js';
import submissionRoutes from './submission/submission.routes.js';
import youtubeRoutes from './youtube/youtube.routes.js';
import oauthRoutes from './youtube/oauth.routes.js';
import selectorRoutes from './selector/selector.routes.js'

const router = Router();

// Routes de soumission
router.use('/submissions', submissionRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/oauth', oauthRoutes);
router.use('/auth', authRoutes);
router.use('/tags',tagsRoutes);
router.use('/selectors', selectorRoutes);

export default router;
