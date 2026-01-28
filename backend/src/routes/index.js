import { Router } from 'express';
import youtube from './youtube_routes.js';
import oauth from './oauth_routes.js';

const router = Router();


router.use('/youtube', youtube)
router.use('/oauth', oauth)


export default router;
