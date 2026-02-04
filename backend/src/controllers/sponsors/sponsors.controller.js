import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createSponsor, updateSponsorCover } from '../../models/sponsors/sponsors.model.js';
import { sendError, sendSuccess } from '../../helpers/response.helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadsBasePath = () => path.join(__dirname, '../../../uploads');

export const createSponsorController = async (req, res) => {
  const coverFile = req.files?.cover?.[0];
  const { name, url } = req.body;

  if (!name || !coverFile) {
    return sendError(res, 400, 'Nom du sponsor ou image de couverture manquante', 'Sponsor name or cover image is missing', null);
  }

  if (!coverFile.mimetype.startsWith('image/')) {
    return sendError(res, 400, 'Format image invalide', 'Invalid image format', null);
  }

  const maxCoverSize = 5 * 1024 * 1024;
  if (coverFile.size > maxCoverSize) {
    return sendError(res, 400, 'Image de couverture trop volumineuse', 'Cover image too large', null);
  }

  try {
    const tempCoverUrl = `/uploads/tmp/${path.basename(coverFile.path)}`;
    const sponsorId = await createSponsor({ name, url, cover: tempCoverUrl });

    const sponsorDir = path.join(getUploadsBasePath(), 'sponsors', sponsorId.toString());
    await fs.mkdir(sponsorDir, { recursive: true });

    const coverExt = path.extname(coverFile.originalname).toLowerCase();
    const finalCoverPath = path.join(sponsorDir, `cover${coverExt}`);
    await fs.rename(coverFile.path, finalCoverPath);

    const finalCoverUrl = `/uploads/sponsors/${sponsorId}/cover${coverExt}`;
    await updateSponsorCover(sponsorId, finalCoverUrl);

    return sendSuccess(res, 201, 'Sponsor créé avec succès', 'Sponsor created successfully', {
      sponsorId,
      cover: finalCoverUrl
    });
  } catch (error) {
    console.error('Erreur création sponsor:', error);
    return sendError(res, 500, 'Erreur lors de la création du sponsor', 'Error while creating sponsor', error.message);
  }
};
export const deleteSponsorController = async (req,res) => {

}
