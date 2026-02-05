import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { rateSubmissionSchema } from '../../utils/schemas/selector.schemas.js';
import { findSubmissionById } from '../../models/submissions/submissions.model.js';
import { 
  rateSubmission as rateSubmissionModel,
  getPlaylist as getPlaylistModel,
  addSubmissionToPlaylist as addSubmissionToPlaylistModel,
  removeSubmissionFromPlaylist as removeSubmissionFromPlaylistModel
} from '../../models/selector/selector_memo.model.js';

export const rateSubmission = async (req, res) => {
  try {
    const userId = req.user.id;
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

    await rateSubmissionModel({
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
};

export const getPlaylist = async(req,res) => {

    try {
        const userId = req.user.id;
        const list = getList(req);

        if(!list) return sendError(res, 400, "Playlist invalide", "Invalid playlist", null);

        const rows = await getPlaylistModel(userId, list);
        return sendSuccess(res, 200, "Playlist", "Playlist", rows)
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors de la récupération de playlist", "Error while retrieving playlist",null);
    }
};

export const addSubmissionToPlaylist = async(req,res) => {

    try {
        const userId = req.user.id;
        const list = getList(req);

        if(!list) return sendError(res, 400, "Playlist invalide", "Invalid playlist", null);

        const submissionId = Number(req.params.submissionId);
            if (!Number.isInteger(submissionId) || submissionId <= 0)
            return sendError(res, 400, "Soumission invalide", "Invalid submission", null);
        
        const affected = await addSubmissionToPlaylistModel(userId, submissionId, list);
        return sendSuccess(res, 200, "Ajouté à la playlist", "Added to the playlist",{ affected })

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors de l'ajout d'une soumission à une playlist ", "Error while adding a submission to a playlist", null);
    }
};

export const removeSubmissionFromPlaylist = async(req,res) => {

    try {
        const userId = req.user.id;
        const list = getList(req);

        if(!list) return sendError(res, 400, "Playlist invalide", "Invalid playlist", null);

        const submissionId = Number(req.params.submissionId);
            if (!Number.isInteger(submissionId) || submissionId <= 0)
            return sendError(res, 400, "Soumission invalide", "Invalid submission", null);
        
        const affected = await removeSubmissionFromPlaylistModel(userId, submissionId, list);
        return sendSuccess(res, 200, "Retiré de la playlist", "Removed from the playlist",{ affected })

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors du retrait d'une soumission à une playlist ", "Error while removing a submission from a playlist", null);
    }
};