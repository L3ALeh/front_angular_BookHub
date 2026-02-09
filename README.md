# 📚 Bibliothèque Numérique - Frontend (Angular)

Bienvenue sur le dépôt du frontend de notre application de gestion de bibliothèque.

Cette interface moderne permet aux utilisateurs de parcourir un catalogue, d'emprunter et de réserver des livres et de laisser des avis, tout en offrant aux bibliothécaires des outils de gestion complets.

---

## Fonctionnalités

###  Pour les Utilisateurs
* **Catalogue Interactif** : Visualisation de tous les ouvrages avec recherche et filtrage par catégorie.
* **Fiche Détail** : Consultation des informations complètes (ISBN, Éditeur, Nb de pages, Description).
* **Système d'Emprunt** : Emprunter un livre en un clic ou le réserver s'il est indisponible.
* **Avis & Notes** : Système de notation par étoiles et commentaires (accessible après avoir rendu l'ouvrage).

###  Pour les Bibliothécaires
* **Gestion du Stock** : Modification en temps réel des informations des livres (titre, auteur, stock total/disponible).
* **Administration** : Ajout de nouveaux ouvrages et suppression de livres du catalogue.
* **Modération** : Possibilité de supprimer des commentaires inappropriés.

---

##  Stack Technique
* **Framework** : Angular (v16+)
* **Style** : Bootstrap 5 pour un design responsive et épuré.
* **Icônes** : Bootstrap Icons.
* **Langage** : TypeScript.

---

##  Installation & Démarrage

### Prérequis
* Node.js (version LTS recommandée).
* Angular CLI installé globalement (`npm install -g @angular/cli`).

### Étapes

1. **Cloner le projet**
   ```bash
   git clone https://github.com/L3ALeh/front_angular_BookHub
   cd front_angular_BookHub

2. **Installer les dépendances**
   ```bash
   npm install
3. Lancer le serveur de développement
   ```bash
   ng serve
4. Accéder à l'application Ouvre ton navigateur sur http://localhost:4200/.
___
##  Architecture du Projet

```text
src/
├── app/
│   ├── components/       # Composants réutilisables (Navbar, Footer, etc.)
│   ├── pages/            # Composants de pages (Catalogue, Détails, Login)
│   ├── services/         # Logique métier et appels API (AuthService, BookService)
│   ├── models/           # Interfaces TypeScript (Livre, Commentaire, User)
│   └── guards/           # Protections des routes selon les rôles
├── assets/               # Images, logos et fichiers statiques
└── environments/         # Configuration des URLs API (Dev/Prod)
```
