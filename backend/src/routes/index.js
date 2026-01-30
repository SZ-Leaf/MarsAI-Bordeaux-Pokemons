import { Router } from 'express';
<<<<<<< HEAD
import youtube from './youtube_routes.js';
import oauth from './oauth_routes.js';
=======
import submissionRoutes from './submission.routes.js';
import youtube from './youtube_routes.js';
import oauth from './oauth_routes.js';
import authRoutes from './auth/auth_routes.js';
>>>>>>> a50efaedb528ded38bb82d4df8e3d01cb07a980e

const router = Router();

// Routes de soumission
router.use('/submissions', submissionRoutes);
router.use('/youtube', youtube)
router.use('/oauth', oauth)
router.use('/auth', authRoutes);

<<<<<<< HEAD
router.use('/youtube', youtube)
router.use('/oauth', oauth)


export default router;
=======

export default router;
>>>>>>> a50efaedb528ded38bb82d4df8e3d01cb07a980e
