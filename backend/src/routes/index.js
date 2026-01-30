import { Router } from 'express';
import youtube from './youtube_routes.js';
import oauth from './oauth_routes.js';
import submissionRoutes from './submission.routes.js';
import authRoutes from './auth/auth_routes.js';

const router = Router();

// Routes de soumission
router.use('/submissions', submissionRoutes);
router.use('/youtube', youtube)
router.use('/oauth', oauth)
router.use('/auth', authRoutes);


export default router;
