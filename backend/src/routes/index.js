import { Router } from 'express';
import submissionRoutes from './submission.routes.js';
import youtubeRoutes from './youtube_routes.js';
import oauthRoutes from './oauth_routes.js';
import authRoutes from './auth/auth_routes.js';

const router = Router();

// Routes de soumission
router.use('/submissions', submissionRoutes);
router.use('/youtube', youtubeRoutes)
router.use('/oauth', oauthRoutes)
router.use('/auth', authRoutes);


export default router;
