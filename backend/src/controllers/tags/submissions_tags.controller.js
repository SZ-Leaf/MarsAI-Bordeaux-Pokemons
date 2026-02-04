import submissions_tags_model from "../../models/tags/submissions_tags_model.js";
import { sendSuccess, sendError } from "../../helpers/response.helper.js";
import db from "../../config/db_pool.js";

export const addTags = async (req,res) => {
    let connection;

    try {

        const submissionId = Number(req.params.id);

        if(!Number.isInteger(submissionId)|| submissionId <= 0) {
            return sendError(res, 400, "ID de soumission invalide", "Invalid submission ID", null);
        }
        
        const { tagIds } = req.body

        if (!Array.isArray(tagIds) || tagIds.length === 0) {
            return sendError(res, 400, "TagIds ne peut pas être vide", "TagsIds can't be empty", null);
        }

        connection = await db.pool.getConnection();

        const affectedRows = await submissions_tags_model.addTagsToSubmission(
        connection,
        submissionId,
        tagIds
        );

        if (affectedRows === 0) {
            return sendError(res, 409, "Tags déjà liés à cette soumission", "Tags already linked to this submission", null );
        }


        return sendSuccess(res, 201,"Tags ajoutés", "Tags added", {submissionId, affectedRows});

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors de l'ajout des tags à la soumission", "Error while adding tags to the submission",null);

    }finally {
        if (connection) connection.release();
    }
}


export const listTagsForSubmission = async (req,res) => {
    let connection;

    try {
        const submissionId = Number(req.params.id);

        if (!Number.isInteger(submissionId) || submissionId <= 0) {
            return sendError(res, 400, "ID de soumission invalide", "Invalid submission ID", null);
        }

        connection = await db.pool.getConnection();

        const tags = await submissions_tags_model.getTagsBySubmissionId(connection, submissionId);

        return sendSuccess(res, 200, "Tags récupérés", "Tags retrieved", tags);
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors de la récupération des tags de la soumission", "Error while retrieving tags from the submission", null);
    } finally {
        if (connection) connection.release();
    }
}