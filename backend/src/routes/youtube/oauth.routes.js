import express from 'express';
import { startYoutubeAuth, youtubeCallback } from '../../controllers/oauth/oauth.controller.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/auth/youtube', authenticate, requireRole([3]), startYoutubeAuth);
router.get('/oauth2callback', authenticate, requireRole([3]), youtubeCallback);

export default router;
