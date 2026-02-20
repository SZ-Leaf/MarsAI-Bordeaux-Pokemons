/**
 * Envoie un fichier vers le bucket Scaleway S3.
 * Usage: node scripts_test_s3/upload.js <fichier_local> [clé_s3]
 *   fichier_local: nom du fichier (cherché dans scripts_test_s3/) ou chemin complet
 *   clé_s3: nom de l'objet dans le bucket (défaut: SCALEWAY_FOLDER/nom_du_fichier)
 * Exemple: node scripts_test_s3/upload.js mon-fichier.jpg
 */
import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bucket = process.env.SCALEWAY_BUCKET_NAME;
const folder = process.env.SCALEWAY_FOLDER || '';

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
  const filePath = process.argv[2];
  let key = process.argv[3];

  if (!filePath) {
    console.error('Usage: node scripts_test_s3/upload.js <fichier_local> [clé_s3]');
    process.exit(1);
  }

  // Si c'est juste un nom de fichier (sans dossier), chercher dans scripts_test_s3
  const absolutePath = path.isAbsolute(filePath) || filePath.includes(path.sep)
    ? path.resolve(filePath)
    : path.join(__dirname, filePath);

  if (!existsSync(absolutePath)) {
    console.error('Fichier introuvable:', absolutePath);
    console.error('Place le fichier dans backend/scripts_test_s3/ ou indique un chemin valide.');
    process.exit(1);
  }

  const body = readFileSync(absolutePath);
  const fileName = path.basename(absolutePath);

  if (!key) {
    key = folder ? `${folder}/${fileName}` : fileName;
  }

  console.log('Fichier local:', absolutePath);
  console.log('Taille:', body.length, 'octets');
  console.log('Clé S3:', key);
  console.log('Bucket:', bucket);
  console.log('Envoi en cours...');

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: undefined, // S3 peut le déduire ou tu peux mettre 'image/jpeg' etc.
      ACL: 'public-read', // lecture publique (conforme à la doc Scaleway)
    })
  );

  console.log('OK. Fichier envoyé.');
}

main().catch((err) => {
  console.error('Erreur:', err.message);
  process.exit(1);
});
