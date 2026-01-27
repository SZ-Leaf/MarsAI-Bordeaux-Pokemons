# Répartition Équipe MarsAI-Bordeaux-Pokemons - Par Fonctionnalité (Feature Owner)

## 🎯 Principe : 1 Dev = 1 Feature Complète

### Approche Feature-Driven
✅ **Ownership clair** : 1 dev possède toute une fonctionnalité (back + front + tests)
✅ **Cohérence** : Même dev fait l'API et l'UI (pas de désynchronisation)
✅ **Autonomie** : Chaque dev livre une feature complète du début à la fin
✅ **Reviews croisées** : 2 autres devs reviewent chaque feature

### Architecture Technique
- **Backend** : Express.js + MySQL 8.0+ (SQL direct, **pas d'ORM**)
- **Services Layer** : Requêtes SQL avec prepared statements et transactions
- **Authentification** : JWT pour **admin** et **selector** uniquement
- **Soumission publique** : Les créateurs de films soumettent **sans compte**

### Avantages
- 🎯 **Responsabilité claire** : "C'est ma feature, je la gère"
- 🔄 **Moins de dépendances** : Pas besoin d'attendre un autre dev
- 💡 **Motivation** : Fierté de livrer une feature complète
- 📚 **Apprentissage full-stack** : Vraie expérience back + front
- 🐛 **Hotfix rapide** : Owner corrige les bugs de sa feature

---

## 📅 Calendrier Projet

```
📅 Début : 27 janvier 2026
⚠️ Deadline : 23 mars 2026 (40 jours ouvrés)

┌─────────────────────────────────────────────────────────────────┐
│ SPRINT 1 : 27 jan - 7 fév   (10 jours) │ F1-F5  │ 46 pts      │
├─────────────────────────────────────────────────────────────────┤
│ SPRINT 2 : 10 fév - 21 fév  (10 jours) │ F6-F10 │ 47 pts      │
├─────────────────────────────────────────────────────────────────┤
│ SPRINT 3 : 24 fév - 7 mars  (10 jours) │ F11-F15│ 48 pts      │
├─────────────────────────────────────────────────────────────────┤
│ SPRINT 4 : 10 mars - 21 mars(10 jours) │ F16-F20│ 48 pts      │
├─────────────────────────────────────────────────────────────────┤
│ BUFFER  : 22-23 mars         (2 jours)  │ Corrections & Polish│
└─────────────────────────────────────────────────────────────────┘

Total : 42 jours (40 jours sprints + 2 jours buffer)
```

**⚠️ Contraintes :**
- **Pas de marge d'erreur** : Planning serré avec seulement 2 jours de buffer
- **Coordination essentielle** : Daily standups obligatoires
- **Focus sur l'essentiel** : Éviter le sur-engineering
- **Reviews rapides** : Maximum 2h de délai pour débloquer les autres devs

---

## 📦 SPRINT 1 - Fondations (Auth + Soumissions + UI) (46 pts)
**Tous les devs travaillent en parallèle**

### 🔐 Feature 1 : Authentification & Rôles (13 pts)
**Owner : Dev 1 (Toi)**

**Backend (7 pts) :**
- `services/userService.js` : Requêtes SQL (findByEmail, createUser, updateLastLogin, comparePassword)
- `services/roleService.js` : Requêtes SQL (getRoles - admin, selector uniquement)
- `controllers/authController.js` : register, login, logout, me, refreshToken
- `routes/auth.routes.js` : POST /register, POST /login, GET /me, POST /refresh-token
- `middleware/auth.js` : verifyToken, requireRole(['admin', 'selector'])
- `config/jwt.js` : generateToken, verifyToken, generateRefreshToken
- `utils/schemas.js` : registerSchema, loginSchema (Zod)
- `middleware/validate.js` : Middleware validation Zod

**Note importante** : 
- **Rôles système uniquement** : `admin` et `selector` (pas de role "creator")
- Les créateurs de films ne sont **pas des utilisateurs** du système
- Soumission de films = formulaire public **sans authentification**

**Frontend (6 pts) :**
- `pages/Auth.jsx` : Page auth avec tabs (Login/Register)
- `components/LoginForm.jsx` : Formulaire connexion + validation temps réel
- `components/RegisterForm.jsx` : Formulaire inscription + validation
- `hooks/useAuth.js` : Hook gestion auth (login, register, logout, refreshToken)
- `context/AuthContext.jsx` : Context React (JWT + user state + role)
- `utils/api.js` : Axios instance avec intercepteur JWT + refresh token auto

**Tests :**
- Postman : POST /register, POST /login, GET /me (avec roles différents)
- E2E Cypress : Flow inscription → connexion → redirection selon rôle
- Test token expiration + refresh automatique

**Reviews par :** Dev 2, Dev 3

**Durée estimée :** 6-7 jours

---

### 📤 Feature 2 : Soumission Films Complète (12 pts)
**Owner : Dev 2**

**Backend (7 pts) :**
- `middleware/upload.js` : Config Multer (cover 5MB, gallery 3x5MB, subtitles .srt)
- `services/submissionService.js` : Requêtes SQL (INSERT submission, INSERT collaborators, INSERT gallery, INSERT socials)
- `services/collaboratorService.js` : Requêtes SQL (INSERT/UPDATE/DELETE collaborateurs)
- `services/galleryService.js` : Requêtes SQL (INSERT images, DELETE image)
- `controllers/submissionController.js` : submit (upload + transaction SQL complète)
- `routes/submission.routes.js` : POST /submissions (public, pas d'auth), GET /admin/submissions (admin)
- `utils/schemas.js` : submissionSchema, collaboratorSchema (Zod)

**Note importante** :
- **Route POST /submissions est publique** (pas d'authentification requise)
- Les créateurs remplissent un formulaire sans créer de compte
- Utilisation de **transactions SQL** pour garantir la cohérence (submission + collaborators + gallery + socials)

**Frontend (5 pts) :**
- `pages/Submit.jsx` : Page soumission film (multi-steps form)
- `components/SubmissionForm.jsx` : Formulaire principal (infos film)
- `components/CollaboratorsForm.jsx` : Formulaire ajout collaborateurs 
- `components/GalleryUpload.jsx` : Upload 3 images gallery + preview
- `components/SocialLinksForm.jsx` : Liens réseaux sociaux (dynamic fields)
- `components/FileUploader.jsx` : Cover + subtitles
- `components/StepIndicator.jsx` : Indicateur progression (Step 1/4)
- `hooks/useSubmission.js` : Hook gestion soumission complète

**Note importante** :
Le formulaire d'upload de vidéo doit se faire en 3 parties distinctes :
- `Première partie : règlement + validation des CGU + 18 ans`
- `Deuxième partie : infos de la vidéo + upload`
- `Troisième partie : infos du réalisateur`

**Tests :**
- Upload cover JPEG/JPG/PNG (max 5MB)
- Upload 3 images gallery (max) 
- Ajout collaborateurs 
- Vérification stockage : `/uploads/submissions/{submission_id}/`
- Erreur : format invalide, taille dépassée

**Reviews par :** Dev 1, Dev 4

**Durée estimée :** 6-7 jours

---

### 🎬 Feature 3 : YouTube API + Validation Vidéo (9 pts)
**Owner : Dev 3**

**Backend (5 pts) :**
- `utils/youtube.js` : validateYouTubeVideo, extractVideoId, parseDuration, getThumbnail
- `controllers/submissionController.js` : Extension submit (YouTube URL)
- Intégration YouTube Data API v3 (validation + métadonnées)
- Récupération : durée, thumbnail, titre, langue
- Validation : vidéo publique, durée min/max

**Frontend (4 pts) :**
- `components/YouTubeInput.jsx` : Input URL YouTube + validation temps réel
- `components/VideoPreview.jsx` : Preview vidéo (YouTube embed player)
- `hooks/useYouTubeValidation.js` : Hook validation API avec debounce (500ms)
- `components/VideoMetadata.jsx` : Affichage métadonnées récupérées (duration, language)

**Tests :**
- URL valide : récupération métadonnées OK + pré-remplissage champs
- URL invalide : erreur 400
- Vidéo privée : erreur "Vidéo privée ou introuvable"
- Durée hors limites : erreur "Durée non conforme"

**Reviews par :** Dev 2, Dev 4

**Durée estimée :** 5 jours

---

### 🏷️ Feature 4 : Tags & Classification (6 pts)
**Owner : Dev 4**

**Backend (3 pts) :**
- `services/tagService.js` : Requêtes SQL (SELECT tags, INSERT tag, SELECT popular, INSERT submissions_tags)
- `controllers/tagController.js` : list, create (admin), getPopular, addToSubmission
- `routes/tag.routes.js` : GET /tags, POST /tags (admin), GET /tags/popular
- `utils/schemas.js` : tagSchema (Zod)

**Frontend (3 pts) :**
- `components/TagInput.jsx` : Input tags avec suggestions (autocomplete)
- `components/TagList.jsx` : Liste tags sélectionnés (suppression possible)
- `components/ClassificationSelect.jsx` : Select classification (IA/hybrid/manual)
- `hooks/useTags.js` : Hook gestion tags (fetch, create, suggestions)

**Tests :**
- Création tag (si inexistant)
- Ajout tags à submission (table associative)
- Autocompletion tags populaires
- Affichage classification sur cards

**Reviews par :** Dev 1, Dev 5

**Durée estimée :** 4 jours

---

### 🎨 Feature 5 : Fondations Frontend + Design System (8 pts)
**Owner : Dev 5**

**Frontend (8 pts) :**
- `components/ui/Button.jsx` : Composant bouton réutilisable (variants: primary, secondary, danger)
- `components/ui/Input.jsx` : Composant input avec validation visuelle
- `components/ui/Select.jsx` : Composant select stylisé
- `components/ui/Modal.jsx` : Composant modal réutilisable
- `components/ui/Card.jsx` : Composant carte réutilisable
- `components/ui/Badge.jsx` : Composant badge (status, tags)
- `components/ui/Loader.jsx` : Composant loading spinner
- `components/layout/Navbar.jsx` : Navbar principale (responsive)
- `components/layout/Footer.jsx` : Footer avec liens
- `styles/theme.js` : Variables couleurs, typographie, breakpoints
- `hooks/useToast.js` : Hook notifications toast
- Configuration TailwindCSS complète

**Tests :**
- Storybook ou page démo des composants UI
- Tests responsive (mobile, tablet, desktop)
- Accessibilité (ARIA labels, keyboard navigation)

**Reviews par :** Dev 1, Dev 2

**Durée estimée :** 4 jours

**Note** : Cette feature pose les fondations pour que les autres devs puissent utiliser des composants cohérents et réutilisables.

---

## 📦 SPRINT 2 - Modération + Jury + Newsletter (47 pts)
**Tous les devs travaillent en parallèle**

### 🛡️ Feature 6 : Modération Admin (12 pts)
**Owner : Dev 1 (Toi)**

**Backend (6 pts) :**
- `services/moderationService.js` : Requêtes SQL (INSERT submission_moderation, UPDATE status, SELECT avec JOIN users)
- `controllers/moderationController.js` : listSubmissions, updateStatus, assignToSelector, getHistory
- `routes/moderation.routes.js` : GET /admin/submissions, PATCH /admin/submissions/:id/status, POST /admin/submissions/:id/assign
- `middleware/auth.js` : Extension requireRole(['admin'])
- `utils/schemas.js` : moderationSchema (status, details)

**Frontend (6 pts) :**
- `pages/AdminModeration.jsx` : Panel admin avec liste submissions
- `components/SubmissionList.jsx` : Liste paginée avec filtres statut
- `components/StatusBadge.jsx` : Badge coloré selon statut (pending/validated/rejected)
- `components/ModerationModal.jsx` : Modal changement statut + commentaire détails
- `components/AssignSelectorModal.jsx` : Modal assignation à un selector
- `components/SubmissionFilters.jsx` : Filtres (statut, date, classification)
- `hooks/useModeration.js` : Hook gestion modération

**Tests :**
- Workflow : draft → pending → validated/rejected
- Assignation submission à selector (user_id dans submission_moderation)
- Pagination liste (20/page)
- Filtres statut + classification

**Reviews par :** Dev 2, Dev 3

**Durée estimée :** 6-7 jours

---

### 📚 Feature 7 : Playlist & Historique Selector (10 pts)
**Owner : Dev 2**

**Backend (4 pts) :**
- Extension `services/selectorService.js` : Requêtes SQL (SELECT playlist WHERE selection_list=1, SELECT recent dislikes, DELETE memo)
- `controllers/selectorController.js` : getMyPlaylist, undoDislike
- Logique annulation dislike (vidéo réapparaît dans feed)

**Frontend (6 pts) :**
- `pages/SelectorPlaylist.jsx` : Page playlist selector (vidéos bookmarkées)
- `pages/DislikesHistory.jsx` : Historique 10 derniers dislikes + bouton annuler
- `components/BookmarkButton.jsx` : Bouton bookmark (toggle on/off avec animation)
- `components/UndoButton.jsx` : Bouton annuler dislike avec icône ↶
- `components/PlaylistCard.jsx` : Carte submission dans playlist
- `components/RatingDisplay.jsx` : Affichage note donnée (étoiles)
- `hooks/usePlaylist.js` : Hook gestion playlist

**Tests :**
- Ajout bookmark (selection_list = 1)
- Retrait bookmark (selection_list = 0)
- Annulation dislike (suppression selector_memo)
- Vidéo annulée réapparaît dans feed

**Reviews par :** Dev 3, Dev 5

**Durée estimée :** 5 jours

---

### 🎭 Feature 8 : Interface Jury Type TikTok (16 pts)
**Owner : Dev 3**

**Backend (5 pts) :**
- `services/selectorService.js` : Requêtes SQL (INSERT/UPDATE selector_memo, SELECT feed avec filtres, SELECT playlist)
- `controllers/selectorController.js` : getFeed, rateSubmission, togglePlaylist, getMyPlaylist, undoDislike
- `routes/selector.routes.js` : GET /selector/feed, POST /selector/rate/:id, PATCH /selector/playlist/:id, GET /selector/playlist, GET /selector/recent-dislikes/:id
- `utils/schemas.js` : rateSubmissionSchema (rating 1-10, comment, selection_list)

**Frontend (11 pts) :**
- `pages/SelectorFeed.jsx` : Page selector style TikTok (fullscreen)
- `components/SwipeContainer.jsx` : Container gestes swipe (react-swipeable)
- `components/VideoPlayer.jsx` : Lecteur fullscreen avec contrôles (react-player)
- `components/RatingPopup.jsx` : Modal notation 1-10 + commentaire + liste sélection
- `components/SwipeIndicator.jsx` : Feedback visuel (❤️ right, ❌ left, 🔖 up)
- `components/NavigationHint.jsx` : Instructions swipe (overlay initial)
- `components/SubmissionInfo.jsx` : Overlay infos film (titre, créateur, tags)
- `hooks/useSwipeGestures.js` : Hook gestion gestes + état vidéo
- `hooks/useFeed.js` : Hook gestion feed (fetch, cache, next/prev)

**Animations Framer Motion :**
- Transition vidéos (slide vertical)
- Feedback swipe (scale + opacity + couleur)
- Popup notation (spring effect)

**Tests :**
- Feed submissions validées non notées (ordre : assignées en priorité)
- Swipe up = vidéo précédente
- Swipe down = vidéo suivante
- Swipe right = popup notation (rating 1-10 + comment)
- Swipe left = dislike (selection_list = 0)
- Bouton bookmark (toggle selection_list)

**Reviews par :** Dev 2, Dev 4

**Durée estimée :** 8-9 jours

---

### 🤝 Feature 9 : Sponsors & Réseaux Sociaux (7 pts)
**Owner : Dev 4**

**Backend (4 pts) :**
- `services/sponsorService.js` : Requêtes SQL (INSERT/UPDATE/DELETE sponsors, SELECT actifs)
- `services/socialService.js` : Requêtes SQL (SELECT networks, INSERT socials, SELECT par submission)
- `controllers/sponsorController.js` : CRUD sponsors, listActive
- `controllers/socialController.js` : listNetworks, addToSubmission
- `routes/sponsor.routes.js` : CRUD complet (admin) + GET /sponsors (public)
- `routes/social.routes.js` : GET /social-networks, POST /submissions/:id/socials
- `utils/schemas.js` : sponsorSchema, socialSchema

**Frontend (3 pts) :**
- `pages/AdminSponsors.jsx` : Gestion sponsors (admin) CRUD
- `components/SponsorsList.jsx` : Liste sponsors (logos cliquables)
- `components/SponsorForm.jsx` : Formulaire création/édition sponsor
- `components/SocialNetworkSelect.jsx` : Select réseau social (logos + noms)
- `hooks/useSponsors.js` : Hook gestion sponsors

**Tests :**
- Création sponsor (name, cover, url)
- Affichage sponsors homepage (section CMS)
- Ajout liens sociaux à submission
- Liste réseaux disponibles (Instagram, Facebook, TikTok, YouTube, Twitter, LinkedIn)

**Reviews par :** Dev 1, Dev 5

**Durée estimée :** 4 jours

---

### 📧 Feature 10 : Newsletter (8 pts)
**Owner : Dev 5**

**Backend (4 pts) :**
- `services/newsletterService.js` : Requêtes SQL (INSERT/DELETE newsletter, INSERT/DELETE newsletter_listings)
- `controllers/newsletterController.js` : subscribe, unsubscribe, create (admin), send (admin), list (admin)
- `routes/newsletter.routes.js` : POST /newsletter/subscribe, POST /newsletter/unsubscribe, POST /admin/newsletter (create + send), GET /admin/newsletter
- `utils/email.js` : sendNewsletter (bulk email avec service comme SendGrid)
- `utils/schemas.js` : newsletterSchema, subscribeSchema

**Frontend (4 pts) :**
- `pages/AdminNewsletter.jsx` : Gestion newsletter (admin) création + envoi
- `components/NewsletterForm.jsx` : Formulaire inscription newsletter (footer site)
- `components/NewsletterEditor.jsx` : Éditeur newsletter (title + content rich text)
- `components/SubscribersList.jsx` : Liste abonnés (admin)
- `components/SendButton.jsx` : Bouton envoi newsletter avec confirmation
- `hooks/useNewsletter.js` : Hook gestion newsletter

**Tests :**
- Inscription newsletter (email unique)
- Désinscription (soft delete ou flag)
- Création newsletter (title + content)
- Envoi newsletter à tous les abonnés
- Liste abonnés (admin)

**Reviews par :** Dev 3, Dev 4

**Durée estimée :** 4 jours

---

## 📦 SPRINT 3 - Catalogue + Awards + CMS (48 pts)
**Tous les devs travaillent en parallèle**

### 🎬 Feature 11 : Catalogue Public Films (12 pts)
**Owner : Dev 1 (Toi)**

**Backend (5 pts) :**
- `services/catalogueService.js` : Requêtes SQL complexes avec JOINs (submissions + tags + awards + collaborators)
- `controllers/catalogueController.js` : listSubmissions, search, getFilters
- `routes/catalogue.routes.js` : GET /catalogue (public), GET /catalogue/filters
- Requêtes SQL avec filtres dynamiques (classification, country, language, tags, awards)
- Recherche full-text SQL (LIKE sur english_title, original_title, synopsis)
- Pagination SQL (LIMIT/OFFSET) + tri (ORDER BY date, rating, titre)

**Frontend (7 pts) :**
- `pages/Catalogue.jsx` : Grille responsive films (3 colonnes desktop, 1 mobile)
- `components/FilmCard.jsx` : Carte film (cover, titre, durée, classification, awards badge)
- `components/FilterSidebar.jsx` : Sidebar filtres (classification, pays, langue, tags, awards)
- `components/SearchBar.jsx` : Barre recherche avec debounce
- `components/Pagination.jsx` : Navigation pages avec numéros
- `components/SortDropdown.jsx` : Dropdown tri (date, note, titre)
- `hooks/useCatalogue.js` : Hook gestion catalogue (filtres, recherche, pagination, tri)
- `hooks/useDebounce.js` : Hook debounce pour recherche

**Tests :**
- Liste submissions validées uniquement (status = validated)
- Filtres : classification (IA/hybrid/manual), pays, tags, awards
- Recherche : "future" trouve films dans titre ou synopsis
- Pagination : 20 films/page
- Tri : date DESC, rating DESC, titre ASC

**Reviews par :** Dev 2, Dev 5

**Durée estimée :** 6 jours

---

### 🏆 Feature 12 : Système Awards Complet (10 pts)
**Owner : Dev 2**

**Backend (5 pts) :**
- `services/awardService.js` : Requêtes SQL (INSERT/UPDATE/DELETE awards, INSERT/DELETE submissions_awards, SELECT avec JOINs)
- `controllers/awardController.js` : CRUD awards, assignToSubmission, removeFromSubmission, getWinners
- `routes/award.routes.js` : POST /admin/awards, PATCH /admin/awards/:id, DELETE /admin/awards/:id, POST /admin/submissions/:id/awards/:awardId, GET /awards/winners
- `utils/schemas.js` : awardSchema (title, rank, cover, description)

**Frontend (5 pts) :**
- `pages/Winners.jsx` : Page palmarès (liste prix + films gagnants)
- `pages/AdminAwards.jsx` : Gestion prix (admin) CRUD
- `components/AwardCard.jsx` : Carte prix avec image + titre + rank + description
- `components/AwardBadge.jsx` : Badge prix sur film (icône trophée + rank)
- `components/AwardForm.jsx` : Formulaire création/édition prix
- `components/WinnerGrid.jsx` : Grille films gagnants par prix
- `hooks/useAwards.js` : Hook gestion awards

**Tests :**
- Création prix (titre, image, rank, description)
- Attribution prix à submission (table associative)
- Affichage palmarès (groupé par rank)
- Tri par rank (ordre d'affichage)
- Suppression prix (cascade sur submissions_awards)

**Reviews par :** Dev 1, Dev 3

**Durée estimée :** 5 jours

---

### 📊 Feature 13 : Statistiques & Analytics (6 pts)
**Owner : Dev 3**

**Backend (3 pts) :**
- `services/statsService.js` : Requêtes SQL agrégées (COUNT, AVG, GROUP BY, avec JOINs multiples)
- `controllers/statsController.js` : getGlobalStats, getSubmissionStats, getSelectorStats
- `routes/stats.routes.js` : GET /admin/stats (admin)
- Stats : total submissions, par pays, par classification, moyenne ratings, top selectors

**Frontend (3 pts) :**
- `pages/AdminStats.jsx` : Tableau de bord statistiques (admin)
- `components/StatsCard.jsx` : Carte statistique (nombre + évolution)
- `components/StatsChart.jsx` : Graphiques (Chart.js ou Recharts)
- `components/CountryDistribution.jsx` : Carte distribution par pays
- `hooks/useStats.js` : Hook gestion statistiques

**Tests :**
- Affichage stats globales (submissions, users, events, reservations)
- Stats par pays (top 10)
- Stats par classification
- Moyenne ratings selectors

**Reviews par :** Dev 1, Dev 4

**Durée estimée :** 3 jours

---

### 🎥 Feature 14 : Page Détail Film Complète (11 pts)
**Owner : Dev 4**

**Backend (3 pts) :**
- `services/catalogueService.js` : Extension avec requête SQL complexe (JOINs multiples)
- `controllers/catalogueController.js` : getSubmissionById
- Requête SQL optimisée avec JOINs (collaborators, tags, gallery, awards, socials)
- Agrégation ratings avec AVG et COUNT sur selector_memo

**Frontend (8 pts) :**
- `pages/FilmDetail.jsx` : Page détail complète (layout hero + infos)
- `components/FilmHeader.jsx` : Header (cover fullwidth, titre, durée, awards, rating)
- `components/FilmInfo.jsx` : Bloc infos (synopsis FR/EN, classification, pays, langue, tech_stack)
- `components/CollaboratorsList.jsx` : Équipe production avec rôles + genre
- `components/TagsList.jsx` : Liste tags cliquables (→ catalogue filtré)
- `components/GalleryViewer.jsx` : Galerie screenshots (3 images, lightbox)
- `components/SocialLinks.jsx` : Liens réseaux sociaux (icônes + logos)
- `components/AwardsBanner.jsx` : Bannière prix gagnés avec rank
- `components/RatingStats.jsx` : Stats ratings (moyenne + nombre votes)

**Tests :**
- Affichage toutes infos (vidéo, collaborators, tags, gallery)
- Awards si film gagnant (JOIN submissions_awards)
- Liens sociaux cliquables (nouvel onglet)
- Responsive mobile (layout adaptatif)

**Reviews par :** Dev 1, Dev 3

**Durée estimée :** 5-6 jours

---

### 🎨 Feature 15 : CMS Dynamique Complet (11 pts)
**Owner : Dev 5**

**Backend (6 pts) :**
- `services/cmsService.js` : Requêtes SQL (INSERT/UPDATE/DELETE sections_cms, theme_cms, general_cms, cards_cms)
- `controllers/cmsController.js` : CRUD sections, updateTheme, updateGeneral, CRUD cards
- `routes/cms.routes.js` : CRUD complet (admin) + GET /cms/public
- `utils/phaseDetector.js` : getCurrentPhase() (before/during/after selon submissions_end_date)
- `utils/schemas.js` : cmsSectionSchema, themeSchema, generalSchema, cardSchema

**Frontend (5 pts) :**
- `pages/Home.jsx` : Homepage dynamique (rendu sections selon phase + visibility)
- `pages/AdminCMS.jsx` : Gestion CMS (admin) CRUD sections + theme + general + cards
- `components/CMSSection.jsx` : Rendu section selon name (countdown, hero, prizes, agenda, winners, map)
- `components/CountdownTimer.jsx` : Compte à rebours avant fin submissions
- `components/HeroSection.jsx` : Bannière hero avec image + titre + subtitle
- `components/CardsGrid.jsx` : Grille cards CMS (icônes + titre + content)
- `components/ThemeEditor.jsx` : Éditeur couleurs theme (color pickers)
- `hooks/useCMS.js` : Hook gestion CMS
- `hooks/useTheme.js` : Hook application theme (CSS variables)

**Types de sections :**
- `countdown` : Compte à rebours avant fin submissions
- `hero` : Bannière principale (title, subtitle, content)
- `prizes` : Présentation des prix
- `agenda` : Programme événements
- `winners` : Palmarès
- `about` : À propos du festival
- `map` : Carte Google Maps (map_url)
- `cards` : Grille cards CMS

**Tests :**
- Création section countdown (phase = before)
- Changement auto phase (compare date actuelle avec submissions_end_date)
- Rendu homepage selon phase (before affiche countdown, after affiche winners)
- Application theme (CSS variables injectées)
- Toggle visibility sections

**Reviews par :** Dev 3, Dev 4

**Durée estimée :** 6 jours

---

## 📦 SPRINT 4 - Événements + QR Codes + Tests + Deploy (48 pts)
**Tous les devs travaillent en parallèle**

### 📅 Feature 16 : Événements Complets (10 pts)
**Owner : Dev 1 (Toi)**

**Backend (5 pts) :**
- `services/eventService.js` : Requêtes SQL (INSERT/UPDATE/DELETE events, SELECT avec calcul stock disponible)
- `controllers/eventController.js` : CRUD événements, getUpcoming, getPast, getById
- `routes/event.routes.js` : CRUD complet (admin) + GET /events (public), GET /events/upcoming
- `utils/schemas.js` : eventSchema (title, cover, description, start_date, end_date, location, places)
- Calcul stock SQL : `places - (SELECT COUNT(*) FROM reservations WHERE confirmation IS NOT NULL)`

**Frontend (5 pts) :**
- `pages/Events.jsx` : Liste événements (filtres : upcoming, past)
- `pages/EventDetail.jsx` : Détail événement (cover, date, lieu, description, stock restant, bouton réserver)
- `pages/AdminEvents.jsx` : Gestion événements (admin) CRUD
- `components/EventCard.jsx` : Carte événement (cover, date, lieu, stock)
- `components/EventForm.jsx` : Formulaire création/édition événement (datepicker)
- `components/StockIndicator.jsx` : Indicateur places restantes (progress bar + couleur)
- `hooks/useEvents.js` : Hook gestion événements

**Tests :**
- Création événement (titre, date, durée, stock, lieu)
- Liste événements à venir (start_date >= today)
- Affichage stock restant (event.places - COUNT(reservations WHERE confirmation IS NOT NULL))
- Événement complet (stock = 0) → bouton "Complet" désactivé

**Reviews par :** Dev 2, Dev 4

**Durée estimée :** 5 jours

---

### 🎫 Feature 17 : Réservations + QR Codes (15 pts)
**Owner : Dev 2**

**Backend (8 pts) :**
- `services/reservationService.js` : Requêtes SQL (INSERT/UPDATE reservation, SELECT avec JOIN events, vérification stock avec transaction)
- `controllers/reservationController.js` : createReservation, getMyReservations, listByEvent (admin), verifyQR, confirmReservation, cancelReservation
- `routes/reservation.routes.js` : POST /reservations, GET /reservations/my-reservations, GET /admin/reservations/event/:id, GET /reservations/verify/:qrcode, PATCH /reservations/:id/confirm, PATCH /reservations/:id/cancel
- `utils/qrcode.js` : generateQRHash (SHA256), generateQRImage (PNG base64 avec qrcode lib)
- `utils/email.js` : sendConfirmationEmail, sendQRCodeEmail
- `utils/schemas.js` : reservationSchema (first_name, last_name, email)
- **Utilisation de transactions SQL** pour éviter l'overbooking (verrou sur event.places)

**Logique :**
- Vérifier stock disponible avant création
- Générer QR unique : SHA256(event_id + email + timestamp + salt)
- Statut : pending → confirmed (email verified) → attended (QR scanné)
- Gestion stock : event.places - COUNT(reservations WHERE confirmation IS NOT NULL)

**Frontend (7 pts) :**
- `pages/Reservations.jsx` : Mes réservations (liste + QR codes)
- `pages/AdminReservations.jsx` : Liste réservations par événement (admin)
- `components/ReservationForm.jsx` : Formulaire réservation (email, name, lastname)
- `components/QRCodeDisplay.jsx` : Affichage QR code (canvas + téléchargement PNG)
- `components/QRCodeScanner.jsx` : Scanner QR (staff événement, webcam)
- `components/ReservationCard.jsx` : Carte réservation (événement, date, statut, QR)
- `components/CancelButton.jsx` : Bouton annulation avec confirmation
- `hooks/useReservations.js` : Hook gestion réservations
- `hooks/useQRScanner.js` : Hook scanner QR (react-qr-reader)

**Tests :**
- Réservation (first_name, last_name, email)
- Génération QR unique (contrainte UNIQUE en BDD)
- Email confirmation avec QR code
- Vérification QR (statut → attended)
- Gestion stock (pas d'overbooking)
- Annulation réservation (confirmation = NULL, stock libéré)

**Reviews par :** Dev 1, Dev 4

**Durée estimée :** 7-8 jours

---

### 🧪 Feature 18 : Tests Intégration E2E (10 pts)
**Owner : Dev 3**

**Tests d'intégration (10 pts) :**
- Configuration Cypress pour tests E2E
- **Workflow complet** : register → login → submit film → admin validate → selector rate → catalogue public
- **Tests QR codes** : réservation → génération QR → vérification QR → statut attended
- **Tests stock événements** : overbooking impossible
- **Tests assignation** : admin assigne → selector voit film en priorité dans feed
- **Tests awards** : attribution → affichage palmarès + badge catalogue
- **Tests CMS** : changement phase automatique selon date
- **Tests responsive** : mobile, tablet, desktop
- **Tests erreurs** : validations, authentification, autorisations

**Reviews par :** Dev 1, Dev 2

**Durée estimée :** 5 jours

---

### 📚 Feature 19 : Documentation Swagger API (8 pts)
**Owner : Dev 4**

**Documentation complète (8 pts) :**
- Configuration `swagger-jsdoc` + `swagger-ui-express`
- Documentation toutes routes (descriptions, paramètres, réponses, exemples)
- Schémas Zod intégrés dans Swagger
- Exemples de requêtes/réponses pour chaque endpoint
- Documentation authentification (JWT)
- Accessible sur `/api-docs`
- Export collection Postman
- README.md complet (setup, variables env, architecture)

**Reviews par :** Dev 1, Dev 5

**Durée estimée :** 4 jours

---

### 🚀 Feature 20 : Déploiement Production (5 pts)
**Owner : Dev 5**

**Backend (2 pts) :**
- Deploy sur VPS/Heroku/Render (PM2 + Nginx si VPS)
- Configuration environnement production (.env)
- Migration BDD production (exécution `marsAI_DB.sql`)
- Configuration CORS (domaine frontend)
- Logs (Winston) + Error tracking (Sentry)

**Frontend (2 pts) :**
- Deploy sur Vercel/Netlify
- Configuration variables environnement (API URL)
- Optimisation build (lazy loading, code splitting)
- Configuration domaine + HTTPS (Let's Encrypt)

**DevOps (1 pt) :**
- Configuration CI/CD (GitHub Actions)
- Tests automatisés avant deploy
- Scripts migration BDD
- Documentation déploiement (README.md)

**Reviews par :** Tous

**Durée estimée :** 4 jours

---

## 📊 Résumé Répartition par Dev

| Dev | Features Owned | Total Points | Temps estimé |
|-----|----------------|--------------|--------------|
| **Dev 1 (Toi)** | F1 (Auth), F6 (Modération), F11 (Catalogue), F16 (Événements) | 47 pts | ~24 jours |
| **Dev 2** | F2 (Soumissions), F7 (Playlist), F12 (Awards), F17 (QR Codes) | 47 pts | ~24 jours |
| **Dev 3** | F3 (YouTube), F8 (Jury), F13 (Stats), F18 (Tests E2E) | 45 pts | ~22 jours |
| **Dev 4** | F4 (Tags), F9 (Sponsors), F14 (Détail Film), F19 (Swagger) | 32 pts | ~17 jours |
| **Dev 5** | F5 (Design System), F10 (Newsletter), F15 (CMS), F20 (Deploy) | 32 pts | ~17 jours |

**Total : 203 points**
**Durée : 40 jours ouvrés (8 semaines)**
**4 sprints de 10 jours chacun avec 5 devs en parallèle**
**Deadline : 23 mars 2026** ⚠️

---

## 🔄 Matrice de Review (2 reviewers/feature)

| Feature | Owner | Reviewer 1 | Reviewer 2 | Durée review |
|---------|-------|------------|------------|--------------|
| F1 - Auth | Dev 1 | Dev 2 | Dev 3 | 2h |
| F2 - Soumissions | Dev 2 | Dev 1 | Dev 4 | 2.5h |
| F3 - YouTube | Dev 3 | Dev 2 | Dev 4 | 1.5h |
| F4 - Tags | Dev 4 | Dev 1 | Dev 5 | 1h |
| F5 - Design System | Dev 5 | Dev 1 | Dev 2 | 1h |
| F6 - Modération | Dev 1 | Dev 2 | Dev 3 | 2h |
| F7 - Playlist | Dev 2 | Dev 3 | Dev 5 | 1.5h |
| F8 - Jury | Dev 3 | Dev 2 | Dev 4 | 3h |
| F9 - Sponsors | Dev 4 | Dev 1 | Dev 5 | 1h |
| F10 - Newsletter | Dev 5 | Dev 3 | Dev 4 | 1h |
| F11 - Catalogue | Dev 1 | Dev 2 | Dev 5 | 2h |
| F12 - Awards | Dev 2 | Dev 1 | Dev 3 | 1.5h |
| F13 - Stats | Dev 3 | Dev 1 | Dev 4 | 1h |
| F14 - Détail Film | Dev 4 | Dev 1 | Dev 3 | 2h |
| F15 - CMS | Dev 5 | Dev 3 | Dev 4 | 2h |
| F16 - Événements | Dev 1 | Dev 2 | Dev 4 | 1.5h |
| F17 - QR Codes | Dev 2 | Dev 1 | Dev 4 | 2.5h |
| F18 - Tests E2E | Dev 3 | Dev 1 | Dev 2 | 2h |
| F19 - Swagger | Dev 4 | Dev 1 | Dev 5 | 1.5h |
| F20 - Deploy | Dev 5 | Tous | Tous | 2h |

**Total reviews/dev : ~8 reviews** (équilibré)
**Temps total review/dev : ~10-12h par sprint**

---

## 📈 Planning par Sprint

### Sprint 1 (10 jours - 46 pts)
**📅 27 janvier - 7 février 2026**
**Tous les devs travaillent en parallèle**

| Dev | Feature | Backend | Frontend | Review | Durée |
|-----|---------|---------|----------|--------|-------|
| Dev 1 (Toi) | F1 - Auth | 7 pts | 6 pts | 2 reviews | 6j |
| Dev 2 | F2 - Soumissions | 7 pts | 5 pts | 2 reviews | 6j |
| Dev 3 | F3 - YouTube | 5 pts | 4 pts | 2 reviews | 5j |
| Dev 4 | F4 - Tags | 3 pts | 3 pts | 2 reviews | 4j |
| Dev 5 | F5 - Design System | 0 pts | 8 pts | 2 reviews | 4j |

**Parallélisation** : Les 5 features sont développées en parallèle. Aucune dépendance critique.
**Optimisation** : Travail intensif, reviews quotidiennes, pair programming si blocage.

---

### Sprint 2 (10 jours - 47 pts)
**📅 10 février - 21 février 2026**
**Tous les devs travaillent en parallèle**

| Dev | Feature | Backend | Frontend | Review | Durée |
|-----|---------|---------|----------|--------|-------|
| Dev 1 (Toi) | F6 - Modération | 6 pts | 6 pts | 2 reviews | 6j |
| Dev 2 | F7 - Playlist | 4 pts | 6 pts | 2 reviews | 5j |
| Dev 3 | F8 - Jury | 5 pts | 11 pts | 2 reviews | 8j |
| Dev 4 | F9 - Sponsors | 4 pts | 3 pts | 2 reviews | 4j |
| Dev 5 | F10 - Newsletter | 4 pts | 4 pts | 2 reviews | 4j |

**Dépendance** : F6 (Modération) doit être avancée pour que F8 (Jury) puisse accéder aux submissions validées. Dev 1 commence F6 en priorité (jours 1-3), Dev 3 démarre F8 après (jours 3-10).
**Optimisation** : Dev 3 aide Dev 1 sur F6 les 2 premiers jours (pair programming), puis se concentre sur F8.

---

### Sprint 3 (10 jours - 48 pts)
**📅 24 février - 7 mars 2026**
**Tous les devs travaillent en parallèle**

| Dev | Feature | Backend | Frontend | Review | Durée |
|-----|---------|---------|----------|--------|-------|
| Dev 1 (Toi) | F11 - Catalogue | 5 pts | 7 pts | 2 reviews | 6j |
| Dev 2 | F12 - Awards | 5 pts | 5 pts | 2 reviews | 5j |
| Dev 3 | F13 - Stats | 3 pts | 3 pts | 2 reviews | 3j |
| Dev 4 | F14 - Détail Film | 3 pts | 8 pts | 2 reviews | 6j |
| Dev 5 | F15 - CMS | 6 pts | 5 pts | 2 reviews | 6j |

**Parallélisation** : Toutes les features sont développées en parallèle. Aucune dépendance critique.
**Optimisation** : Dev 3 termine F13 rapidement puis aide Dev 4 sur F14 (jours 4-6).

---

### Sprint 4 (10 jours - 48 pts)
**📅 10 mars - 21 mars 2026**
**Tous les devs travaillent en parallèle - SPRINT FINAL**

| Dev | Feature | Backend | Frontend | Review | Durée |
|-----|---------|---------|----------|--------|-------|
| Dev 1 (Toi) | F16 - Événements | 5 pts | 5 pts | 2 reviews | 5j |
| Dev 2 | F17 - QR Codes | 8 pts | 7 pts | 2 reviews | 7j |
| Dev 3 | F18 - Tests E2E | Tests | Cypress | 2 reviews | 5j |
| Dev 4 | F19 - Swagger | Documentation | README | 2 reviews | 4j |
| Dev 5 | F20 - Deploy | Backend + Frontend | DevOps | Tous | 4j |

**Dépendance** : F17 (QR Codes) nécessite F16 (Événements). Dev 1 commence F16 en priorité (jours 1-3), Dev 2 démarre F17 après (jours 3-10).
**Optimisation** : 
- Dev 2 aide Dev 1 sur F16 (jours 1-3) en pair programming
- Jours 8-10 : Tous les devs aident sur deploy et tests finaux
- **22-23 mars : Buffer de 2 jours** pour corrections de bugs critiques

---

## ⚡ Stratégies d'Optimisation pour Tenir les Délais

### 🎯 Deadline : 23 mars 2026 (40 jours ouvrés disponibles)

### 1. Organisation Quotidienne
- **Daily Standup à 9h** (15 min max) : Blocages, avancement, besoin d'aide
- **Reviews en continu** : Pas d'attente, review dans les 2h
- **Pair programming** : 2h/jour sur features complexes ou blocantes
- **Focus time** : 2 blocs de 2h sans interruption par jour

### 2. Gestion des Dépendances
- **F6 → F8** : Dev 3 aide Dev 1 sur Modération (jours 1-2) avant de commencer Jury
- **F16 → F17** : Dev 2 aide Dev 1 sur Événements (jours 1-3) avant de commencer QR Codes
- **Communication proactive** : Slack/Discord pour coordination temps réel

### 3. Réduction du Scope (si nécessaire)
**Features optionnelles** (peuvent être simplifiées ou repoussées) :
- F13 - Stats : Version basique uniquement (sans graphiques complexes)
- F10 - Newsletter : Inscription uniquement (envoi peut attendre)
- F9 - Sponsors : Version simple (CRUD uniquement, pas d'affichage homepage)

**Features critiques** (ne pas toucher) :
- F1 - Auth (obligatoire pour tout)
- F2 - Soumissions (cœur du projet)
- F6 - Modération (validation submissions)
- F8 - Jury (notation)
- F11 - Catalogue (affichage public)

### 4. Accélérateurs
- **Réutilisation de code** : Composants React génériques (forms, modals, cards)
- **Libs testées** : Pas de réinvention de la roue (react-hook-form, shadcn/ui, etc.)
- **Templates backend** : Structure de controller standardisée
- **Tests pragmatiques** : Focus sur les flows critiques uniquement

### 5. Buffer de Sécurité
- **22-23 mars** (2 jours) : Corrections bugs critiques + polish
- Si en avance : Amélioration UX/UI, optimisation performances
- Si en retard : Priorisation ruthless des features critiques

### 6. Planning de Secours (si dépassement)
**Si retard de 2-3 jours :**
- Travailler 1 samedi (jour supplémentaire)
- Simplifier F10 (Newsletter) et F9 (Sponsors)
- Repousser F13 (Stats) après le 23 mars

**Si retard de 5+ jours :**
- Meeting d'urgence : réévaluation du scope
- Garder uniquement : F1, F2, F6, F8, F11, F16, F17, F20
- Repousser : F5, F9, F10, F13, F14, F15, F19

---

## 🎯 Avantages de cette Répartition

### ✅ Pour les Devs
- **Ownership clair** : "C'est MA feature, je la gère de A à Z"
- **Cohérence** : Même dev fait l'API et l'UI (synchronisation parfaite)
- **Motivation** : Fierté de livrer une feature complète fonctionnelle
- **Apprentissage full-stack** : Vraie expérience back + front
- **CV** : "Développé la feature Auth complète (JWT + React + Tests)"

### ✅ Pour le Projet
- **Moins de dépendances** : Pas d'attente entre devs
- **Communication simplifiée** : 1 feature = 1 interlocuteur
- **Déploiement progressif** : Feature testable individuellement
- **Hotfix rapide** : Owner corrige les bugs de sa feature
- **Qualité** : Dev responsable de bout en bout

### ✅ Pour les Reviews
- **Review holistique** : Reviewer voit tout le flow (back + front + tests)
- **Feedback pertinent** : Comprend l'intention complète de la feature
- **Tests E2E** : Reviewer peut tester la feature en entier
- **Pas de ping-pong** : Moins d'allers-retours

---

## 📝 Checklist Feature (Definition of Done)

### Backend ✅
- [ ] Routes créées et documentées (Swagger)
- [ ] Modèles + controllers implémentés
- [ ] Validation Zod sur tous les inputs
- [ ] Tests Postman passent (collection complète)
- [ ] Gestion erreurs (400, 401, 403, 404, 422, 500)
- [ ] Code review approuvé (2 reviewers)

### Frontend ✅
- [ ] Pages/composants créés et fonctionnels
- [ ] Hooks custom si nécessaire
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Accessibilité (ARIA labels, alt text)
- [ ] Loading states + error handling
- [ ] Tests E2E Cypress passent
- [ ] Code review approuvé (2 reviewers)

### Tests ✅
- [ ] Tests unitaires backend (si logique complexe)
- [ ] Tests API Postman (collection complète)
- [ ] Tests E2E frontend (Cypress)
- [ ] Scénarios nominaux + erreurs testés

### Documentation ✅
- [ ] README.md à jour (setup, env vars)
- [ ] Swagger : routes documentées
- [ ] Commentaires code si logique complexe
- [ ] Guide utilisateur si nécessaire

### Démo ✅
- [ ] Démo fonctionnelle en Sprint Review
- [ ] Feature merge sur `develop`
- [ ] Annonce équipe (Slack/Discord)

---

## 💡 Conseils par Feature Owner

### Organisation du Travail
1. **Jour 1-2** : Backend (30% du temps)
   - Créer modèles + routes + controllers
   - Tester avec Postman
   - **Review backend** par 1 dev pendant développement

2. **Jour 3-5** : Frontend (50% du temps)
   - Créer pages + composants
   - Connecter à l'API
   - **Review frontend** par 1 dev pendant développement

3. **Jour 6** : Tests + Corrections (20% du temps)
   - Tests E2E Cypress
   - Corrections bugs
   - **Review finale** par 2 devs

### Communication
- **Daily Standup** : "F1 Auth - Backend 80% fait, commence le front Login demain"
- **Bloqué ?** : Demander aide (pair programming 1h)
- **Feature terminée** : Annonce + démo courte à l'équipe

### Pair Programming Recommandé
- **Première fois backend** : 2h avec dev expérimenté
- **Première fois frontend** : 2h avec dev expérimenté
- **Feature complexe** : 4h avec autre dev (ex: Jury TikTok, QR Codes)

---

## 🛠️ Stack Technique Recommandée

### Backend
- **Framework** : Express.js
- **Base de données** : MySQL 8.0+ avec **mysql2** (pas d'ORM)
- **Connection Pool** : mysql2/promise avec pool de connexions
- **Architecture** : Services → Controllers → Routes (pas de Models ORM)
- **Validation** : Zod
- **Auth** : jsonwebtoken
- **Upload** : Multer
- **Email** : Nodemailer + SendGrid
- **QR Code** : qrcode
- **Documentation** : swagger-jsdoc + swagger-ui-express

**Note importante** : 
- Toutes les interactions BDD se font via **requêtes SQL directes**
- Layer `services/` contient les fonctions avec requêtes SQL
- Utilisation de **transactions** pour opérations critiques (submissions, réservations)
- **Prepared statements** pour prévenir les injections SQL

### Frontend
- **Framework** : React + Vite
- **Router** : React Router v6
- **State** : Context API + Hooks
- **HTTP** : Axios
- **Forms** : React Hook Form + Zod
- **UI** : TailwindCSS + Headless UI
- **Animations** : Framer Motion
- **Swipe** : react-swipeable
- **Video** : react-player
- **QR** : react-qr-reader
- **Charts** : Recharts

### Tests
- **API** : Postman
- **E2E** : Cypress
- **Unitaires** : Jest (si nécessaire)

### DevOps
- **Backend** : VPS (PM2 + Nginx) ou Heroku/Render
- **Frontend** : Vercel/Netlify
- **BDD** : MySQL 8.0+
- **CI/CD** : GitHub Actions
- **Monitoring** : Winston + Sentry

---

## 📚 Structure Projet Recommandée

```
MarsAI-Bordeaux-Pokemons/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db_config.js (config MySQL)
│   │   │   ├── db_pool.js (pool mysql2/promise)
│   │   │   └── jwt.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── submissionController.js
│   │   │   ├── moderationController.js
│   │   │   ├── selectorController.js
│   │   │   ├── catalogueController.js
│   │   │   ├── awardController.js
│   │   │   ├── cmsController.js
│   │   │   ├── eventController.js
│   │   │   ├── reservationController.js
│   │   │   ├── sponsorController.js
│   │   │   ├── newsletterController.js
│   │   │   └── statsController.js
│   │   ├── services/ (requêtes SQL directes)
│   │   │   ├── userService.js
│   │   │   ├── roleService.js
│   │   │   ├── submissionService.js
│   │   │   ├── collaboratorService.js
│   │   │   ├── galleryService.js
│   │   │   ├── moderationService.js
│   │   │   ├── selectorService.js
│   │   │   ├── tagService.js
│   │   │   ├── catalogueService.js
│   │   │   ├── awardService.js
│   │   │   ├── sponsorService.js
│   │   │   ├── socialService.js
│   │   │   ├── cmsService.js
│   │   │   ├── eventService.js
│   │   │   ├── reservationService.js
│   │   │   ├── newsletterService.js
│   │   │   └── statsService.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── submission.routes.js
│   │   │   ├── moderation.routes.js
│   │   │   ├── selector.routes.js
│   │   │   ├── catalogue.routes.js
│   │   │   ├── award.routes.js
│   │   │   ├── cms.routes.js
│   │   │   ├── event.routes.js
│   │   │   ├── reservation.routes.js
│   │   │   ├── sponsor.routes.js
│   │   │   ├── newsletter.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── stats.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validate.js
│   │   │   ├── upload.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── schemas.js (Zod)
│   │   │   ├── youtube.js
│   │   │   ├── qrcode.js
│   │   │   ├── email.js
│   │   │   └── phaseDetector.js
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.jsx (admin/selector uniquement)
│   │   │   ├── Submit.jsx (public - formulaire sans compte)
│   │   │   ├── AdminModeration.jsx
│   │   │   ├── SelectorFeed.jsx
│   │   │   ├── SelectorPlaylist.jsx
│   │   │   ├── Catalogue.jsx (public)
│   │   │   ├── FilmDetail.jsx (public)
│   │   │   ├── Winners.jsx (public)
│   │   │   ├── Home.jsx (public)
│   │   │   ├── Events.jsx (public)
│   │   │   ├── EventDetail.jsx (public)
│   │   │   ├── Reservations.jsx (public)
│   │   │   └── AdminCMS.jsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── db/
│   ├── marsAI_DB.sql
│   └── marsAI_DB.png
└── README.md
```

---

---

## 📊 KPIs de Suivi (Daily Tracking)

### Indicateurs à Suivre Quotidiennement

**1. Vélocité par Sprint**
- **Objectif** : 11.5 pts/jour en moyenne (46-48 pts / 10 jours)
- **Mesure** : Points complétés par jour
- **Alerte** : Si < 10 pts/jour pendant 2 jours consécutifs

**2. Features Complètes**
- **Objectif** : 5 features par sprint (1 feature/dev)
- **Mesure** : Nombre de features "Done" (backend + frontend + tests + review)
- **Alerte** : Si < 3 features complètes à J+7 du sprint

**3. Blocages**
- **Objectif** : 0 blocage > 4h
- **Mesure** : Nombre de blocages actifs et durée
- **Action** : Pair programming immédiat si blocage > 2h

**4. Code Review Delay**
- **Objectif** : < 2h de délai moyen
- **Mesure** : Temps entre PR et merge
- **Alerte** : Si délai > 4h

**5. Tests Passants**
- **Objectif** : 100% des tests backend passent
- **Mesure** : Ratio tests passants / total
- **Alerte** : Si < 95%

### Dashboard Hebdomadaire (Fin de Sprint)

```
Sprint X - Semaine du XX au XX
┌──────────────────────────────────────────────────────┐
│ ✅ Features complètes    : 4/5 (80%)                │
│ ⚠️ Features en cours     : 1   (Dev 2 - QR Codes)  │
│ 📊 Points complétés      : 42/48 (87.5%)           │
│ 🐛 Bugs critiques        : 2                        │
│ ⏱️ Délai review moyen    : 1.5h                    │
│ 🔥 Blocages résolus      : 3 (moy: 1.2h)           │
└──────────────────────────────────────────────────────┘

Actions pour Sprint X+1 :
- Dev 2 : Finaliser F17 en priorité (2j)
- Tous : Daily à 9h sharp (pas de retard)
- Code freeze à J+9 pour reviews finales
```

### Red Flags à Surveiller 🚨

- ⚠️ **Sprint retard > 2 jours** → Réunion urgente + réduction scope
- ⚠️ **Dev bloqué > 4h** → Pair programming immédiat
- ⚠️ **Bugs critiques > 5** → Journée dédiée bug fixing
- ⚠️ **Tests < 90%** → Freeze nouvelles features
- ⚠️ **Merge conflicts > 10/jour** → Revoir stratégie de branches

---

## 🎯 Recommandations Finales pour Réussir

### ✅ Do's (À FAIRE)

1. **Communication constante**
   - Daily standup obligatoire à 9h (15 min max)
   - Slack/Discord actif pour questions rapides
   - Signaler les blocages immédiatement (pas d'attente)

2. **Qualité vs Vitesse**
   - Code propre mais pas parfait (éviter over-engineering)
   - Tests sur flows critiques uniquement
   - Reviews rapides (2h max) mais constructives

3. **Priorisation ruthless**
   - Features critiques d'abord (Auth, Soumissions, Modération, Jury, Catalogue)
   - Features "nice to have" en dernier (Stats, Newsletter, Sponsors)
   - Accepter de simplifier si nécessaire

4. **Pair programming stratégique**
   - 2h/jour sur parties complexes
   - Débloquer les collègues rapidement
   - Partager les connaissances

5. **Git discipline**
   - Commits fréquents (plusieurs fois/jour)
   - Branches features courtes (max 2 jours)
   - Merge régulier de `develop` pour éviter conflicts

### ❌ Don'ts (À ÉVITER)

1. **Ne PAS attendre d'avoir "tout parfait"**
   - Livrer des features fonctionnelles, pas parfaites
   - Éviter le "syndrome de la page blanche"

2. **Ne PAS travailler en silos**
   - Communiquer son avancement quotidiennement
   - Demander de l'aide rapidement si bloqué

3. **Ne PAS ignorer les warnings**
   - Traiter les bugs au fur et à mesure
   - Ne pas accumuler de dette technique

4. **Ne PAS changer le scope en cours de sprint**
   - Finir ce qui est commencé
   - Noter les idées pour après le 23 mars

5. **Ne PAS sacrifier le sommeil**
   - 40 jours de sprint, pas de marathon
   - Mieux vaut travailler efficacement 8h que mal 12h

---

## 🚀 Message Final

**Ce planning est ambitieux mais réalisable** si :
- ✅ Toute l'équipe est engagée et disciplinée
- ✅ La communication est fluide et rapide
- ✅ Les priorités sont claires (features critiques d'abord)
- ✅ L'entraide est la norme (pas de compétition)
- ✅ On accepte de simplifier si nécessaire

**Deadline : 23 mars 2026 - On peut y arriver ! 💪**

---

**Document créé pour MarsAI-Bordeaux-Pokemons - Répartition par fonctionnalité**
*1 Dev = 1 Feature complète (Back + Front + Tests) | Ownership clair et cohérent*
*Équipe de 5 devs | 20 features | 203 points | 40 jours (8 semaines)*
*⚠️ Deadline stricte : 23 mars 2026*
