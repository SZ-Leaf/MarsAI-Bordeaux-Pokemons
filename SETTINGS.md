# 🌿 Convention de nommage des branches GitHub

## 🧠 Règles générales

- Utiliser **l’anglais**
- Utiliser uniquement des **lettres minuscules**
- Séparer les mots avec des **tirets (`-`)**
- Les noms de branches doivent être **courts, explicites et lisibles**
- Pas d’espaces, pas de caractères spéciaux

---

## 🧩 Format général

```txt
--<scope>-<description>
```

## 🎨 Branches Front-end

```text
--front-<nom-de-la-branche>
```

## 🛠️ Branches Back-end

```text
--back-<nom-de-la-branche>
```

# 📁 Convention de nommage des fichiers

Ce document définit les règles de nommage des fichiers utilisées au sein de l’équipe de développement afin d’assurer cohérence, lisibilité et maintenabilité du code.

---

## 🧩 Règles générales

- Les noms de fichiers doivent être **clairs**, **descriptifs** et **prévisibles**
- Utiliser **l’anglais** pour tous les noms de fichiers
- Éviter les abréviations ambiguës
- Un seul style de nommage par type de fichier

---

## ⚛️ Fichiers JSX (React)

- **Format** : `PascalCase`

### ✅ Exemple

```text
UserProfile.jsx
```



## 📄 Fichiers JavaScript, HTML et CSS

- **Format** : `snake_case`

### ✅ Exemple
```text
example_fichier.js
```


## 🏗️ Fichiers à responsabilité spécifique  

Les fichiers représentant un rôle ou une responsabilité spécifique doivent suivre le format :

```text
<nom_en_snake_case>.<type>.js
```

### 📌 Types courants
- `controller`
- `service`
- `middleware`
- `repository`
- `validator`
- `helper`

<br>
<br>

# 🔤 Convention de nommage des variables

## 🧩 Variables

- **Format** : `camelCase`

### ✅ Exemple
```js
let userName;
```

<br>
<br>

# ⚙️ Convention de nommage des fonctions

## 🧩 Fonctions standards

- Verbe + complément
- Le nom doit permettre de comprendre ce que fait la fonction **sans lire son implémentation**

### ✅ Exemples
```js
function getUserById(id) {}
function createOrder(data) {}
function updateUserProfile(profile) {}
function deleteSession(token) {}
```



