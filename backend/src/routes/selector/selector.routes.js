import { Router } from "express";
import {
  createSelectorMemo,
  deleteMemo,
  getPlaylist,
  getAllPlaylistsCount,
  getPendingSubmissions,
  adminReportedList,
  adminReportedDetail
} from "../../controllers/selector/selector_memo.controller.js";
import { authenticate, requireRole } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.js";
import { rateSubmissionSchema } from "../../utils/schemas/selector.schemas.js";

const router = Router();

router.get("/playlists", authenticate, getAllPlaylistsCount);
router.get("/playlist/:list", authenticate, getPlaylist);
router.get("/submissions/pending", authenticate, getPendingSubmissions);

// Rating operations - separate from playlists
router.post("/rate/:id", authenticate, validate(rateSubmissionSchema), createSelectorMemo);
router.delete("/rate/:id", authenticate, deleteMemo);

//récupération des reported videos de tous les users
router.get("/admin/reported",authenticate, requireRole([2, 3]), adminReportedList);
router.get("/admin/reported/:submissionId",authenticate, requireRole([2, 3]), adminReportedDetail);

export default router;