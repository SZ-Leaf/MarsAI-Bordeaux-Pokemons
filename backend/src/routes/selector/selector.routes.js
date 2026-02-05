import { Router } from "express";
import { rateSubmission, getPlaylist, addSubmissionToPlaylist, removeSubmissionFromPlaylist } from "../../controllers/selector/selector_memo.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

// Playlist operations - unified under /playlist prefix
router.get('/playlist/:list', authenticate, getPlaylist);
router.post('/playlist/:list/:submissionId', authenticate, addSubmissionToPlaylist);
router.put('/playlist/:list/:submissionId', authenticate, removeSubmissionFromPlaylist);

// Rating operations - separate from playlists
router.post('/rate/:id', authenticate, rateSubmission);

export default router;