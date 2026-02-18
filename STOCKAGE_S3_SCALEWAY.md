# Stockage S3 Scaleway — Guide technique

Ce document explique le fonctionnement du bucket S3 fourni pour le projet, comment le configurer et quelles modifications apporter à l’application pour l’utiliser à la place du dossier local `uploads`.

---

## 1. Qu’est-ce qu’un bucket S3 ?

- **S3** (Simple Storage Service) est un stockage de fichiers dans le cloud : on y envoie des fichiers (images, vidéos, etc.) et on reçoit une **URL publique** pour y accéder.
- Un **bucket** est un conteneur (comme un gros dossier) qui regroupe tous les fichiers du projet.
- **Scaleway** héberge ce bucket (équivalent AWS S3, compatible avec la même API).

**En résumé :** au lieu d’enregistrer les fichiers dans `backend/uploads/` sur le serveur, on les envoie sur le bucket S3. En base de données on stocke l’**URL complète** du fichier (ex. `https://brdx.s3.fr-par.scw.cloud/grp1/submissions/42/cover.jpg`). Le frontend et les lecteurs vidéo utilisent cette URL directement, sans passer par votre serveur Node.

**Avantages :**
- Fichiers accessibles même si le serveur redémarre ou est recréé.
- Pas de limite de place disque sur le serveur.
- Lecture des fichiers (vidéos, images) directement depuis Scaleway (CDN).

---

## 2. Configuration fournie (Bordeaux)

| Variable | Valeur | Rôle |
|----------|--------|------|
| `SCALEWAY_ACCESS_KEY` | `` | Identifiant pour l’API S3 |
| `SCALEWAY_SECRET_KEY` | `` | Clé secrète (ne pas exposer) |
| `SCALEWAY_ENDPOINT` | `https://s3.fr-par.scw.cloud` | Adresse de l’API S3 Scaleway |
| `SCALEWAY_BUCKET_NAME` | `brdx` | Nom du bucket (Bordeaux) |
| `SCALEWAY_REGION` | `fr-par` | Région du bucket |
| `SCALEWAY_FOLDER` | **`grp1`** ← à modifier | Sous-dossier dans le bucket pour votre groupe |

**Point important :** chaque groupe doit avoir sa propre valeur de `SCALEWAY_FOLDER` (ex. `grp2`, `grp3`). Tous les fichiers de votre app seront stockés sous ce préfixe dans le bucket, ce qui évite de mélanger les fichiers entre groupes.

---

## 3. Ce que vous devez faire côté configuration

1. Ouvrir le fichier **`.env`** du backend (à la racine de `backend/`).
2. Ajouter ou mettre à jour les variables suivantes (en remplaçant `grp1` par le nom de votre groupe) :

```env
SCALEWAY_ACCESS_KEY=
SCALEWAY_SECRET_KEY=
SCALEWAY_ENDPOINT=https://s3.fr-par.scw.cloud
SCALEWAY_BUCKET_NAME=brdx
SCALEWAY_REGION=fr-par
SCALEWAY_FOLDER=grp2
```

3. Ne pas modifier `ACCESS_KEY`, `SECRET_KEY` ni `BUCKET_NAME`.
4. Modifier **uniquement** `SCALEWAY_FOLDER` selon votre groupe.
5. Sauvegarder et redémarrer l’application.

---

## 4. Fonctionnement actuel (sans S3)

Aujourd’hui l’application :

1. Reçoit les fichiers via **Multer** et les enregistre sur le disque dans `backend/uploads/` (ex. `uploads/submissions/tmp/`, `uploads/sponsors/tmp/`).
2. Les déplace dans des dossiers finaux :
   - Submissions : `uploads/submissions/<id>/` (video, cover, gallery, subtitles).
   - Sponsors : `uploads/sponsors/<id>/` (cover).
3. En base de données, stocke des **chemins relatifs** comme :
   - `/uploads/submissions/1/video.mp4`
   - `/uploads/sponsors/2/cover.jpg`
4. Express sert ces fichiers avec `express.static('uploads')`, donc l’URL finale est par ex. `https://votre-api.com/uploads/submissions/1/video.mp4`.

---

## 5. Fonctionnement cible (avec S3)

Avec S3, le flux devient :

1. L’application reçoit les fichiers avec Multer, qui les enregistre **temporairement en local** (ex. `uploads/submissions/tmp/`) comme aujourd’hui.
2. Le contrôleur lit chaque fichier temp et l’**envoie** vers le bucket S3 (même structure de \"dossiers\" qu’actuellement).
3. Une fois l’upload S3 réussi, on enregistre l’URL publique en base et on **supprime le fichier temp local** pour ne pas remplir le disque (surtout pour les grosses vidéos).
4. En base de données on stocke l’**URL publique** du fichier (ex. `https://brdx.s3.fr-par.scw.cloud/grp2/submissions/42/video.mp4`).
5. Le frontend et les lecteurs utilisent cette URL directement ; le serveur Node ne sert plus les fichiers.

La structure dans le bucket peut reprendre celle des dossiers actuels :

- `{SCALEWAY_FOLDER}/submissions/{submissionId}/video.mp4`, `cover.jpg`, `gallery/...`, `subtitles.srt`
- `{SCALEWAY_FOLDER}/sponsors/{sponsorId}/cover.jpg`

---

## 6. Modifications à prévoir dans le code

### 6.1 Dépendance Node

Installer le client S3 (compatible Scaleway) :

```bash
cd backend
npm install @aws-sdk/client-s3
```

(Scaleway est compatible avec l’API S3 d’AWS.)

### 6.2 Service / utilitaire S3

Créer un module (ex. `backend/src/services/storage/s3.service.js`) qui :

- Lit les variables d’environnement (`SCALEWAY_*`).
- Configure un client S3 pointant vers `SCALEWAY_ENDPOINT` avec `SCALEWAY_ACCESS_KEY` et `SCALEWAY_SECRET_KEY`.
- Expose au moins une fonction du type `uploadFile(bufferOrStream, key, contentType)` qui :
  - envoie le fichier au bucket `SCALEWAY_BUCKET_NAME` ;
  - utilise comme clé (key) : `{SCALEWAY_FOLDER}/{type}/{id}/{filename}` (ex. `grp2/submissions/42/cover.jpg`) ;
  - retourne l’**URL publique** du fichier (construction manuelle ou via endpoint public).

La doc Scaleway indique que les fichiers sont en **lecture publique** ; l’URL sera typiquement :

`https://{bucket}.s3.{region}.scw.cloud/{key}`
ou via le endpoint fourni.

### 6.3 Contrôleurs

- **Submissions**
  - Après réception des fichiers (Multer), au lieu de seulement `fs.rename` vers `uploads/submissions/<id>/`, appeler le service S3 pour chaque fichier (vidéo, cover, galerie, sous-titres) et récupérer les URLs.
  - Enregistrer ces URLs en base (au lieu de `/uploads/...`).
  - Optionnel : garder un envoi local en dev et S3 en production (variable d’env type `USE_S3=true`).

- **Sponsors**
  - Même idée : après upload Multer, envoyer le fichier au S3 sous `{SCALEWAY_FOLDER}/sponsors/{sponsorId}/cover.{ext}` et sauvegarder l’URL retournée en base.

- **YouTube**
  - Le script qui envoie la vidéo à YouTube lit actuellement le fichier depuis `uploads/submissions/...`. Si les fichiers ne sont plus que sur S3, il faudra soit télécharger temporairement depuis l’URL S3, soit utiliser un flux (stream) depuis l’URL si la lib YouTube le permet.

### 6.4 Frontend

- Aujourd’hui les chemins sont relatifs (ex. `/uploads/submissions/1/cover.jpg`), donc le front fait souvent `API_URL + path` ou utilise un proxy.
- Avec S3, les champs en base contiendront des **URLs absolues**. Il suffit d’utiliser ces URLs directement pour les `<img>`, `<video>`, liens de téléchargement, etc. Aucun préfixe à ajouter.

### 6.5 Servir les fichiers en local (optionnel)

- Vous pouvez laisser `app.use('/uploads', express.static(...))` pour un environnement où S3 n’est pas utilisé (ex. dev local sans config S3).
- En production avec S3, les réponses de l’API renverront des URLs S3 ; la route `/uploads` ne sera plus utilisée pour ces fichiers.

---

## 7. Utilisation du bucket au quotidien

- **Développement**
  - Soit vous utilisez S3 dès le dev (avec les variables dans `.env`).
  - Soit vous gardez uniquement le disque local et n’activez S3 qu’en production (avec un flag du type `USE_S3`).

- **Déploiement**
  - Les variables Scaleway doivent être définies dans l’environnement du serveur (ou fichier `.env` non versionné).
  - Ne jamais commiter les clés dans Git.

- **Fichiers existants**
  - Les anciens enregistrements en base qui pointent vers `/uploads/...` resteront valides tant que le serveur sert encore le dossier `uploads`.
  - Pour tout migrer vers S3, il faudrait un script qui lit les fichiers locaux, les envoie en S3 et met à jour les URLs en base.

---

## 8. Résumé

| Élément | Rôle |
|--------|------|
| **Bucket** | Conteneur global des fichiers (brdx pour Bordeaux). |
| **SCALEWAY_FOLDER** | Sous-dossier par groupe (grp1, grp2, …) pour isoler vos fichiers. |
| **Variables .env** | À copier et à adapter (uniquement `SCALEWAY_FOLDER`). |
| **Code** | Ajouter un service S3, puis dans les contrôleurs : envoyer les fichiers vers S3 et stocker les URLs publiques en base. |
| **Frontend** | Utiliser directement les URLs renvoyées par l’API (déjà complètes). |

Si vous voulez, la prochaine étape peut être de poser la structure concrète du fichier `s3.service.js` et les appels à faire depuis `submissions.controller.js` et `sponsors.controller.js` (snippets de code adaptés à votre projet).

---

## 9. Voir le contenu du bucket (dossier / uploads)

- **Console Scaleway**
  Allez sur [console.scaleway.com](https://console.scaleway.com) → **Object Storage** → **Buckets** → bucket **brdx**. Ouvrez le préfixe de votre groupe (ex. `grp1`, `grp2`) pour voir les dossiers et fichiers.

- **Script Node (liste en terminal)**
  Le projet contient un script `backend/scripts/list-s3-bucket.js` qui liste les objets du bucket pour votre `SCALEWAY_FOLDER`. Après avoir installé `@aws-sdk/client-s3` et configuré le `.env` :

```bash
cd backend
npm install @aws-sdk/client-s3
node scripts/list-s3-bucket.js
```
