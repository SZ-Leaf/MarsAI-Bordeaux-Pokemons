import { success } from "zod";
import tags_model from "../../models/tags/tags_model.js";

export const listTags = async(req,res) => {
    try {
        const result = await tags_model.getAllTags();
        res.status(200).json({
            success:true,
            data: result
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message: {
                fr:"Erreur lors de la récupération des tags",
                en:"Error when trying to retrieve tags"
            }
        })
    }
};

export const findTagById = async(req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: {
                    fr:'ID invalide',
                    en:'Invalid ID'
                }
            });
        }
        const result = await tags_model.getTagById(id);

        if(!result) {
            return res.status(404).json({
                success: false,
                message: {
                    fr:"Tag introuvable !", 
                    en:"Tag not found!"
                }
            })
        }
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message: {
                fr:"Erreur lors de la récupération du tag",
                en:"Error while retrieving tag"
            }
        })
    }
};

export const createTag = async (req,res) => {
    try {
        const { title } = req.body;

        const id = await tags_model.createTag({title});
        
        return res.status(201).json({
            success:true,
            data: {id, title}
        })
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false, 
                message: {
                    fr: "Tag déjà existant",
                    en:" Already existing tag"
                } 
            });
        }
        console.error(error);
            return res.status(500).json({ 
                success: false, 
                message: {
                    fr: "Erreur lors de la création du tag", 
                    en:"Error while creating tag"
                } 
            });
        
    }
};

export const getPopularTags = async (req,res) => {
    try {
        const limit = Number.isInteger(Number(req.query.limit)) && Number(req.query.limit) > 0
        ? Number(req.query.limit)
        : 5;

        const result = await tags_model.getPopularTags();

        const limitedTags = result.slice(0, limit);

        return res.status(200).json({
            success: true,
            data: limitedTags
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: {
                fr: "Erreur lors de la récupération des tags populaires",
                en: "Error while retrieving popular tags",
            },
        });
    }
};