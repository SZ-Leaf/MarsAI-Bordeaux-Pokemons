import { Router } from "express";
import { rateSubmission, getPlaylist, addSubmissionToPlaylist, removeSubmissionFromPlaylist } from "../../controllers/selector/selector_memo.controller.js";

const router = Router();

router.get('/:list', getPlaylist);
router.post('/:list/:submissionId', addSubmissionToPlaylist);
router.put('/:list/:submissionId', removeSubmissionFromPlaylist);
router.post('/rate/:id', rateSubmission);

export default router;