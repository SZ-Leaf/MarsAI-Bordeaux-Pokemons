import { getHomepageData, updateHomepageData } from '../../models/homepage/homepage.model.js';
import { sendSuccess, sendError } from '../../helpers/response.helper.js';

export const getHomepageController = async (req, res) => {
  try {
    const data = await getHomepageData();
    return sendSuccess(res, 200, 'Données récupérées', 'Data retrieved', data);
  } catch (error) {
    return sendError(res, 500, 'Erreur serveur', 'Server error', error.message);
  }
};

export const updateHomepageController = async (req, res) => {
  try {
    const { hero, features, films, stats, conferences, objectives } = req.body;

    if (!hero || !features || !films || !stats || !conferences || !objectives) {
      return sendError(res, 400, 'Données incomplètes', 'Incomplete data', null);
    }

    const updated = await updateHomepageData({ hero, features, films, stats, conferences, objectives });
    return sendSuccess(res, 200, 'Homepage mise à jour', 'Homepage updated', updated);
  } catch (error) {
    return sendError(res, 500, 'Erreur serveur', 'Server error', error.message);
  }
};
