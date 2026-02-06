import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import {
  createSponsor,
  updateSponsorCover,
  deleteSponsor,
  getSponsors
} from '../../models/sponsors/sponsors.model.js';
import { sendError, sendSuccess } from '../../helpers/response.helper.js';
import { sponsorSchema } from '../../utils/schemas/sponsor.schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadsBasePath = () => path.join(__dirname, '../../../uploads');

export const createSponsorController = async (req, res) => {
  const coverFile = req.files?.cover?.[0] || req.file || null;

  if (!coverFile) {
    return sendError(res, 400, 'Image manquante', 'Cover missing', null);
  }

  let validatedData;
  try {
    validatedData = sponsorSchema.parse({
      name: req.body.name,
      url: req.body.url
    });
  } catch (err) {
    await fs.unlink(coverFile.path).catch(() => {});
    return sendError(res, 422, 'Données invalides', 'Invalid data', err.message);
  }

  try {
    const sponsorId = await createSponsor({
      ...validatedData,
      cover: `/uploads/sponsors/tmp/${coverFile.filename}`
    });

    const sponsorDir = path.join(
      getUploadsBasePath(),
      'sponsors',
      sponsorId.toString()
    );

    await fs.mkdir(sponsorDir, { recursive: true });

    const ext = path.extname(coverFile.originalname).toLowerCase();
    const finalPath = path.join(sponsorDir, `cover${ext}`);

    await fs.rename(coverFile.path, finalPath);

    const finalUrl = `/uploads/sponsors/${sponsorId}/cover${ext}`;
    await updateSponsorCover(sponsorId, finalUrl);

    return sendSuccess(
      res,
      201,
      'Sponsor créé',
      'Sponsor created',
      { sponsorId, cover: finalUrl }
    );
  } catch (error) {
    await fs.unlink(coverFile.path).catch(() => {});
    return sendError(
      res,
      500,
      'Erreur création sponsor',
      'Sponsor creation error',
      error.message
    );
  }
};

export const deleteSponsorController = async (req, res) => {
  try {
    const sponsorId = Number(req.params.id);
    if (!Number.isInteger(sponsorId) || sponsorId <= 0) {
      return sendError(res, 400, 'ID invalide', 'Invalid ID', null);
    }

    await deleteSponsor(sponsorId);

    const sponsorDir = path.join(
      getUploadsBasePath(),
      'sponsors',
      sponsorId.toString()
    );

    await fs.rm(sponsorDir, { recursive: true, force: true });

    return sendSuccess(res, 200, 'Sponsor supprimé', 'Sponsor deleted', null);
  } catch (error) {
    return sendError(
      res,
      500,
      'Erreur suppression sponsor',
      'Sponsor deletion error',
      error.message
    );
  }
};

export const getSponsorsController = async (req, res) => {
  try {
    const sponsors = await getSponsors();
    return sendSuccess(
      res,
      200,
      'Sponsors récupérés',
      'Sponsors retrieved',
      { count: sponsors.length, sponsors }
    );
  } catch (error) {
    return sendError(
      res,
      500,
      'Erreur récupération sponsors',
      'Sponsors retrieval error',
      error.message
    );
  }
};
