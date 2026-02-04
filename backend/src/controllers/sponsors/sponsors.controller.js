import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { createSponsor, updateSponsorCover } from '../../models/sponsors/sponsors.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadsBasePath = () => path.join(__dirname, '../../../uploads');

export const createSponsorController = async (req, res) => {
  const coverFile = req.files?.cover?.[0];
  const { name, url } = req.body;

  if (!name || !coverFile) {
    return res.status(400).json({
      error: 'Nom du sponsor ou image de couverture manquante'
    });
  }

  try {
    const sponsorId = await createSponsor({ name, url, cover: null });

    const sponsorDir = path.join(getUploadsBasePath(), 'sponsors', sponsorId.toString());
    await fs.mkdir(sponsorDir, { recursive: true });

    const coverExt = path.extname(coverFile.originalname).toLowerCase();
    const finalCoverPath = path.join(sponsorDir, `cover${coverExt}`);
    await fs.rename(coverFile.path, finalCoverPath);

    const coverUrl = `/uploads/sponsors/${sponsorId}/cover${coverExt}`;

    await updateSponsorCover(sponsorId, coverUrl);

    res.status(201).json({
      success: true,
      sponsorId,
      cover: coverUrl,
    });
  } catch (error) {
    console.log(error);
  }
};
