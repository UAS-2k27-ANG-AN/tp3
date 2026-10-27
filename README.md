# User Manager API

Application web réalisée avec Angular pour consulter et gérer une liste d’utilisateurs. Le projet met en pratique l’injection de dépendances, les services Angular, les requêtes HTTP et les formulaires réactifs.

## 1. Objectifs du projet

- Récupérer des utilisateurs depuis une API REST.
- Afficher les utilisateurs et leurs informations.
- Rechercher un utilisateur par nom, identifiant, adresse e-mail ou entreprise.
- Ajouter, modifier et supprimer un utilisateur.
- Séparer l’interface, les données et les appels HTTP à l’aide de composants, modèles et services.

## 2. Technologies utilisées

- **Angular 20** et **TypeScript** pour l’application.
- **HttpClient** pour communiquer avec l’API.
- **RxJS** et les `Observable` pour traiter les réponses HTTP.
- **Reactive Forms** pour les formulaires d’ajout et de modification.
- **JSONPlaceholder** comme API REST de démonstration.
- **HTML et CSS** pour l’interface et son thème rose clair.

## 3. Préparer l’environnement

Installez une version récente de Node.js et npm, puis ouvrez un terminal dans le dossier du projet. Installez les dépendances avec :

```bash
npm install
```

Les dépendances du projet sont déclarées dans `package.json` et leurs versions exactes sont consignées dans `package-lock.json`.

## 4. Étapes de réalisation

### Étape 1 — Démarrer l’application Angular

Le fichier `src/main.ts` démarre l’application avec `bootstrapApplication`. Il fournit `HttpClient` pour autoriser les requêtes HTTP et le routeur Angular. L’application utilise un composant racine autonome (`standalone`).

### Étape 2 — Définir la structure d’un utilisateur

Dans `src/app/user.model.ts`, les interfaces `User`, `Address`, `Company` et `Geo` décrivent la structure des données reçues de l’API. Le type `UserPayload` correspond aux données d’un utilisateur sans son identifiant. La fonction `emptyUser()` fournit des valeurs initiales pour le formulaire.

### Étape 3 — Configurer l’adresse de l’API

`src/app/app.config.ts` définit le jeton d’injection `API_URL`. Sa valeur par défaut est `https://jsonplaceholder.typicode.com`. Le service reçoit cette URL par injection, ce qui évite de la répéter dans chaque requête.

### Étape 4 — Centraliser les requêtes dans un service

`src/app/user.service.ts` contient les méthodes HTTP :

| Méthode | Requête | Rôle |
|---|---|---|
| `getUsers()` | `GET /users` | Charger la liste |
| `getUser(id)` | `GET /users/{id}` | Charger un utilisateur |
| `createUser(user)` | `POST /users` | Créer un utilisateur |
| `updateUser(id, user)` | `PUT /users/{id}` | Modifier un utilisateur |
| `deleteUser(id)` | `DELETE /users/{id}` | Supprimer un utilisateur |

Le service retourne des `Observable`. Le composant s’y abonne pour recevoir la réponse ou traiter une erreur.

### Étape 5 — Construire le composant et l’interface

`src/app/app.component.ts` gère l’état de l’écran : la liste complète et filtrée, l’utilisateur sélectionné, l’état de chargement, le formulaire et les messages de confirmation ou d’erreur. Au démarrage (`ngOnInit`), il appelle `loadUsers()`.

Le modèle HTML `src/app/app.component.html` affiche le titre, les statistiques, la liste, la recherche et le panneau de détails ou de formulaire. `src/styles.css` contient les styles globaux, dont les couleurs roses et le fond clair.

### Étape 6 — Ajouter la recherche

La saisie dans le champ de recherche appelle `applyFilter()`. La recherche ignore la casse et parcourt le nom, le nom d’utilisateur, l’e-mail et le nom de l’entreprise.

### Étape 7 — Créer et modifier des utilisateurs

Le composant utilise un formulaire réactif construit avec `FormBuilder`. Le nom, le nom d’utilisateur et l’e-mail sont obligatoires ; l’e-mail doit avoir un format valide. La méthode `save()` vérifie le formulaire, construit les données attendues par l’API, puis appelle `createUser()` ou `updateUser()` selon le contexte.

### Étape 8 — Supprimer un utilisateur

La méthode `remove()` demande une confirmation, envoie la requête de suppression et retire l’utilisateur de la liste affichée après réussite.

## 5. Lancer et tester l’application

Démarrez le serveur de développement :

```bash
npm start
```

Ouvrez ensuite **http://localhost:4200** dans votre navigateur. Vous pouvez aussi ouvrir cette adresse dans Brave. Gardez le terminal ouvert pendant l’utilisation de l’application ; Angular actualise la page après les changements de fichiers.

Pour tester les fonctionnalités :

1. Attendez le chargement des utilisateurs depuis JSONPlaceholder.
2. Sélectionnez un utilisateur pour consulter ses informations.
3. Saisissez un nom, un e-mail ou une entreprise dans la recherche.
4. Utilisez **Modifier** pour changer les champs, puis **Enregistrer**.
5. Utilisez **Nouvel utilisateur** pour ouvrir un formulaire vierge et le remplir.
6. Utilisez **Supprimer** et confirmez la demande.

## 6. Construire l’application

Pour générer une version de production :

```bash
npm run build
```

Les fichiers générés sont placés dans `dist/user-manager-api`.

## 7. Arborescence utile

```text
src/
├── app/
│   ├── app.component.html   # Interface
│   ├── app.component.ts     # État, formulaire et actions
│   ├── app.config.ts        # URL de l’API
│   ├── user.model.ts        # Modèles TypeScript
│   └── user.service.ts      # Requêtes HTTP
├── index.html               # Document HTML principal
├── main.ts                  # Démarrage Angular et fournisseurs
└── styles.css               # Styles globaux et thème
```

## 8. Remarque sur JSONPlaceholder

JSONPlaceholder est une API de démonstration. Elle simule les opérations de création, modification et suppression et renvoie des réponses, mais ne conserve généralement pas ces changements comme une vraie base de données. Après un rechargement, les données d’origine peuvent réapparaître.
