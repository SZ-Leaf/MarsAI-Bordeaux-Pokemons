import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { findSubmissionById } from '../../models/submissions/submissions.model.js';
import {
  createSelectorMemo as createSelectorMemoModel,
  getPlaylist as getPlaylistModel,
  getSelectionForSubmission as getSelectionForSubmissionModel,
  addSubmissionToPlaylist as addSubmissionToPlaylistModel,
  removeSubmissionFromPlaylist as removeSubmissionFromPlaylistModel
} from '../../models/selector/selector_memo.model.js';

export const createSelectorMemo = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissionId = Number(req.params.id);
    if (!Number.isInteger(submissionId) || submissionId <= 0) {
      return sendError(
        res,
        400,
        "ID soumission invalide",
        "Invalid submission id",
        null
      );
    }

    // Vérifier que la soumission existe
    const submission = await findSubmissionById(submissionId);
    if (!submission) {
      return sendError(res, 404, "Soumission introuvable", "Submission not found", null);
    }

    const { rating, comment } = req.body;

    // Appel au modèle
    await createSelectorMemoModel({
      userId,
      submissionId,
      rating,
      comment,
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

export const getPlaylist = async (req, res) => {

  try {
    const userId = req.user.id;
    const list = getList(req);

    if (!list) return sendError(res, 400, "Playlist invalide", "Invalid playlist", null);

    const rows = await getPlaylistModel(userId, list);
    return sendSuccess(res, 200, "Playlist", "Playlist", rows)
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Erreur lors de la récupération de playlist", "Error while retrieving playlist", null);
  }
};

export const setPlaylistStatus = async (req, res) => {

  try {
    const userId = req.user.id;
    const submissionId = Number(req.params.submissionId);

    if (!Number.isInteger(submissionId) || submissionId <= 0)
      return sendError(res, 400, "Soumission invalide", "Invalid submission", null);

    const { selection_list } = req.body; // "FAVORITES" | "WATCH_LATER" | "REPORT"
    if (!["FAVORITES", "WATCH_LATER", "REPORT"].includes(selection_list)) {
      return sendError(res, 400, "selection_list invalide", "Invalid selection_list", null);
    }

    await addSubmissionToPlaylistModel(userId, submissionId, selection_list);
    return sendSuccess(res, 200, "Statut mis à jour", "Status updated", { selection_list });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Erreur mise à jour", "Update error", null);
  }
};

export const clearPlaylistStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissionId = Number(req.params.submissionId);

    if (!Number.isInteger(submissionId) || submissionId <= 0)
      return sendError(res, 400, "Soumission invalide", "Invalid submission", null);

    await removeSubmissionFromPlaylistModel(userId, submissionId); // ton model fait clear maintenant
    return sendSuccess(res, 200, "Statut supprimé", "Status cleared", { selection_list: null });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Erreur suppression", "Clear error", null);
  }
};


export const getPlaylistStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissionId = Number(req.params.submissionId);
    if (!Number.isInteger(submissionId) || submissionId <= 0)
      return sendError(res, 400, "Soumission invalide", "Invalid submission", null);

    const selection_list = await getSelectionForSubmissionModel(userId, submissionId);

    return sendSuccess(res, 200, "Statut", "Status", { selection_list });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Erreur statut", "Status error", null);
  }
};


