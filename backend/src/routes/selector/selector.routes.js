import { Router } from "express";
import {
  createSelectorMemo,
  deleteMemo,
  getPlaylist,
  getAllPlaylistsCount,
  getPendingSubmissions
} from "../../controllers/selector/selector_memo.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.js";
import { rateSubmissionSchema } from "../../utils/schemas/selector.schemas.js";

const router = Router();

router.get("/playlists", authenticate, getAllPlaylistsCount);
router.get("/playlist/:list", authenticate, getPlaylist);
router.get("/submissions/pending", authenticate, getPendingSubmissions);

// Rating operations - separate from playlists
router.post("/rate/:id", authenticate, validate(rateSubmissionSchema), createSelectorMemo);
router.delete("/rate/:id", authenticate, deleteMemo);

export default router;