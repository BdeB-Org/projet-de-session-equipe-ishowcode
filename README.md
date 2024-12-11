# LAZULI
Lazuli est un simulateur de cryptomonnaies conçu pour reproduire les dynamiques du marché crypto dans un environnement sécurisé. Il permet aux utilisateurs de simuler des transactions, de tester des stratégies d'investissement et d'analyser les fluctuations des cours sans risquer de capital réel. Lazuli est un outil pédagogique idéal pour les débutants souhaitant apprendre le fonctionnement des cryptomonnaies, ainsi qu'un laboratoire pour les traders expérimentés cherchant à affiner leurs tactiques.



<img width="959" alt="Page D'accueil"  src="https://github.com/user-attachments/assets/1a83d4b2-6801-49af-ad2a-cc7d4dc940e2">


Pour exécuter **Lazuli**, voici les étapes générales à suivre :

### Prérequis :
- **Node.js** installé
- **npm** ou **yarn** pour gérer les dépendances

### Étapes :

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/BdeB-Org/projet-de-session-equipe-ishowcode
   ```

2. **Naviguer dans le répertoire du projet :**

   ```bash
   cd lazuli
   ```

3. **Installer les dépendances :**

   Si vous utilisez **npm** :
   ```bash
   npm install
   ```

   Ou avec **yarn** :
   ```bash
   yarn install
   ```

4. **Configurer les variables d'environnement (SAUTER POUR LE MOMENT):**

   Assurez-vous que toutes les variables d'environnement requises par Lazuli sont correctement définies. Vous pouvez le faire en créant un fichier `.env.local` à la racine du projet et en y ajoutant les variables.

5. **Lancer l'application en mode développement :**

   Avec **npm** :
   ```bash
   npm run dev
   ```

   Ou avec **yarn** :
   ```bash
   yarn dev
   ```

6. **Accéder à l'application :**

   Ouvrez votre navigateur et allez à l'URL suivante :
   ```bash
   http://localhost:3000
   ```

<h2>Présentation des pages de Lazuli</h2>

 **Présentation de la page Page Accueil :**

 Sur la page d'accueil, les nouveaux utilisateurs peuvent créer un compte, tandis que les membres existants peuvent se connecter. De plus, un bouton d'assistance vous permet de poser des questions à Gemini, et vous pouvez accéder à la page "À propos" ou "Aide".


<img width="959" alt="Page D'accueil"  src="https://github.com/user-attachments/assets/1a83d4b2-6801-49af-ad2a-cc7d4dc940e2">




 **Présentation de la page Création d'un Compte :**

Sur la page de création de compte, l'utilisateur peut créer un compte sur Lazuli en remplissant le formulaire. Dans ce formulaire, vous devez inclure votre prénom, nom, adresse courriel, ainsi qu'un mot de passe comportant au moins 8 caractères, incluant une lettre majuscule, un caractère spécial et un chiffre. De plus, vous devez confirmer le mot de passe pour valider la création du compte. Si l'utilisateur possède déjà un compte, il peut cliquer sur le lien pour se connecter.



<img width="959" alt="Page Devenir un membre" src="https://github.com/user-attachments/assets/19658067-bbde-4a8b-929c-df5904502d80">




  **Présentation de la Page Se Connecter :**

Sur la page de connexion, l'utilisateur doit saisir son adresse courriel et son mot de passe pour accéder à son compte Lazuli. Si l'utilisateur a oublié son mot de passe, il peut le réinitialiser en cliquant sur le lien "Mot de passe oublié".

<img width="959" alt="Page Se Connecte" src="https://github.com/user-attachments/assets/317d8f83-9527-4f55-aa13-f181f5c42339">



 **Présentation de la Page À propos :**

Sur la page "À propos", nous expliquons qui nous sommes et quels sont nos objectifs.


<img width="959" alt="Page À propos" src="https://github.com/user-attachments/assets/7abb5166-e88b-4636-b346-52e4135a5655">



 **Présentation de la Page Aide :**

Dans la page aide, vous pouvez cherchez des informations sur les fonctionnalités sur le site.

<img width="959" alt="page Aide" src="https://github.com/user-attachments/assets/7bf765c3-1657-4478-b809-baf7a6f367a2">


**Présentation de la Page Dashboard :**

Sur la page dashboard, l'utilisateur peut consulter son solde et accéder à diverses options telles qu'acheter, vendre, convertir des cryptomonnaies, effectuer un dépôt et encore. De plus, l'utilisateur peut accéder à sa page de transactions, à son profil, ou se déconnecter de son compte.

<img width="959" alt="Page Dashboard"  src="https://github.com/user-attachments/assets/41d6758f-85a6-4cbb-9d16-26d53f853ad0">




**Présentation de la Page Transaction :**

Sur la page des transactions, l'utilisateur peut consulter l'historique de ses achats et ventes de crytpo.

<img width="959" alt="Page Transaction"  src="https://github.com/user-attachments/assets/f00052b0-7fd5-4045-9172-fa53b12b11e8">



**Présentation de la Page Profil :**

Sur la page de profil, l'utilisateur peut consulter ses informations personnelles, avec la possibilité de modifier son profil ou de supprimer son compte.

<img width="959" alt="Page Profil"  src="https://github.com/user-attachments/assets/e6834ba6-4df4-4e4f-8c63-05d0835526b6">



**Présentation de la Page Explorer :**

Sur la page Explorer, l'utilisateur peut consulter les cryptomonnaies disponibles à l'achat (les transactions se font en unités de cryptomonnaie, et non en dollars). De plus, la cryptomonnaie ayant enregistré la plus grande hausse de la journée est également mise en avant.

<img width="959" alt="Explorer Crypto"  src="https://github.com/user-attachments/assets/d33b4c50-4cda-4291-9509-398b2ee93cc5">


Lorsqu'un utilisateur sélectionne une cryptomonnaie, il a la possibilité de l'acheter ou de la vendre. Il peut également consulter des informations supplémentaires sur la cryptomonnaie choisie.

<img width="959" alt="Acheter Crypto"  src="https://github.com/user-attachments/assets/277c570a-e8cd-4720-b857-b422b2a80e7d">


**Présentation du Page Dépôt :**

Dans la page de dépôt, l'utilisateur peut ajouter un montant de son choix à son solde. De plus, il a la possibilité de consulter son solde actuel et de le réinitialiser si nécessaire.

<img width="959" alt="Dépôt d'Argent" src="https://github.com/user-attachments/assets/e42e0789-3079-48a2-8c9b-ee58bf875f02">


**Présentation de la page Quiz d'Investissement :**

Dans la page Quiz d'Investissement, l'utilisateur peut déterminer son profil d'investisseur en répondant à un ensemble de questions. Une fois le quiz terminé, la réponse est générée et communiquée par Gemini.

<img width="959" alt="Quiz d'Investissement" src="https://github.com/user-attachments/assets/61e8ee96-bdcb-4dd9-be21-f75bd316775e">



**Présentation de la Page Modification Profil :**

Dans la page de modification du profil, l'utilisateur peut mettre à jour ses informations personnelles, telles que son nom, sa date de naissance, sa devise (CAD, USD, EUR, GBP, IDR) et son mot de passe.

<img width="959" alt="Page Modification Profil" src="https://github.com/user-attachments/assets/bfaf542d-9ec2-408a-8670-aea229790046">


**Présentation de la Page Réinitialiser votre Mot de Passe :**

Dans la page de réinitialisation du mot de passe, si l'utilisateur a oublié le mot de passe de son compte, il peut entrer son adresse courriel pour recevoir un lien permettant de le modifier.

<img width="959" alt=" Page Réinitialiser votre mot de passe" src="https://github.com/user-attachments/assets/380ca364-f537-4c46-964f-08c47e792910">

<img width="959" alt="Changer MDP" src="https://github.com/user-attachments/assets/dca5e856-b007-4cdd-a979-6d051ae27ec1">


