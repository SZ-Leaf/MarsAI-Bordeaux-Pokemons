import { Router } from "express";
import {
  createSelectorMemo,
  getPlaylist,
  getPlaylistStatus,
  setPlaylistStatus,
  clearPlaylistStatus,
} from "../../controllers/selector/selector_memo.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.js";
import { rateSubmissionSchema } from "../../utils/schemas/selector.schemas.js";

const router = Router();

// Playlist operations - unified under /playlist prefix
// router.post("/playlist/:list/:submissionId", authenticate, addSubmissionToPlaylist);
// router.put("/playlist/:list/:submissionId", authenticate, removeSubmissionFromPlaylist);
router.get("/playlist/status/:submissionId", authenticate, getPlaylistStatus);
router.put("/playlist/status/:submissionId", authenticate, setPlaylistStatus);
router.delete("/playlist/status/:submissionId", authenticate, clearPlaylistStatus);
router.get("/playlist/:list", authenticate, getPlaylist);

// Rating operations - separate from playlists
router.post("/rate/:id", authenticate, validate(rateSubmissionSchema), createSelectorMemo);

export default router;