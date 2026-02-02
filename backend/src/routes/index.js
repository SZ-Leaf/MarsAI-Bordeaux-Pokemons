import { Router } from 'express';
import tagsRoutes from './tags.routes.js'
import authRoutes from './auth/auth_routes.js';
import submissionRoutes from './submission/submission_routes.js';
import youtubeRoutes from './youtube/youtube_routes.js';
import oauthRoutes from './youtube/oauth_routes.js';

const router = Router();

// Routes de soumission
router.use('/submissions', submissionRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/oauth', oauthRoutes);
router.use('/auth', authRoutes);
router.use('/tags',tagsRoutes);


export default router;
