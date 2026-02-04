import { Router } from "express";
import { getPlaylist, addSubmissionToPlaylist, removeSubmissionFromPlaylist } from "../../controllers/submissions/selector_memo.controller.js";

const router = Router();

router.get('/:list', getPlaylist);
router.post('/:list/:submissionId', addSubmissionToPlaylist);
router.put('/:list/:submissionId', removeSubmissionFromPlaylist);

export default router;