import { sendSuccess, sendError } from "../../helpers/response.helper.js";
import juryModel from "../../models/jury/jury.model.js";
import fs from "fs";
import path from "path";
//liste du jury
export const juryList = async(req, res) => {
    try {
        const jurys = await juryModel.getAllJuryMembers();
        return sendSuccess(res, 200, "Liste des membres du jury récupérée avec succès","List of jury members retrieved with success", jurys || [] );
    } catch (error) {
        console.error("Erreur juryList:", error);
        return sendError(res, 500, "Impossible de récupérer la liste du jury", null );
    }
}
//récupèration d'un membre du jury
export const findJuryById = async (req,res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return sendError(res, 400, "Id invalide", "Invalid id", null);
        }
        const jury = await juryModel.getJuryMemberById(id);

        if (!jury) {
            return sendError(res, 404, "Membre du jury introuvable", "Jury member not found", null);
        }

        return sendSuccess(res, 200, `Membre du jury numéro ${id} récupéré avec succés`, `Jury member number ${id} successfully retrieved`, jury )
    } catch (error) {
        console.error("Erreur findByJuryId:", error);
        return sendError(res, 500, "Impossible de récupérer ce membre du jury","Unable to retrieve this member of jury", null);
    }
}
//création d'un membre du jury
export const createNewJuryMember =  async (req, res) => {

    const file = req.file ?? req.files?.cover?.[0];
    const uploadedPath = file?.path;

    try {
        
        const { firstname, lastname, job} = req.body

        const cover = req.file ? `uploads/jury/tmp/${req.file.filename}` : null;

        const id = await juryModel.createJuryMember({cover, firstname, lastname, job});

        return sendSuccess(res, 201, "Nouveau membre du jury crée avec succés", "New jury member created successfully !",{id})
        
    } catch (error) {
        console.error(error);
        //si la création échoue on supprime la cover.
        if (uploadedPath) {
            fs.unlink(uploadedPath, (err) => {
                if (err && err.code !== "ENOENT") console.error("Rollback cover error:", err);
            });
        }

        return sendError(res, 500, "Impossible de créer un nouveau membre du jury", "Impossible to create a new jury member", null);
        
    }
}
//mise à jour d'un membre du jury
export const updateMemberById = async (req, res) => {

    const file = req.file ?? req.files?.cover?.[0];
    const uploadedPath = file?.path;

    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            if (uploadedPath) fs.unlink(uploadedPath, () => {});
            return sendError(res, 400, "Id invalide", "Invalid id", null);
        }

        const jury = await juryModel.getJuryMemberById(id);
        if (!jury) {
            if (uploadedPath) fs.unlink(uploadedPath, () => {});
            return sendError(res, 404, "Membre du jury introuvable", "Jury member not found", null);
        }

        const { firstname, lastname, job} = req.body;
        const newCover = file ? `uploads/jury/tmp/${file.filename}` : jury.cover;

        await juryModel.updateJuryMember(id, {cover: newCover, firstname, lastname, job});
        //si la cover est remplacée, on supprime l'ancienne du stockage et db
        if (file && jury.cover && jury.cover !== newCover) {
            const oldPath = path.join(process.cwd(), jury.cover);
            fs.unlink(oldPath, (err) => {
                if (err && err.code !== "ENOENT") {
                console.error("Erreur suppression ancienne cover:", err);
                }
            });
        }
        const updatedMember = await juryModel.getJuryMemberById(id);

        return sendSuccess(res, 200, "Informations mises à jour", "Informations updated", updatedMember);
    } catch (error) {
        console.error(error);
        //si l'upload échoue alors on supprime la cover 
        if (uploadedPath) {
            fs.unlink(uploadedPath, (err) => {
                if (err && err.code !== "ENOENT") console.error("Rollback cover error:", err);
            });
        };

        return sendError(res, 500, "Impossible de mettre à jour les informations", "Unable to update informations", null)
    }
}
//suppression d'un membre du jury
export const deleteMemberById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return sendError(res, 400, "Id invalide", "Invalid id", null);
        }

        const jury = await juryModel.getJuryMemberById(id);

        if (!jury) {
            return sendError(res, 404, "Membre du jury introuvable", "Jury member not found", null);
        }

        await juryModel.deleteJuryMember(id);
        //suppression de la cover associée à un membre du jury
        if (jury.cover) {
            const absPath = path.join(process.cwd(), jury.cover);
            fs.unlink(absPath, (err) => {
                if (err && err.code !== "ENOENT") {
                console.error("Erreur suppression cover:", err);
                }
            });
        }

        return sendSuccess(res, 200, "Suppression du membre du jury effectuée", "Jury member deleted successfully",null);

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Impossible de supprimer ce membre du jury", "Impossible to delete this jury member",null)
    }
}