import { Router } from 'express';
import { submitController, getSubmissionsController, getSubmissionByIdController } from '../../controllers/submissions/submissions_controller.js';
import { uploadSubmissionFiles, handleUploadError } from '../../middlewares/upload.js';
// import { requireRole } from '../middlewares/auth.js'; // À décommenter quand Feature 1 (Auth) sera implémentée
// import { verifyToken } from '../middlewares/auth.js'; // À décommenter quand Feature 1 (Auth) sera implémentée

const router = Router();

/**
 * POST /api/submissions
 * Route publique pour créer une soumission
 * Pas d'authentification requise
 */
router.post(
  '/submit',
  uploadSubmissionFiles,
  handleUploadError,
  submitController
);

/**
 * GET /api/submissions
 * Route protégée pour récupérer toutes les soumissions (admin et user uniquement)
 * TODO: Décommenter verifyToken et requireRole quand Feature 1 (Auth) sera implémentée
 */
router.get(
  '/',
  // verifyToken, // À décommenter quand Feature 1 sera implémentée
  // requireRole(['admin', 'user']), // À décommenter quand Feature 1 sera implémentée
  getSubmissionsController
);

/**
 * GET /api/submissions/:id
 * Route protégée pour récupérer une soumission par son ID (admin et user uniquement)
 * TODO: Décommenter verifyToken et requireRole quand Feature 1 (Auth) sera implémentée
 */
router.get(
  '/:id',
  // verifyToken, // À décommenter quand Feature 1 sera implémentée
  // requireRole(['admin', 'user']), // À décommenter quand Feature 1 sera implémentée
  getSubmissionByIdController
);

export default router;
