import { success } from "zod";
import { sendSuccess, sendError } from "../../helpers/response.helper.js";
import tags_model from "../../models/tags/tags.model.js";

export const listTags = async(req,res) => {
    try {
        const search = (req.query.search || "").trim();

        const limit =
            Number.isInteger(Number(req.query.limit)) && Number(req.query.limit) > 0
                ? Number(req.query.limit)
                : 10;
        //si on fait une recherche, alors on récupère les résultats de la recherche sinon on récupère les résultats
        const result = search ? await tags_model.searchTags(search, limit) : await tags_model.getAllTags();

        return sendSuccess(res, 200, "Tags récupérés", "Tags retrieved", result.slice(0, limit));
    }catch(error){
        return sendError(res, 500, "Erreur lors de la récupération des tags", "Error when trying to retrieve tags",null);
    }
};

export const findTagById = async(req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return sendError(res, 400, "ID invalide", "Invalid Error", null);
        }

        const result = await tags_model.getTagById(id);

        if(!result) {
            return sendError(res, 404, "Tag introuvable", "Tag not found", null);
        }

        return sendSuccess(res, 200, "Tag récupéré", "Tag retrieved", result );
        
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors de la récupération du tag", "Error while retrieving tag", null);
    }
};

export const createTag = async (req,res) => {
    try {
        const title = (req.body.title || "").trim().replace(/^./, c => c.toUpperCase());

        const existing = await tags_model.getTagByTitle(title);

        if (existing) {
            return sendError(res, 409, "Tag déjà existant", "Already existing tag", existing);
        }


        const id = await tags_model.createTag({title});
        
        return sendSuccess(res, 201, "Tag crée avec succès", "Tag created successfully", {id, title});
    
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors de la création du tag", "Error while creating tag", null);        
    }
};

export const getPopularTags = async (req,res) => {
    try {
        const limit = Number.isInteger(Number(req.query.limit)) && Number(req.query.limit) > 0
        ? Number(req.query.limit)
        : 6;

        const result = await tags_model.getPopularTags();
        const limitedTags = result.slice(0, limit);

        return sendSuccess(res, 200, "Tags les plus populaires récupérés", "Most popular tags retrieved", limitedTags);

    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Erreur lors de la récupération des tags populaires", "Error while retrieving popular tags", null);
    }
};
