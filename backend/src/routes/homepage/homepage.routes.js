import { Router } from 'express';
import { getHomepageController, updateHomepageController } from '../../controllers/homepage/homepage.controller.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import { createPublicRateLimit } from '../../middlewares/public_rate_limit.middleware.js';

const router = Router();

router.get('/', createPublicRateLimit(120, 'minute'), getHomepageController);
router.put('/', authenticate, requireRole([2, 3]), updateHomepageController);

export default router;
