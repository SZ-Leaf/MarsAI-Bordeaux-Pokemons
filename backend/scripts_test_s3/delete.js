/**
 * Supprime un objet du bucket Scaleway S3.
 * Usage: node scripts_test_s3/delete.js <clé_s3 ou nom_fichier>
 *   - Nom seul (ex: mon-fichier.jpg) → préfixé par SCALEWAY_FOLDER (ex: grp2/mon-fichier.jpg)
 *   - Clé complète (ex: grp2/sous-dossier/fichier.jpg) → utilisée telle quelle
 * Exemples:
 *   node scripts_test_s3/delete.js mon-fichier.jpg
 *   node scripts_test_s3/delete.js grp2/ma-photo.jpg
 */
import 'dotenv/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

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
  const input = process.argv[2];

  if (!input) {
    console.error('Usage: node scripts_test_s3/delete.js <clé_s3 ou nom_fichier>');
    console.error('Exemples: node scripts_test_s3/delete.js mon-fichier.jpg');
    console.error('          node scripts_test_s3/delete.js grp2/sous-dossier/mon-fichier.jpg');
    process.exit(1);
  }

  // Si pas de "/", c'est un simple nom de fichier → on préfixe avec SCALEWAY_FOLDER
  const key = input.includes('/') ? input : (folder ? `${folder}/${input}` : input);

  console.log('Bucket:', bucket);
  console.log('Clé à supprimer:', key);
  console.log('Suppression...');

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  console.log('OK. Objet supprimé.');
}

main().catch((err) => {
  console.error('Erreur:', err.message);
  if (err.name === 'AccessDenied' || err.$metadata?.httpStatusCode === 403) {
    console.error('→ Droits de suppression refusés. Vérifiez les permissions de la clé Scaleway.');
  }
  process.exit(1);
});
