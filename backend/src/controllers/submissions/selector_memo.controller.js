import { sendError, sendSuccess } from "../../helpers/response.helper.js";
import selectorMemo from "../../models/submissions/selector_memo.model.js";

const MAP = {
  favorites: "FAVORITES",
  "watch-later": "WATCH_LATER",
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

        const rows = await selectorMemo.getPlaylist(userId, list);
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
        
        const affected = await selectorMemo.addSubmissionToPlaylist(userId, submissionId, list);
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
        
        const affected = await selectorMemo.removeSubmissionFromPlaylist(userId, submissionId, list);
        return sendSuccess(res, 200, "Retiré de la playlist", "Removed from the playlist",{ affected })

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors du retrait d'une soumission à une playlist ", "Error while removing a submission from a playlist", null);
    }
};