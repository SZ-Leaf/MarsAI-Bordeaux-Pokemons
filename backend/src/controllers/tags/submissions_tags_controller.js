import { en } from "zod/locales";
import submissions_tags_model from "../../models/tags/submissions_tags_model.js";

export const addTags = async (req,res) => {
    try {
        const submissionId = Number(req.params.id);

        if(!Number.isInteger(submissionId)|| submissionId <= 0) {
            return res.status(400).json({
                success: false,
                message: {
                    fr:"ID de soumission invalide",
                    en:"Invalid submission ID"
                }
            })
        }
        
        const { tagIds } = req.body

        if (!Array.isArray(tagIds) || tagIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: {
                    fr:"tagIds ne peut être vide",
                    en:"tagIds can't be empty"
                }
            });
    }

        const result = await submissions_tags_model.addTagsToSubmission(submissionId, tagIds);
        return res.status(201).json({
            success: true,
            data: {submissionId, result}
        })
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ 
                success:false, 
                message: {
                    fr: "Tag déjà lié à cette submission",
                    en: "Tag is already linked to that submission"
                } 
            });
        }


        console.error(error);
        return res.status(500).json({
            success: false,
            message: {
                fr: "Erreur lors de l'ajout des tags à la soumission",
                en: "Error while adding tags to the submission"
            }
        });
    }
}
export const listTagsForSubmission = async (req,res) => {
    try {
        const submissionId = Number(req.params.id);
        if(!Number.isInteger(submissionId)|| submissionId <= 0) {
            return res.status(400).json({
                success: false,
                message: {
                    fr: "ID de soumission invalide",
                    en: "Invalid submission ID"
                }
            })
        }


        const result = await submissions_tags_model.getTagsBySubmissionId(submissionId);
        res.status(200).json({
            success:true,
            data: result
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: {
                fr: "Erreur lors de la récupération des tags de la submission",
                en: "Error while retrieving tags from the submission"
            }
        });
    }
}