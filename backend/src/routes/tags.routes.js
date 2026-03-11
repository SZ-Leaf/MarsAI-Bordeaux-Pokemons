import { Router } from "express";
import { listTags, findTagById, createTag, getPopularTags } from "../controllers/tags/tags.controller.js";
import { validate } from "../middlewares/validation.js";
import { tagSchema } from "@marsai/schemas";
import { createPublicRateLimit } from '../middlewares/public_rate_limit.middleware.js';

const router = Router();

router.get('/', createPublicRateLimit(200, 'minute'), listTags);
router.get('/popular', createPublicRateLimit(200, 'minute'), getPopularTags);
router.post('/', createPublicRateLimit(15, 'minute'), validate(tagSchema), createTag);

export default router;
