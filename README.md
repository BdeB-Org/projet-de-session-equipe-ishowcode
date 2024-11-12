# LAZULI
Lazuli est un simulateur de cryptomonnaies conçu pour reproduire les dynamiques du marché crypto dans un environnement sécurisé. Il permet aux utilisateurs de simuler des transactions, de tester des stratégies d'investissement et d'analyser les fluctuations des cours sans risquer de capital réel. Lazuli est un outil pédagogique idéal pour les débutants souhaitant apprendre le fonctionnement des cryptomonnaies, ainsi qu'un laboratoire pour les traders expérimentés cherchant à affiner leurs tactiques.



<img width="959" alt="Page accueil" src="https://github.com/user-attachments/assets/b0a3bc51-9395-45a7-ae47-52ea782ae0ba">



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

##Présentation des pages de Lazuli

 **Présentation du page Page Accueil :**

 Dans la page d'acceuil, vous pouvez créer un compte si vous etes un nouveau utilisateur, sinon si vous êtes déja un membre vous pouvez vous connecter. Vous pouvez modifier l'apparence du site avec le mode sombre ou mode clair. De plus, il y a un bouton d'assistance où vous pouvez demander des questions à Gemini et il y a option de voir la page a propos ou d'avoir de l'aide.


<img width="959" alt="Page D'accueil" src="https://github.com/user-attachments/assets/d3a7d52b-a435-4d3b-a86d-9e228652d57a">




 **Présentation du page Creation un Compte :**

Dans la page creation un compte, l'utilisateur peut créer un compte sur Lazuli en remplir le formulaire. Dans le formulaire, vous devez inclure votre Prénom,Nom,Adresse courriel, un mot de passe avec un minimum de 8 caractères, un lettre majuscule, un caractère speciale, un chiffre. De plus, vous devez récrir le mot passe pour assurer la création du compte. Si l'utilisateur a déja un compte , il peut aller dans le lien pour se connecter.


<img width="959" alt="Page Devenir un membre" src="https://github.com/user-attachments/assets/d7c59df8-f79e-49a9-a48e-28f63f048060">



  **Présentation du Page Se Connecter :**

Dans la page se connecter, l'utilisateur doit rentrer son courriel et son mot de passe pour accéder à son compte de Lazuli. Si l'utilisateur à oublier son mot de passe alors il peut le réinitialiser avec le lien mot passe oublié.

<img width="959" alt="Page Se Connecte" src="https://github.com/user-attachments/assets/51f42f24-ca8a-4adf-9ab3-f5a15b9beca5">


 **Présentation du Page À propos :**

Dans la page à propos, on explique qui nous sommes et c'est quoi notre but.

<img width="959" alt="Page À propos" src="https://github.com/user-attachments/assets/a2bf4469-4491-460e-8b01-df9a2b0be3f9">



 **Présentation du Page Aide :**

Dans la page aide, vous pouvez cherchez des informations sur les fonctionnalités sur le site.

<img width="959" alt="page Aide" src="https://github.com/user-attachments/assets/11f58c0a-f9f5-4753-9330-7a4081324617">



**Présentation du Page Dashboard :**

Dans la page du dashboard, l'utilisateur peut voir l'argent qu'il a et il a des options pour acheter,vendre,convertir et dépot. De plus, vous avez l'option de voir votre page de transaction et votre page de profile et vous pouvez déconnecter votre compte.

<img width="959" alt="Page Dashboard" src="https://github.com/user-attachments/assets/c2999268-591c-4376-bd7e-f3a09d3ef56e">



**Présentation du Page Transaction :**

Dans la page de transaction, l'utilisateur pouvez voir les achats que vous avez faites.

<img width="959" alt="Page Transaction" src="https://github.com/user-attachments/assets/167c5fc8-db8c-4cc9-a740-4970f26ecbeb">



**Présentation du Page Profil :**

Dans la page de profil, l'utilisateur peut voir ses informations personnels et il a l'option de modifier son profil ou supprimer son compte.

<img width="959" alt="Page Profil" src="https://github.com/user-attachments/assets/b43579e2-8fa1-4aed-bd73-7dd79674de1a">




**Présentation du Page Explorer les cryptos :**

Dans la page de explorer les crytos, l'utilisateur peut voir les cryptos monnaies qu'il peut acheter (l'unite d'achat est en crypto et non en dollars). De plus, il y a aussi l'affichage de la cryptomonnaie avec la plus grande hausse du jour.

<img width="959" alt="Explorer Crypto"  src="https://github.com/user-attachments/assets/687b11d0-4c29-46b8-bf88-0c09bfcc14db">


Lorsque l'utilisateur choisi un cryto monnaie, il peut l'acheter et vendre son crypto monnaie et il peut voir les informations supplémenataires sur le crypto sélectionné.

<img width="959" alt="Acheter Crypto"  src="https://github.com/user-attachments/assets/a149e91e-c726-475e-8f89-ca9648a7a6c8">


**Présentation du Page Dépôt d'Argent :**

Dans la page dépôt d'argent, l'utilisateur peut ajoutez un montant de son choix. De plus, il peut voir son solde et réinitialser le solde.

<img width="959" alt="Dépôt d'Argent" src="https://github.com/user-attachments/assets/f36fe410-dce8-4409-9c11-d88822067bb1">



**Présentation du Page Modification Profil :**

Dans la page modification profil, l'utilisateur peut changer ses informations personnelles comme son nom,l'option d'ajouter son date de naissance, changer sa devise (CAD,USD,EUR,GBP,IDR) et l'utilisateur peut modifier son mot de passe.

<img width="959" alt="image" src="https://github.com/user-attachments/assets/0e7a8f67-05d2-404f-a362-b7b19c46811e">


**Présentation du Page Réinitialiser votre mot de passe :**

Dans la page réinitialiser votre mot passe, si l'utilisateur a oublié le mot de passe de son compte, il peut mettre son courriel pour qu'on l'envoit un courriel pour lui permettre de changer son mot de passe.

<img width="959" alt=" Page Réinitialiser votre mot de passe" src="https://github.com/user-attachments/assets/52b50c8e-0e02-4574-b2cf-ddbab34e3c82">

