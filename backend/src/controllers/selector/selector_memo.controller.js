import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { rateSubmissionSchema } from '../../utils/schemas/selector.schemas.js';
import { upsertSelectorMemo } from '../../models/selector/selector_memo.model.js';
import { findSubmissionById } from '../../models/submissions/submissions.model.js';

export const rateSubmission = async (req, res) => {
  try {
    const userId = 1; // TODO: changer pour req.user.id quand on aura implémenter le système d'auth de Sary
    const submissionId = Number(req.params.id);

    if (!submissionId || Number.isNaN(submissionId)) {
      return sendError(res, 400, "ID soumission invalide", "Invalid submission id", null);
    }

    const submission = await findSubmissionById(submissionId);
    if (!submission) {
      return sendError(res, 404, "Soumission introuvable", "Submission not found", null);
    }

    // Validation Zod (note + commentaire)
    const parsed = rateSubmissionSchema.parse({
      rating: Number(req.body.rating),
      comment: req.body.comment,
    });

    await upsertSelectorMemo({
      userId,
      submissionId,
      rating: parsed.rating,
      comment: parsed.comment,
    });

    return sendSuccess(res, 200, "Note enregistrée", "Rating saved", null);
  } catch (err) {
    const message = err.errors?.[0]?.message || err.message;
    return sendError(res, 400, "Erreur de notation", "Rating error", message);
  }
};