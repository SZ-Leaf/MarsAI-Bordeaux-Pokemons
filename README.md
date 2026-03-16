# MarsAI Bordeaux — Plateforme de festival de courts-métrages

Plateforme web complète dédiée à la gestion d'un festival de courts-métrages et d'événements culturels. Elle comprend un site public, un système de soumission de candidatures vidéo, une interface jury et un back-office d'administration.

---

## Technologies utilisées

**Frontend** — React 19, Vite, TailwindCSS, MUI, React Router 7, Zod  
**Backend** — Node.js, Express 5, MySQL2, JWT, Google OAuth  
**Stockage** — S3 Scaleway (vidéos et médias)  
**Base de données** — MySQL

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) v8+
- Un compte [Scaleway](https://www.scaleway.com/) avec un bucket S3 configuré
- (Optionnel) Credentials Google OAuth pour la connexion Google et l'intégration YouTube

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/SZ-Leaf/MarsAI-Bordeaux-Pokemons
cd MarsAI-Bordeaux-Pokemons
```

### 2. Initialiser la base de données

Importer le schéma SQL fourni dans votre instance MySQL :

```bash
mysql -u <user> -p <nom_de_la_base> < db/marsAI_DB.sql
```

### 3. Configurer le backend

```bash
cd backend
cp .env.example .env
```

Renseigner les variables dans le fichier `.env` :

| Variable | Description |
|---|---|
| `PORT` | Port d'écoute du serveur (ex: `3000`) |
| `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Connexion MySQL |
| `JWT_SECRET` | Clé secrète pour les tokens JWT |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credentials Google OAuth |
| `S3_*` | Credentials et configuration du bucket Scaleway S3 |
| `SMTP_*` | Configuration email (Nodemailer) |

```bash
npm install
npm run dev
```

### 4. Configurer le frontend

```bash
cd ../frontend
```

Créer un fichier `.env` à la racine du dossier `frontend` :

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm install
npm run dev
```

Le frontend sera disponible sur [http://localhost:5173](http://localhost:5173).

---

## Fonctionnalités

### Site public

- **Accueil** — Présentation du festival
- **Événements** — Consultation des événements à venir avec système de réservation
- **Sélection** — Découverte des films sélectionnés
- **Palmarès** — Affichage des films primés
- **Jury** — Présentation des membres du jury

### Soumission de candidatures

- Formulaire multi-étapes pour soumettre un court-métrage
- Upload de vidéo stockée sur S3 Scaleway
- Intégration YouTube OAuth pour créer un token de sécurité pour l'API Youtube

### Authentification

- Inscription / connexion par email et mot de passe (JWT)

### Newsletter

- Inscription à la newsletter depuis le site public
- Confirmation par email et désinscription via un lien dédié

### Interface jury

- Accès sécurisé pour les membres du jury
- Consultation et notation des soumissions

### Back-office d'administration

Accessible via `/dashboard` (accès restreint aux administrateurs/sélectionneurs) :

- **Vue d'ensemble** — Tableau de bord avec statistiques globales
- **CMS** — Gestion du contenu éditorial du site (textes, médias)
- **Soumissions** — Visualisation et gestion de toutes les candidatures reçues
- **Événements** — Création, modification et suppression d'événements
- **Invitations** — Gestion des invitations aux événements
- **Newsletter** — Gestion des abonnés et envoi de campagnes
- **Sponsors** — Administration des partenaires et sponsors
- **Utilisateurs** — Gestion des comptes utilisateurs
- **Galerie vidéo** — Gestion de la médiathèque
- **Awards** — Gestion du palmarès

---

## Structure du projet

```
MarsAI-Bordeaux-Pokemons/
├── backend/        # API REST Express
├── frontend/       # Application React (Vite)
└── db/             # Schéma SQL et diagramme de base de données
```
