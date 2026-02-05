import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createSponsor, updateSponsorCover } from '../../models/sponsors/sponsors.model.js';
import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { sponsorSchema } from '../../utils/schemas/sponsor.schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadsBasePath = () => path.join(__dirname, '../../../uploads');

export const createSponsorController = async (req, res) => {
  const coverFile = req.files?.cover?.[0];
  if (!coverFile) {
    return sendError(res, 400, 'Image de couverture manquante', 'Cover image is missing', null);
  }

  if (!coverFile.mimetype.startsWith('image/')) {
    return sendError(res, 400, 'Format image invalide', 'Invalid image format', null);
  }

  const maxCoverSize = 5 * 1024 * 1024; // 5MB
  if (coverFile.size > maxCoverSize) {
    return sendError(res, 400, 'Image de couverture trop volumineuse', 'Cover image too large', null);
  }

  if (!req.body.data) {
    if (coverFile.path) await fs.unlink(coverFile.path).catch(() => {});
    return sendError(res, 400, 'Information manquante', 'Missing information', null);
  }

  let sponsorData;
  try {
    sponsorData = JSON.parse(req.body.data);
  } catch {
    if (coverFile.path) await fs.unlink(coverFile.path).catch(() => {});
    return sendError(res, 400, 'Données entrées invalides', 'Invalid data entered', null);
  }

  let validatedData;
  try {
    validatedData = sponsorSchema.parse(sponsorData);
  } catch (err) {
    if (coverFile.path) await fs.unlink(coverFile.path).catch(() => {});

    return sendError(res, 422, 'Données invalides', 'Invalid data', err.message);
  }

  const { name, url } = validatedData;

  try {
    const tempCoverUrl = `/uploads/tmp/${coverFile.originalname}`;
    const sponsorId = await createSponsor({ name, url, cover: tempCoverUrl });

    const sponsorDir = path.join(getUploadsBasePath(), 'sponsors', sponsorId.toString());
    await fs.mkdir(sponsorDir, { recursive: true });

    const coverExt = path.extname(coverFile.originalname).toLowerCase();
    const finalCoverPath = path.join(sponsorDir, `cover${coverExt}`);

    if (coverFile.path) {
      await fs.rename(coverFile.path, finalCoverPath);
    } else if (coverFile.buffer) {
      await fs.writeFile(finalCoverPath, coverFile.buffer);
    }

    const finalCoverUrl = `/uploads/sponsors/${sponsorId}/cover${coverExt}`;
    await updateSponsorCover(sponsorId, finalCoverUrl);

    return sendSuccess(res, 201, 'Sponsor créé avec succès', 'Sponsor created successfully', {
      sponsorId,
      cover: finalCoverUrl
    });

  } catch (error) {
    if (coverFile.path) await fs.unlink(coverFile.path).catch(() => {});

    console.error('Erreur création sponsor:', error);
    return sendError(res, 500, 'Erreur lors de la création du sponsor', 'Error while creating sponsor', error.message);
  }
};

export const deleteSponsorController = async (req, res) => {
  try {
    const sponsorId = parseInt(req.params.id);
    if (isNaN(sponsorId) || sponsorId <= 0) {
      return sendError(res, 400, 'ID invalide', 'Invalid sponsor ID', null);
    }

    await deleteSponsor(sponsorId);

    const sponsorDir = path.join(getUploadsBasePath(), 'sponsors', sponsorId.toString());
    try {
      await fs.rm(sponsorDir, { recursive: true, force: true });
    } catch (err) {
      console.warn(`Impossible de supprimer le dossier du sponsor ${sponsorId}:`, err.message);
    }

    return sendSuccess(res, 200, 'Sponsor supprimé avec succès', 'Sponsor deleted successfully', null);
  } catch (error) {
    console.error('Erreur suppression sponsor:', error);
    return sendError(res, 500, 'Erreur lors de la suppression du sponsor', 'Error deleting sponsor', error.message);
  }
};

export const getSponsorsController = async (req, res) => {
  try {
    const sponsors = await getSponsors();
    return sendSuccess(res, 200, 'Sponsors récupérés avec succès', 'Sponsors retrieved successfully', { count: sponsors.length, sponsors });
  } catch (error) {
    console.error('Erreur récupération sponsors:', error);
    return sendError(res, 500, 'Erreur lors de la récupération des sponsors', 'Error retrieving sponsors', error.message);
  }
};
