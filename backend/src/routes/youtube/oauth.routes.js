import express from 'express';
import { startYoutubeAuth, youtubeCallback } from '../../controllers/oauth/oauth.controller.js';

const router = express.Router();

router.get('/auth/youtube', startYoutubeAuth);
router.get('/oauth2callback', youtubeCallback);

export default router;
