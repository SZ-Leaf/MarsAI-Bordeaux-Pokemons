import { Router } from "express";
import { validate } from "../../middlewares/validation.js";
import { awardCreateSchema, awardUpdateSchema } from "@marsai/schemas";
import { awardCreate, awardDelete, awardsBySubmission, awardSetSubmission, awardShow, awardsList, awardsUnassigned, awardUpdate } from "../../controllers/awards/awards.controller.js";
import { uploadAwardCover } from "../../middlewares/upload.js";

const router = Router();

router.get("/", awardsList);
router.get("/unassign", awardsUnassigned);
router.get("/by_submission/:submissionId", awardsBySubmission);
// router.get("/:id", awardShow);
router.post("/",uploadAwardCover,validate(awardCreateSchema), awardCreate);
router.put("/:id",uploadAwardCover, validate(awardUpdateSchema), awardUpdate);
router.delete("/:id", awardDelete);
router.put("/:id/submission", awardSetSubmission);

export default router;
