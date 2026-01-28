import { Router } from 'express';
import submissionRoutes from './submission.routes.js';

const router = Router();

// Routes de soumission
router.use('/submissions', submissionRoutes);

export default router;
