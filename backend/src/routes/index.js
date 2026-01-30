import { Router } from 'express';
import submissionRoutes from './submission.routes.js';
import youtube from './youtube_routes.js';
import oauth from './oauth_routes.js';

const router = Router();

// Routes de soumission
router.use('/submissions', submissionRoutes);

router.use('/youtube', youtube)
router.use('/oauth', oauth)


export default router;
