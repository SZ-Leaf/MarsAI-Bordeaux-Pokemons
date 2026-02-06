import { Router } from "express";
import {
  createSelectorMemo,
  getPlaylist,
  addSubmissionToPlaylist,
  removeSubmissionFromPlaylist,
} from "../../controllers/selector/selector_memo.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.js";
import { rateSubmissionSchema } from "../../utils/schemas/selector.schemas.js";

const router = Router();

// Playlist operations - unified under /playlist prefix
router.get("/playlist/:list", authenticate, getPlaylist);
router.post("/playlist/:list/:submissionId", authenticate, addSubmissionToPlaylist);
router.put("/playlist/:list/:submissionId", authenticate, removeSubmissionFromPlaylist);

// Rating operations - separate from playlists
router.post("/rate/:id", authenticate, validate(rateSubmissionSchema), createSelectorMemo);

export default router;