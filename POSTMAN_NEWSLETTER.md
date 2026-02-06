# Tester les routes Newsletter avec Postman

### 1. Route publique : inscription

- **POST** `{{baseUrl}}/newsletter/subscribe`
- **Body (JSON) :**
  ```json
  {
    "email": "test@example.com",
    "consent": true
  }
  ```
- **Réponse attendue :** `201` avec `success: true`, message "Vérifiez votre email pour confirmer".
- **À faire :** Aller sur Mailtrap, ouvrir l’email reçu et copier le **token** dans le lien (partie après `/newsletter/confirm?token=`). Le coller dans la variable de collection `confirmToken` pour l’étape suivante.  
  Pour **unsubscribe** plus tard : en BDD, récupérer `unsubscribe_token` de la ligne dans `newsletter_listings` pour cet email, ou utiliser le lien de désinscription dans un email de newsletter envoyé.

### 2. Route publique : confirmation (double opt-in)

- **GET** `{{baseUrl}}/newsletter/confirm?token={{confirmToken}}`
- Remplacer `{{confirmToken}}` par le token copié depuis l’email (ou la variable si vous l’avez remplie).
- **Réponse attendue :** `200`, "Inscription confirmée".

### 3. Admin : créer une newsletter

- **POST** `{{baseUrl}}/newsletter/admin`
- **Body (JSON) :**
  ```json
  {
    "title": "Ma première newsletter",
    "subject": "Bienvenue sur MarsAI",
    "content": "<h1>Bonjour</h1><p>Contenu HTML...</p>"
  }
  ```
- **Réponse attendue :** `201` avec `data.newsletter` (contient `id`).
- **À faire :** Noter l’`id` et le mettre dans la variable `newsletterId` de la collection.

### 4. Admin : lister les newsletters

- **GET** `{{baseUrl}}/newsletter/admin`
- Optionnel : `?status=draft` ou `?status=sent`, `limit`, `offset`.

### 5. Admin : détail d’une newsletter

- **GET** `{{baseUrl}}/newsletter/admin/{{newsletterId}}`
- Utiliser l’id d’une newsletter existante.

### 6. Admin : modifier une newsletter

- **PATCH** `{{baseUrl}}/newsletter/admin/{{newsletterId}}`
- **Body (JSON) :** `title`, `subject`, `content`, `status` (optionnel, `draft` ou `sent`).

### 7. Admin : envoyer la newsletter

- **POST** `{{baseUrl}}/newsletter/admin/{{newsletterId}}/send`
- Nécessite au moins un abonné **confirmé** et **non désinscrit** (voir étape 2).
- **Réponse attendue :** `200` avec `sent`, `failed`, `total`.

### 8. Admin : statistiques d’envoi

- **GET** `{{baseUrl}}/newsletter/admin/{{newsletterId}}/stats`
- Après un envoi : total envoyé, succès, échecs, taux de succès.

### 9. Admin : lister les abonnés

- **GET** `{{baseUrl}}/newsletter/admin/subscribers`
- Optionnel : `?confirmed=1`, `?unsubscribed=0`, `limit`, `offset`.
- Pour supprimer un abonné : noter son `id` et le mettre dans `subscriberId`.

### 10. Admin : supprimer un abonné

- **DELETE** `{{baseUrl}}/newsletter/admin/subscribers/{{subscriberId}}`

### 11. Route publique : désinscription

- **GET** `{{baseUrl}}/newsletter/unsubscribe?token={{unsubscribeToken}}`
- `unsubscribeToken` : dans l’email envoyé (lien "Se désinscrire") ou colonne `unsubscribe_token` en BDD pour cet email.

### 12. Admin : supprimer une newsletter

- **DELETE** `{{baseUrl}}/newsletter/admin/{{newsletterId}}`

