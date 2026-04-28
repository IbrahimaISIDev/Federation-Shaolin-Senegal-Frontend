# 🥋 Fédération Shaolin Sénégal — Frontend

> Plateforme web officielle de la **Fédération Shaolin Sénégal** — gestion des membres, des clubs, des licences, des compétitions et du back-office administratif.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.2-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)

---

## 📋 Table des matières

1. [Présentation du projet](#-présentation-du-projet)
2. [Fonctionnalités](#-fonctionnalités)
3. [Stack technique](#-stack-technique)
4. [Architecture du projet](#-architecture-du-projet)
5. [Routes et pages](#-routes-et-pages)
6. [Composants clés](#-composants-clés)
7. [Installation et démarrage](#-installation-et-démarrage)
8. [Variables d'environnement](#-variables-denvironnement)
9. [Scripts disponibles](#-scripts-disponibles)
10. [Déploiement](#-déploiement)
11. [Conventions de développement](#-conventions-de-développement)
12. [Feuille de route](#-feuille-de-route)
13. [Contribuer](#-contribuer)
14. [Licence](#-licence)

---

## 🎯 Présentation du projet

La **Fédération Shaolin Sénégal** est l'organisme officiel de tutelle des arts martiaux Shaolin au Sénégal. Cette plateforme web est conçue pour :

- Permettre aux **pratiquants** de s'affilier en ligne et de gérer leur licence.
- Donner aux **clubs** un espace de gestion de leurs membres.
- Offrir aux **administrateurs** un back-office complet pour piloter la fédération.
- Informer le **grand public** sur les actualités, compétitions, et la carte des clubs.

Ce projet est le **frontend** de la plateforme. Il consomme une API REST externe (non incluse dans ce dépôt).

---

## ✨ Fonctionnalités

### 🌍 Espace Public
- **Page d'accueil** : Hero section, présentation de la fédération, statistiques clés, clubs vedettes, actualités récentes.
- **Actualités** : Liste des articles avec filtres par catégorie et pagination. Détail de chaque article.
- **Compétitions** : Calendrier des compétitions avec filtres et formulaire d'inscription.
- **Galerie** : Galerie photo/vidéo organisée par album.
- **Carte interactive** : Visualisation des clubs sur une carte Leaflet/OpenStreetMap avec les 14 régions du Sénégal.
- **Clubs** : Annuaire des clubs affiliés avec recherche et filtres.
- **Contact** : Formulaire de contact avec validation côté client.
- **Affiliation** : Formulaire d'inscription multi-étapes (5 étapes) avec validation Zod et gestion d'état.

### 👤 Espace Membre
- **Tableau de bord** : Vue synthétique du compte membre.
- **Ma Licence** : Statut, renouvellement et téléchargement de la licence.
- **Mon Profil** : Mise à jour des informations personnelles, sécurité (changement de mot de passe), préférences de notifications.
- **Mes Compétitions** : Historique et inscriptions aux compétitions.

### 🔐 Authentification
- Page de **connexion** (email/mot de passe).
- Gestion de session via JWT (tokens stockés en mémoire/httpOnly cookie côté API).

### 🏢 Back-office Administrateur ✅ Complet

#### Tableau de bord (`/admin`)
- KPIs en temps réel (membres, clubs, licences actives, nouvelles inscriptions).
- Graphique **Membres par région** (Recharts — BarChart).
- **Actions urgentes dynamiques** : calculées depuis les vraies données (membres en attente, licences expirées, articles en brouillon). Chaque action est cliquable et redirige vers la page concernée. Badge de comptage et état vert si tout est à jour.
- Tableau des **inscriptions récentes** avec statut.

#### Gestion des Membres (`/admin/membres`)
- Liste avec recherche, filtres (statut, région), tri.
- Tableau paginé avec actions par ligne (voir, modifier, supprimer).
- Création (`/admin/membres/nouveau`) : formulaire complet avec **photo de profil** via MediaPicker.
- Édition (`/admin/membres/[id]/modifier`) : pré-remplissage des données, MediaPicker.
- **Export Excel** (`shaolin_membres.xlsx`) en un clic.

#### Gestion des Clubs (`/admin/clubs`)
- Liste avec recherche, filtre statut/région, statistiques (total, actifs, membres, régions).
- Création (`/admin/clubs/nouveau`) : formulaire avec **logo du club** via MediaPicker.
- Édition (`/admin/clubs/[id]/modifier`) : mise à jour complète avec logo.
- **Export Excel** (`shaolin_clubs.xlsx`).

#### Gestion des Actualités (`/admin/actualites`)
- Liste avec filtres (statut publié/brouillon, catégorie), vues totales.
- Création (`/admin/actualites/nouvelle`) : éditeur avec **image de couverture** via MediaPicker, catégorie, statut.
- Édition (`/admin/actualites/[id]/modifier`) : mise à jour complète.
- **Export Excel** (`shaolin_actualites.xlsx`).

#### Gestion des Compétitions (`/admin/competitions`)
- Liste avec statuts (à venir, inscriptions ouvertes, terminée).
- Recherche full-text, statistiques par statut.
- Actions par ligne (voir, modifier, supprimer).
- **Export Excel** (`shaolin_competitions.xlsx`).

#### Bibliothèque Médias (`/admin/galerie`)
- Grille de tous les médias uploadés (images, vidéos).
- Filtres par type, recherche par nom.
- Upload de nouveaux médias (dialog).
- Suppression.

#### Rapports & Statistiques (`/admin/rapports`)
- KPIs globaux (membres, clubs, inscriptions mensuelles, taux de renouvellement).
- Graphique linéaire des inscriptions par mois.
- Histogramme des membres par région.
- Répartition par discipline (barres de progression).
- Filtre par année.
- **Multi-export Excel** (dropdown : Membres, Clubs, Compétitions, Actualités, Licences).

#### Paramètres (`/admin/parametres`)
- Informations générales de la fédération (nom, contact, site web).
- Gestion des notifications (interrupteurs).
- Sécurité (changement de mot de passe, 2FA).
- Export CSV des données.

#### Composants partagés Admin
- **`MediaPicker`** : Sélecteur d'image réutilisable (dialog avec bibliothèque + upload) intégré dans tous les formulaires.
- **`ExportButton`** : Bouton d'export Excel one-click par entité.
- **`MultiExportButton`** : Dropdown pour exporter plusieurs entités depuis la page Rapports.

---

## 🛠 Stack technique

| Catégorie | Technologie | Version |
|---|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) | 16.2.0 |
| Langage | TypeScript | 5.7.3 |
| Styling | Tailwind CSS v4 | 4.2 |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + Radix UI | Dernière |
| Formulaires | React Hook Form | 7.x |
| Validation | Zod | 3.x |
| Requêtes API | TanStack Query (React Query) | 5.x |
| HTTP Client | Axios | 1.x |
| Graphiques | Recharts | 2.15 |
| Carte | Leaflet + React Leaflet | 1.9 / 5.0 |
| Animations | Framer Motion | 12.x |
| Icônes | Lucide React | 0.564 |
| Export Excel | SheetJS (xlsx) | 0.18.5 |
| State global | Zustand | 5.x |
| Thème | next-themes | 0.4 |
| Analytics | @vercel/analytics | 1.6 |
| Package manager | pnpm | — |

---

## 📁 Architecture du projet

```
Shaolin_Frontend/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Routes publiques
│   │   ├── page.tsx              # Page d'accueil
│   │   ├── actualites/           # Blog / Actualités + [slug]
│   │   ├── affiliation/          # Formulaire multi-étapes
│   │   ├── carte/                # Carte interactive
│   │   ├── clubs/                # Annuaire + [id]
│   │   ├── competitions/         # Calendrier + [id] + inscription
│   │   ├── contact/              # Formulaire de contact
│   │   └── galerie/              # Galerie média
│   ├── (auth)/
│   │   └── connexion/            # Page de connexion
│   ├── (membre)/
│   │   └── membre/
│   │       ├── profil/
│   │       ├── licence/
│   │       └── competitions/
│   ├── (admin)/
│   │   ├── layout.tsx            # Layout admin: sidebar + header
│   │   └── admin/
│   │       ├── page.tsx          # Tableau de bord (dynamique)
│   │       ├── membres/          # CRUD membres
│   │       │   ├── page.tsx
│   │       │   ├── nouveau/
│   │       │   └── [id]/         # Voir + Modifier
│   │       ├── clubs/            # CRUD clubs
│   │       │   ├── page.tsx
│   │       │   ├── nouveau/
│   │       │   └── [id]/
│   │       ├── actualites/       # CRUD actualités
│   │       │   ├── page.tsx
│   │       │   ├── nouvelle/
│   │       │   └── [id]/
│   │       ├── competitions/     # Gestion compétitions
│   │       ├── galerie/          # Bibliothèque médias
│   │       ├── rapports/         # Statistiques + multi-export
│   │       └── parametres/       # Configuration
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── ui/                       # ~57 composants shadcn/ui
│   ├── layout/
│   │   ├── admin-sidebar.tsx     # Sidebar avec tous les liens
│   │   ├── admin-header.tsx
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── home/                     # Sections page d'accueil
│   ├── affiliation/              # Formulaire multi-étapes (5 étapes)
│   ├── map/
│   │   └── senegal-map.tsx
│   └── shared/
│       ├── logo.tsx
│       ├── media-picker.tsx      # ✅ Sélecteur médias réutilisable
│       └── export-button.tsx     # ✅ Boutons export Excel
│
├── lib/
│   ├── api/                      # Services API
│   ├── constants/                # Régions, disciplines, grades…
│   ├── data/                     # GeoJSON Sénégal
│   ├── providers/
│   ├── store/                    # Zustand stores
│   ├── types/
│   ├── validations/              # Schémas Zod
│   ├── utils/
│   │   └── export-excel.ts       # ✅ Utilitaire SheetJS
│   └── utils.ts
│
├── public/
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## 🗺 Routes et pages

### Espace Public

| Route | Description |
|---|---|
| `/` | Page d'accueil |
| `/actualites` | Liste des actualités |
| `/actualites/[slug]` | Détail d'un article |
| `/competitions` | Calendrier des compétitions |
| `/competitions/[id]` | Détail d'une compétition |
| `/competitions/[id]/inscription` | Formulaire d'inscription |
| `/galerie` | Galerie photos/vidéos |
| `/carte` | Carte interactive des clubs |
| `/clubs` | Annuaire des clubs |
| `/clubs/[id]` | Détail d'un club |
| `/contact` | Formulaire de contact |
| `/affiliation` | Formulaire d'inscription |

### Espace Membre

| Route | Description |
|---|---|
| `/connexion` | Page de connexion |
| `/membre` | Tableau de bord membre |
| `/membre/profil` | Profil et paramètres |
| `/membre/licence` | Licence sportive |
| `/membre/competitions` | Inscriptions compétitions |

### Back-office Admin

| Route | Description |
|---|---|
| `/admin` | Tableau de bord (dynamique) |
| `/admin/membres` | Liste membres + export Excel |
| `/admin/membres/nouveau` | Créer un membre |
| `/admin/membres/[id]` | Voir un membre |
| `/admin/membres/[id]/modifier` | Modifier un membre |
| `/admin/clubs` | Liste clubs + export Excel |
| `/admin/clubs/nouveau` | Créer un club |
| `/admin/clubs/[id]/modifier` | Modifier un club |
| `/admin/actualites` | Liste articles + export Excel |
| `/admin/actualites/nouvelle` | Créer un article |
| `/admin/actualites/[id]/modifier` | Modifier un article |
| `/admin/competitions` | Liste compétitions + export Excel |
| `/admin/galerie` | Bibliothèque de médias |
| `/admin/rapports` | Statistiques + multi-export Excel |
| `/admin/parametres` | Configuration générale |

---

## 🧩 Composants clés

### `MediaPicker` (`components/shared/media-picker.tsx`)

Sélecteur d'image réutilisable dans tous les formulaires admin. Ouvre une boîte de dialogue permettant de parcourir la bibliothèque existante ou d'uploader un nouveau fichier.

```tsx
<MediaPicker
  label="Photo de profil"
  value={watch('photo')}
  onChange={(url) => setValue('photo', url)}
  helperText="Format carré recommandé"
/>
```

### `ExportButton` / `MultiExportButton` (`components/shared/export-button.tsx`)

Composants d'export Excel basés sur SheetJS. Les en-têtes de colonnes sont localisés en français.

```tsx
// Export simple (une entité)
<ExportButton entity="membres" getData={getMembersData} />

// Export multiple (dropdown)
<MultiExportButton exports={[
  { label: 'Membres', entity: 'membres', getData: () => data },
  { label: 'Clubs', entity: 'clubs', getData: () => clubs },
]} />
```

### `computePendingActions()` (`app/(admin)/admin/page.tsx`)

Calcule les actions urgentes dynamiquement :
1. Membres en attente de validation (`status === 'pending'`)
2. Licences expirées ou sur le point d'expirer
3. Articles en brouillon non publiés

### Formulaire d'affiliation (`/affiliation`)

Formulaire multi-étapes (5 étapes) :

| Étape | Champs |
|---|---|
| 1 — Identité | Prénom, Nom, Email, Téléphone, Date de naissance, Sexe, Nationalité |
| 2 — Adresse | Adresse, Ville, Région, Code postal |
| 3 — Club | Club, Discipline, Niveau, Expérience |
| 4 — Médical | Contact urgence, Groupe sanguin, Certificat médical |
| 5 — Documents | Consentements CGU, Règlement intérieur |

---

## 🚀 Installation et démarrage

### Prérequis

- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x — `npm install -g pnpm`

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/IbrahimaISIDev/Federation-Shaolin-Senegal-Frontend.git
cd Federation-Shaolin-Senegal-Frontend

# 2. Installer les dépendances
pnpm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Lancer le serveur de développement
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

> ⚠️ **Note** : si le chemin du projet contient des caractères accentués (ex: `Téléchargements`), Turbopack peut occasionnellement causer des erreurs de build. Cloner dans un chemin sans accents si nécessaire.

---

## 🔑 Variables d'environnement

```env
# URL de l'API backend
NEXT_PUBLIC_API_URL=https://api.shaolin-senegal.sn

# URL publique du site (SEO)
NEXT_PUBLIC_SITE_URL=https://shaolin-senegal.sn

# NextAuth
NEXTAUTH_SECRET=votre_clé_secrète_très_longue_et_aléatoire
NEXTAUTH_URL=http://localhost:3000
```

> Ne committez **jamais** votre `.env.local`.

---

## 📜 Scripts disponibles

| Commande | Description |
|---|---|
| `pnpm dev` | Serveur de développement (Turbopack) |
| `pnpm build` | Build de production |
| `pnpm start` | Serveur de production |
| `pnpm lint` | Analyse ESLint |

---

## ☁️ Déploiement

### Vercel (recommandé)

1. Importez le dépôt GitHub dans votre dashboard Vercel.
2. Configurez les variables d'environnement.
3. Vercel détecte automatiquement Next.js et configure le pipeline.

```bash
# Via CLI
npm i -g vercel && vercel --prod
```

### Autres plateformes (Render, Railway)

```bash
pnpm build && pnpm start
```

---

## 📐 Conventions de développement

- **Composants** : PascalCase (`MyComponent.tsx`), `'use client'` obligatoire pour les hooks clients.
- **Formulaires** : React Hook Form + Zod. Schémas dans `lib/validations/`.
- **API** : Services dans `lib/api/`, TanStack Query pour le cache.
- **Styling** : Classes Tailwind + `cn()` pour les classes conditionnelles.
- **Données mockées** : Marquées `// Mock data` — à remplacer par des appels API réels.
- **Export Excel** : Passer la fonction `getData` fournie pour chaque entité dans `ExportButton`.

---

## 🗓 Feuille de route

### Version actuelle (v0.2) — Back-office complet ✅

- [x] Pages publiques complètes (accueil, actualités, clubs, galerie, carte, compétitions, contact, affiliation)
- [x] Espace membre (profil, licence, compétitions)
- [x] Layout admin (sidebar responsive, header)
- [x] Tableau de bord admin dynamique (KPIs, graphiques, actions urgentes)
- [x] CRUD Membres (liste, créer, modifier, voir) avec MediaPicker
- [x] CRUD Clubs (liste, créer, modifier, voir) avec MediaPicker
- [x] CRUD Actualités (liste, créer, modifier) avec MediaPicker
- [x] Gestion Compétitions (liste, actions)
- [x] Bibliothèque Médias (`/admin/galerie`)
- [x] Composant `MediaPicker` intégré dans tous les formulaires
- [x] Export Excel pour toutes les entités (membres, clubs, actualités, compétitions, licences)
- [x] Page Rapports & Statistiques avec multi-export
- [x] Page Paramètres
- [x] Actions urgentes dynamiques sur le tableau de bord

### Prochaines étapes (v0.3)

- [ ] Connexion à l'API backend (remplacement des données mockées)
- [ ] Upload réel des fichiers (Cloudinary ou AWS S3) dans le `MediaPicker`
- [ ] CRUD Licences complet
- [ ] Middleware d'authentification (NextAuth) pour protéger les routes admin
- [ ] Système de paiement (Wave, Orange Money)
- [ ] Génération PDF des licences
- [ ] Notifications en temps réel (WebSocket)
- [ ] Internationalisation (FR + WOL)

---

## 🤝 Contribuer

1. **Fork** le dépôt
2. Créez votre branche : `git checkout -b feature/ma-feature`
3. **Committez** : `git commit -m "feat: description"`
4. **Poussez** : `git push origin feature/ma-feature`
5. Ouvrez une **Pull Request**

### Convention de commits (Conventional Commits)

| Préfixe | Description |
|---|---|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `docs:` | Documentation |
| `style:` | Formatage |
| `refactor:` | Refactorisation |
| `chore:` | Maintenance |

---

## 📄 Licence

Ce projet est propriétaire et développé pour la **Fédération Shaolin Sénégal**.  
Tous droits réservés © 2025 Fédération Shaolin Sénégal.

---

<div align="center">
  <p>Développé avec ❤️ pour la Fédération Shaolin Sénégal</p>
  <p>
    <a href="https://shaolin-senegal.sn">Site officiel</a> · 
    <a href="https://facebook.com/shaolinsn">Facebook</a> · 
    <a href="https://instagram.com/shaolinsn">Instagram</a>
  </p>
</div>
