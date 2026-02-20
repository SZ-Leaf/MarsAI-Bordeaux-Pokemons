import { Router } from "express";
import { juryList, findJuryById, createNewJuryMember, deleteMemberById, updateMemberById } from "../../controllers/jury/jury.controller.js";
import { validate } from "../../middlewares/validation.js";
import { jurySchema } from "../../utils/schemas/jury.schema.js";
import { uploadJuryCover } from "../../middlewares/upload.js";


const router = Router();

router.get("/", juryList);
router.get("/:id", findJuryById );
router.post("/", validate(jurySchema), uploadJuryCover,createNewJuryMember,);
router.delete("/:id", deleteMemberById);
router.put("/:id", validate(jurySchema), uploadJuryCover,updateMemberById);

export default router;

