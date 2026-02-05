import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { rateSubmissionSchema } from '../../utils/schemas/selector.schemas.js';
import { upsertSelectorMemo } from '../../models/selector/selector_memo.model.js';
import { findSubmissionById } from '../../models/submissions/submissions.model.js';
import { getPlaylist as getPlaylistModel, addSubmissionToPlaylist as addToPlaylistModel, removeSubmissionFromPlaylist as removeFromPlaylistModel } from '../../models/selector/selector_memo.model.js';

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

const MAP = {
  favorites: "FAVORITES",
  watch_later: "WATCH_LATER",
  report: "REPORT",
};

function getList(req) {
  const key = (req.params.list || "").toLowerCase();
  return MAP[key] || null;
}

export const getPlaylist = async(req,res) => {

    try {
        // à remettre une fois l'auth branché: const userId = req.user.id;
        const list = getList(req);

        if(!list) return sendError(res, 400, "Playlist invalide", "Invalid playlist", null);

        const rows = await getPlaylistModel(userId, list);
        return sendSuccess(res, 200, "Playlist", "Playlist", rows)
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors de la récupération de playlist", "Error while retrieving playlist",null);
    }
}

export const addSubmissionToPlaylist = async(req,res) => {

    try {
        // à remettre une fois l'auth branché:const userId = req.user.id;
        const userId = Number(req.headers["x-user-id"]);
        if (!Number.isInteger(userId) || userId <= 0) {
        return sendError(res, 401, "Non authentifié", "Not authenticated", null);
        }//à supprimer une fois l'auth branché

        const list = getList(req);

        if(!list) return sendError(res, 400, "Playlist invalide", "Invalid playlist", null);

        const submissionId = Number(req.params.submissionId);
            if (!Number.isInteger(submissionId) || submissionId <= 0)
            return sendError(res, 400, "Soumission invalide", "Invalid submission", null);
        
        const affected = await addToPlaylistModel(userId, submissionId, list);
        return sendSuccess(res, 200, "Ajouté à la playlist", "Added to the playlist",{ affected })

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors de l'ajout d'une soumission à une playlist ", "Error while adding a submission to a playlist", null);
    }
};

export const removeSubmissionFromPlaylist = async(req,res) => {

    try {
        // à remettre une fois l'auth branché:const userId = req.user.id;
        const userId = Number(req.headers["x-user-id"]);
        if (!Number.isInteger(userId) || userId <= 0) {
        return sendError(res, 401, "Non authentifié", "Not authenticated", null);
        }//à supprimer une fois l'auth branché
        const list = getList(req);

        if(!list) return sendError(res, 400, "Playlist invalide", "Invalid playlist", null);

        const submissionId = Number(req.params.submissionId);
            if (!Number.isInteger(submissionId) || submissionId <= 0)
            return sendError(res, 400, "Soumission invalide", "Invalid submission", null);
        
        const affected = await removeFromPlaylistModel(userId, submissionId, list);
        return sendSuccess(res, 200, "Retiré de la playlist", "Removed from the playlist",{ affected })

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors du retrait d'une soumission à une playlist ", "Error while removing a submission from a playlist", null);
    }
};