import { sendSuccess, sendError } from "../../helpers/response.helper.js";
import awardModel from "../../models/awards/awards.model.js";
import { getSubmissionById } from "../../models/submissions/submissions.model.js";
import fs from "fs";
import path from "path";

//liste de tous les awards
export const awardsList = async (req, res) => {
  try {
    const awards = await awardModel.getAllAwards();

    return sendSuccess(
      res, 200, "Liste des awards récupérée avec succès", "Awards list retrieved successfully", awards || []);
  } catch (error) {
    console.error("Erreur awardsList:", error);
    return sendError(res, 500, "Impossible de récupérer la liste des awards", "Unable to retrieve awards list", null);
  }
};
//liste des awards non-assignés (sans soumission associée)
export const awardsUnassigned = async (req, res) => {
  try {
    const awards = await awardModel.getUnassignedAwards();

    return sendSuccess(
      res, 200, "Liste des awards non assignés récupérée avec succès", "Unassigned awards list retrieved successfully", awards || []);
  } catch (error) {
    console.error("Erreur awardsUnassigned:", error);
    return sendError(res, 500, "Impossible de récupérer les awards non assignés", "Unable to retrieve unassigned awards", null);
  }
};
//awards associés à une soumission
export const awardsBySubmission = async (req, res) => {
  try {
    const submissionId = Number(req.params.submissionId);

    if (!Number.isInteger(submissionId) || submissionId <= 0) {
      return sendError(res, 400, "Id de soumission invalide", "Invalid submission id", null);
    }

    const awards = await awardModel.getAwardsBySubmissionId(submissionId);

    return sendSuccess(
      res, 200, `Awards de la soumission ${submissionId} récupérés avec succès`, `Awards for submission ${submissionId} retrieved successfully`, awards || []);
  } catch (error) {
    console.error("Erreur awardsBySubmission:", error);
    return sendError(res, 500, "Impossible de récupérer les awards de cette soumission", "Unable to retrieve awards for this submission", null);
  }
};
//vue (show) d'un award
export const awardShow = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return sendError(res, 400, "Id invalide", "Invalid id", null);
    }

    const award = await awardModel.getAwardById(id);

    if (!award) {
      return sendError(res, 404, "Award introuvable", "Award not found", null);
    }

    return sendSuccess(res, 200, `Award numéro ${id} récupéré avec succès`, `Award number ${id} retrieved successfully`, award);
  } catch (error) {
    console.error("Erreur awardShow:", error);
    return sendError(res, 500, "Impossible de récupérer cet award", "Unable to retrieve this award", null);
  }
};
//création d'un award
export const awardCreate = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const file = req.file ?? req.files?.cover?.[0];
  const uploadedPath = file?.path;

  try {
    const { title, award_rank, description } = req.body;

    const cover = file ? `uploads/awards/tmp/${file.filename}` : null;
    const submission_id = null;

    const created = await awardModel.createAward({
      title,
      award_rank,
      submission_id,
      cover,
      description: description ?? null,
    });

    // récupérer l'award complet (celui qui servira à l'affichage)
    const fullAward = await awardModel.getAwardById(created.id);

    return sendSuccess(res, 201, "Nouvel award créé avec succès", "New award created successfully", fullAward);
  } catch (error) {
    console.error("Erreur awardCreate:", error);

    if (uploadedPath) {
      fs.unlink(uploadedPath, (err) => {
        if (err && err.code !== "ENOENT") console.error("Rollback cover error:", err);
      });
    }

    return sendError(res, 500, "Impossible de créer un nouvel award", "Unable to create a new award", null);
  }
};
//update d'un award
export const awardUpdate = async (req, res) => {
  const file = req.file ?? req.files?.cover?.[0];
  const uploadedPath = file?.path;

  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      if (uploadedPath) fs.unlink(uploadedPath, () => {});
      return sendError(res, 400, "Id invalide", "Invalid id", null);
    }

    const award = await awardModel.getAwardById(id);

    if (!award) {
      if (uploadedPath) fs.unlink(uploadedPath, () => {});
      return sendError(res, 404, "Award introuvable", "Award not found", null);
    }

    const { title, award_rank, submission_id, description, cover } = req.body;

    // PUT : si pas de nouveau fichier, on prend cover du body si présent, sinon on conserve l’existant
    const newCover = file
      ? `uploads/awards/tmp/${file.filename}`
      : (cover ?? award.cover);

    await awardModel.updateAward(id, {
      title,
      award_rank,
      submission_id: submission_id ?? null,
      cover: newCover,
      description: description ?? null,
    });

    // si la cover est remplacée, on supprime l'ancienne
    if (file && award.cover && award.cover !== newCover) {
      const oldPath = path.join(process.cwd(), award.cover);
      fs.unlink(oldPath, (err) => {
        if (err && err.code !== "ENOENT") console.error("Erreur suppression ancienne cover:", err);
      });
    }

    const updatedAward = await awardModel.getAwardById(id);

    return sendSuccess(res, 200, "Award mis à jour", "Award updated", updatedAward);
  } catch (error) {
    console.error("Erreur awardUpdate:", error);

    // rollback upload si erreur
    if (uploadedPath) {
      fs.unlink(uploadedPath, (err) => {
        if (err && err.code !== "ENOENT") console.error("Rollback cover error:", err);
      });
    }

    return sendError(res, 500, "Impossible de mettre à jour l'award", "Unable to update award", null);
  }
};
//suppression d'un award
export const awardDelete = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return sendError(res, 400, "Id invalide", "Invalid id", null);
    }

    const award = await awardModel.getAwardById(id);

    if (!award) {
      return sendError(res, 404, "Award introuvable", "Award not found", null);
    }

    await awardModel.deleteAward(id);

    // suppression cover associée
    if (award.cover) {
      const absPath = path.join(process.cwd(), award.cover);
      fs.unlink(absPath, (err) => {
        if (err && err.code !== "ENOENT") console.error("Erreur suppression cover:", err);
      });
    }

    return sendSuccess(
      res, 200, "Suppression de l'award effectuée", "Award deleted successfully", null);
  } catch (error) {
    console.error("Erreur awardDelete:", error);
    return sendError(res, 500, "Impossible de supprimer cet award", "Unable to delete this award", null);
  }
};
//association d'un award à une soumission
export const awardSetSubmission = async (req, res) => {
  try {
    const awardId = Number(req.params.id);
    const { submission_id } = req.body;

    if (!Number.isInteger(awardId) || awardId <= 0) {
      return sendError(res, 400, "Id invalide", "Invalid id", null);
    }

    const award = await awardModel.getAwardById(awardId);
    if (!award) {
      return sendError(res, 404, "Award introuvable", "Award not found", null);
    }

    // désassignation autorisée
    if (submission_id === null) {
      await awardModel.setAwardSubmission(awardId, null);
      const updated = await awardModel.getAwardById(awardId);
      return sendSuccess(res, 200, "Soumission retirée", "Submission removed", updated);
    }

    //vérification d'existence de la soumission
    const submission = await getSubmissionById(Number(submission_id));
    if (!submission) {
      return sendError(
        res,
        404,
        "Soumission introuvable",
        "Submission not found",
        null
      );
    }

    await awardModel.setAwardSubmission(awardId, submission_id);
    const updated = await awardModel.getAwardById(awardId);

    return sendSuccess(
      res,
      200,
      "Soumission associée à l'award",
      "Submission linked to award",
      updated
    );
  } catch (error) {
    console.error("Erreur awardSetSubmission:", error);
    return sendError(
      res,
      500,
      "Impossible d'associer la soumission à l'award",
      "Unable to link submission to award",
      null
    );
  }
};