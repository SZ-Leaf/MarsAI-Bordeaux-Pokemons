import { Router } from 'express';
import authRoutes from './auth/auth_routes.js';
import submitRoutes from './submission/submission_routes.js';
import youtubeRoutes from './youtube/youtube_routes.js';
import oauthRoutes from './youtube/oauth_routes.js';

const router = Router();

// Routes de soumission
router.use('/submit', submitRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/oauth', oauthRoutes);
router.use('/auth', authRoutes);


export default router;
