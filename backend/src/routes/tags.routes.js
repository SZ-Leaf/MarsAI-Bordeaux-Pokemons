import { Router } from "express";
import { listTags, findTagById, createTag, getPopularTags } from "../controllers/tags/tags_controller.js";
import { validate } from "../middlewares/validation.js";
import { tagSchema } from "../utils/schemas.js";
import { listTagsForSubmission } from "../controllers/tags/submissions_tags_controller.js";

const router = Router();

router.get('/', listTags);
router.get('/submission/:id', listTagsForSubmission);
router.get('/popular', getPopularTags);
router.get('/:id', findTagById);
router.post('/', validate(tagSchema), createTag);

export default router;