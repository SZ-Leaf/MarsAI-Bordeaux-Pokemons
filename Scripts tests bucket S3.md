
## 1. Configuration `.env` (backend)

6 lignes à rajouter dans le .env du backend:

```env
SCALEWAY_ACCESS_KEY=votre_access_key
SCALEWAY_SECRET_KEY=votre_secret_key
SCALEWAY_ENDPOINT=https://s3.fr-par.scw.cloud
SCALEWAY_BUCKET_NAME=brdx
SCALEWAY_REGION=fr-par
SCALEWAY_FOLDER=grp2
```

- **`SCALEWAY_FOLDER`** : à adapter selon votre groupe (`grp1`, `grp2`, `grp3`, etc.). Tous vos fichiers seront stockés sous ce « dossier » dans le bucket.

---

## 2. Dépendance Node (backend)

Installer sur le backend la dépendance : **`@aws-sdk/client-s3`**


---

## 3. Scripts de test S3

Les scripts sont dans **`backend/scripts_test_s3/`** :

| Fichier    | Rôle                          |
|-----------|--------------------------------|
| `list.js` | Lister le contenu du bucket   |
| `upload.js` | Envoyer un fichier vers S3  |
| `delete.js` | Supprimer un objet par clé  |

**Important :** toutes les commandes ci-dessous sont à lancer **depuis le dossier `backend`** (pour que le `.env` soit chargé).

---

## 4. Commandes à utiliser

### 4.1 Lister le contenu du bucket

```bash
cd backend
node scripts_test_s3/list.js
```

- Liste par défaut les objets sous le préfixe `SCALEWAY_FOLDER` (ex. `grp2/`).
- **Contenu affiché :** tu vois **tous les objets** sous ce préfixe, y compris ceux dans les « sous-dossiers ». S3 renvoie une liste **plate** de clés (pas de vrais dossiers). Exemple de sortie :
  ```
  grp2/mon-fichier.jpg
  grp2/toto/cover.jpg
  grp2/toto/video.mp4
  grp2/tata/cover.jpg
  ```
  Donc tout ce qui est « dans » un sous-dossier est bien listé en une seule fois.
- **Limiter à un sous-dossier :** avec un préfixe optionnel tu ne vois que les clés qui commencent par ce préfixe :  
  `node scripts_test_s3/list.js grp2/toto/`

### 4.2 Envoyer un fichier (upload)

**Les fichiers à upload pour les tests sont à mettre dans `backend/scripts_test_s3/` avec les scripts**

1. Placer le fichier à envoyer dans **`backend/scripts_test_s3/`** (ex. `mon-fichier.jpg`).
2. Lancer :

```bash
cd backend
node scripts_test_s3/upload.js mon-fichier.jpg
```

→ Le fichier est envoyé sous **`grp2/mon-fichier.jpg`** (`SCALEWAY_FOLDER/mon-fichier.jpg`).

**Envoyer dans un sous-dossier de `grp2` :**

```bash
node scripts_test_s3/upload.js mon-fichier.jpg grp2/sous-dossier/mon-fichier.jpg
```

Si le « dossier » n’existe pas, S3 le crée automatiquement (c’est juste un préfixe dans la clé).

**Note: on peut utiliser un chemin absolu :**

```bash
node scripts_test_s3/upload.js C:\Users\...\Downloads\photo.jpg
```

### 4.3 ACL et accès public au fichier

Lors de l’upload, le script envoie l’objet avec **`ACL: 'public-read'`**. Cela donne le droit de **lecture publique** sur le fichier : n’importe qui peut y accéder via une URL, sans authentification. Sans cette ACL, l’objet resterait privé et les liens ci-dessous ne fonctionneraient pas.

- **À retenir :** pour que les fichiers soient accessibles depuis le front (images, vidéos, etc.), l’upload doit inclure `ACL: 'public-read'` (déjà fait dans `upload.js`).
- Si vous réutilisez la logique dans un service S3 (ex. `PutObjectCommand`), pensez à passer **`ACL: 'public-read'`** dans les paramètres.

### 4.4 Les 2 URLs valides pour accéder au fichier

Une fois le fichier envoyé (ex. clé `grp2/mon-fichier.jpg` dans le bucket `brdx`), il est accessible via **deux formats d’URL** (tous deux valides) :

| Format | Schéma | Exemple pour `grp2/mon-fichier.jpg` |
|--------|--------|-------------------------------------|
| **Virtual-hosted** | `https://{bucket}.s3.{region}.scw.cloud/{clé}` | `https://brdx.s3.fr-par.scw.cloud/grp2/mon-fichier.jpg` |
| **Path-style** | `https://s3.{region}.scw.cloud/{bucket}/{clé}` | `https://s3.fr-par.scw.cloud/brdx/grp2/mon-fichier.jpg` |

- **Virtual-hosted** : pratique à utiliser en base et côté front (URL courte, bucket dans le domaine).
- **Path-style** : basé sur l’endpoint API (`SCALEWAY_ENDPOINT`), utile si vous construisez l’URL à partir de la config.

En base de données, stocker **une seule** de ces URLs (souvent la forme virtual-hosted). Les deux pointent vers le même fichier.

### 4.5 Supprimer un objet (delete)

On peut passer soit le **nom du fichier seul**, soit la **clé S3 complète**. Le script utilise `SCALEWAY_FOLDER` du `.env` pour préfixer quand tu donnes seulement un nom.

**Fichier à la racine du dossier groupe** (ex. `grp2/mon-fichier.jpg`) :

```bash
cd backend
node scripts_test_s3/delete.js mon-fichier.jpg
```

→ Supprime `grp2/mon-fichier.jpg` (avec `SCALEWAY_FOLDER=grp2`).

**Clé complète** (obligatoire pour un fichier dans un sous-dossier) :

```bash
node scripts_test_s3/delete.js grp2/sous-dossier/mon-fichier.jpg
```

- L’argument est **obligatoire** ; sans lui, le script affiche le message d’usage et ne supprime rien.
- **Règle :** si l’argument contient un `/`, il est utilisé tel quel (clé complète). Sinon, le script préfixe avec `SCALEWAY_FOLDER`.
- Pour retrouver la clé exacte : `node scripts_test_s3/list.js` (ou `list.js grp2/sous-dossier/`).

---

## 5. A lire: Informations utiles

- **Git :** vous pouvez placer le dossier **`scripts_test_s3/`** dans `.gitignore` du backend pour ne pas versionner les scripts et fichiers de test S3.
- **Dossiers vides :** En S3 il n’y a pas de vrais dossiers. Un « dossier vide » n’existe pas en tant qu’objet ; une fois tous les fichiers supprimés, il n’y a plus rien à supprimer.
- **Fichier introuvable (upload) :** Si tu donnes seulement un nom (ex. `mon-fichier.jpg`), le script cherche le fichier dans `backend/scripts_test_s3/`. S’il n’existe pas, un message d’erreur clair s’affiche.

---

## 6. Résumé des 3 commandes

| Action   | Commande |
|----------|----------|
| **Lister** | `node scripts_test_s3/list.js` |
| **Upload** | `node scripts_test_s3/upload.js <fichier> [clé_s3]` — sans clé → à la racine de `grp2` (`SCALEWAY_FOLDER/nom_fichier`) |
| **Supprimer** | `node scripts_test_s3/delete.js <nom_fichier ou clé_s3>` |

*(Toutes à exécuter depuis le dossier `backend`.)*
