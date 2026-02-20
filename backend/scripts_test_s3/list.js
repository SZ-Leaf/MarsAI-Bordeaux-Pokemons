/**
 * Liste le contenu du bucket Scaleway S3.
 * Usage: node scripts_test_s3/list.js [préfixe]
 *   Sans argument: liste tout le bucket (ou le dossier SCALEWAY_FOLDER si défini).
 *   Avec argument: liste les clés sous ce préfixe (ex: grp2/).
 */
import 'dotenv/config';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const bucket = process.env.SCALEWAY_BUCKET_NAME;
const folder = process.env.SCALEWAY_FOLDER || '';
const prefix = process.argv[2] ?? folder ? `${folder}/` : '';

const client = new S3Client({
  region: process.env.SCALEWAY_REGION || 'fr-par',
  endpoint: process.env.SCALEWAY_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
    secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function main() {
  console.log('Bucket:', bucket);
  console.log('Préfixe:', prefix || '(racine)');
  console.log('---');

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    ...(prefix ? { Prefix: prefix } : {}),
  });

  const response = await client.send(command);
  const contents = response.Contents || [];
  const count = contents.length;

  if (count === 0) {
    console.log('Aucun objet trouvé.');
    return;
  }

  console.log(`${count} objet(s):\n`);
  for (const obj of contents) {
    const size = obj.Size != null ? ` (${obj.Size} octets)` : '';
    console.log(`  ${obj.Key}${size}`);
  }
}

main().catch((err) => {
  console.error('Erreur:', err.message);
  process.exit(1);
});
