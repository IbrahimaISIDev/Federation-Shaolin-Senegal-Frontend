# 01 — Cahier des Charges Fonctionnel

**Projet** : Plateforme Web — Fédération Shaolin Sénégal  
**Prestataire** : Shaoum Service Digital  
**Version** : 1.0  
**Date** : Avril 2026

---

## 1. Contexte & Objectifs

### 1.1 Contexte

La Fédération Shaolin Sénégal souhaite se doter d'une plateforme web moderne pour digitaliser l'ensemble de ses processus administratifs, valoriser ses clubs affiliés, et renforcer sa visibilité sur le territoire national.

### 1.2 Objectif principal

Digitaliser le système d'affiliation : inscription en ligne, gestion des licences, renouvellement et paiement.

### 1.3 Objectifs secondaires

- Améliorer la visibilité de la fédération sur le web
- Centraliser les informations (clubs, membres, événements, compétitions)
- Faciliter la communication avec les membres et les clubs
- Renforcer la crédibilité et l'image moderne de la fédération
- Offrir une carte interactive de la présence fédérale au Sénégal

---

## 2. Cibles utilisateurs

| Profil | Description |
|---|---|
| **Membre (athlète)** | Inscrit à la fédération, possède une licence |
| **Club affilié** | Structure sportive membre de la fédération |
| **Nouvel adhérent** | Visiteur souhaitant s'inscrire |
| **Staff administratif** | Équipe de la fédération (admin) |
| **Grand public** | Visiteur sans compte, consultation uniquement |

---

## 3. Fonctionnalités

### 3.1 Espace public (visiteurs)

- Page d'accueil dynamique avec actualités
- Présentation de la fédération (historique, mission, valeurs)
- Liste des clubs affiliés avec carte interactive
- Galerie photos / vidéos
- Blog / actualités
- Page contact

### 3.2 Système d'affiliation ⭐ Fonctionnalité cœur

- Formulaire d'inscription en ligne
- Création de compte membre (email + téléphone)
- Paiement des licences — **obligatoire** pour valider l'inscription
  - Mobile Money : Wave, Orange Money (V2)
  - Carte bancaire (V2)
- Renouvellement annuel de licence
- Génération automatique d'une **licence numérique PDF**
- Intégration d'un **QR Code sécurisé** unique par membre
- Téléchargement de documents

### 3.3 Espace membre

- Profil utilisateur (photo, grade, discipline, club)
- Statut de licence : `actif` / `expiré` / `en attente`
- Historique des paiements
- Téléchargement de la licence PDF
- Notifications (expiration, événements, compétitions)

### 3.4 Espace club

- Inscription et profil du club
- Gestion des membres affiliés au club
- Suivi des licences membres
- Tableau de bord club (statistiques, alertes)

### 3.5 Module compétitions

- Création et gestion des compétitions
- Inscription des participants en ligne
- Gestion des catégories (âge, grade, discipline)
- Publication des résultats
- Tableau des classements

### 3.6 Back-office administration

- Gestion complète des membres (validation, suspension, export)
- Gestion des clubs affiliés
- Validation des inscriptions et paiements
- Gestion des compétitions
- Statistiques globales (membres, revenus, clubs, régions)
- Publication d'actualités et gestion de la galerie

### 3.7 Carte interactive (page Clubs & Membres)

- Carte du Sénégal cliquable par région (14 régions)
- Affichage des clubs et membres par marqueurs géolocalisés
- Clustering automatique pour les zones denses
- Fiche détaillée au clic sur un marqueur :
  - Nom du club / membre
  - Région, ville, localisation
  - Nom du maître
  - Nombre d'élèves
  - Discipline, contact
- Barre de recherche (nom club ou membre)
- Filtres : par région, par type (club / membre)
- Chargement optimisé par région (pagination API)

---

## 4. Système de licence & QR Code

Chaque membre validé reçoit une **licence numérique unique** :

- Génération automatique à la validation du paiement
- QR Code sécurisé encodant un UUID signé (JWT)
- Vérification en temps réel lors des événements et compétitions
- Anti-fraude : validation serveur à chaque scan
- Expiration annuelle gérée automatiquement (CRON job)
- Téléchargement PDF depuis l'espace membre

---

## 5. Pages du site

| Page | Description |
|---|---|
| `/` | Accueil |
| `/a-propos` | Présentation de la fédération |
| `/clubs` | Carte interactive + liste des clubs |
| `/affiliation` | Inscription / renouvellement de licence |
| `/actualites` | Blog et actualités |
| `/competitions` | Liste et détail des compétitions |
| `/galerie` | Photos et vidéos |
| `/contact` | Formulaire de contact |
| `/connexion` | Authentification |
| `/membre/*` | Espace membre (protégé) |
| `/club/*` | Espace club (protégé) |
| `/admin/*` | Back-office administration (protégé) |

---

## 6. Expérience utilisateur (UX/UI)

- Design moderne, professionnel, identité sportive et dynamique
- Interface fluide et intuitive
- Entièrement **responsive** : mobile, tablette, desktop
- Navigation simple et rapide
- Accessibilité de base (contrastes, labels)

---

## 7. Contraintes

- Paiement obligatoire pour toute nouvelle inscription et tout renouvellement
- Données personnelles protégées (conformité RGPD / réglementation locale)
- Connexion sécurisée (HTTPS, sessions JWT)
- Sauvegardes automatiques régulières
- Performance : chargement < 3s sur connexion 3G

---

## 8. Hors périmètre V1

- Application mobile (prévue en Phase 2)
- Intégration paiement Wave / Orange Money (prévue en V2)
- Forum ou messagerie interne
- Streaming vidéo en direct
