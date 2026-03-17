# CMS Homepage — Présentation (4 min)

---

## Contexte & Problème résolu

La page d'accueil du festival contient de nombreux contenus textuels (héros, films, stats, conférences…) **bilingues FR/EN**. Sans CMS, toute modification nécessiterait d'aller éditer le code directement.

**Objectif :** permettre aux administrateurs de modifier ces contenus **sans toucher au code**, directement depuis l'interface d'admin.

---

## Ce que gère le CMS — 6 sections

| Onglet | Contenu |
|---|---|
| **Hero** | Badge, 2 lignes de description, 2 boutons CTA |
| **Features** | Cartes de fonctionnalités (titre + description) |
| **Films** | Liste des films (titre, réalisateur, image) |
| **Stats** | Chiffres clés du festival |
| **Conférences** | Titre, description, icône |
| **Objectifs** | Titre, description, icône + couleurs |

---

## Fonctionnement technique

```
Interface Admin (React)
  └── useHomepageCms.js   ← gestion d'état
        ├── GET /api/homepage   → lecture homepage.json
        └── PUT /api/homepage   → écriture homepage.json
```

- **Pas de base de données** : les contenus sont stockés dans un fichier JSON côté backend (`backend/src/data/homepage.json`), lu et écrit via l'API.
- **Sécurité** : la route `PUT` est protégée — authentification requise + rôle admin (2 ou 3). La route `GET` est publique avec rate limiting.

---

## Composants clés

### Champs bilingues FR / EN
Chaque champ textuel est éditable **en français et en anglais** côte à côte, grâce au composant `BilingualField`.

### Listes dynamiques
Les sections comme Films, Conférences ou Objectifs permettent d'**ajouter et supprimer des éléments** dynamiquement.

### Prévisualisation image (Films)
Saisir une URL d'image affiche un aperçu inline immédiatement.

### Barre d'actions
- **Sauvegarder** → appel API avec spinner pendant l'envoi
- **Réinitialiser** → annule les modifications non sauvegardées (snapshot local)
- **Feedback** → confirmation verte ✓ ou erreur rouge ⚠, disparaît au bout de 3 secondes

---

## Résumé en une phrase

> Le CMS permet à un administrateur de mettre à jour **l'intégralité des contenus bilingues** de la page d'accueil, en temps réel, depuis une interface intuitive, sans intervention technique.
