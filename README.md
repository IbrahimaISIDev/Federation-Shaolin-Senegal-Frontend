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
6. [Composants](#-composants)
7. [Bibliothèques et utilitaires](#-bibliothèques-et-utilitaires)
8. [Installation et démarrage](#-installation-et-démarrage)
9. [Variables d'environnement](#-variables-denvironnement)
10. [Scripts disponibles](#-scripts-disponibles)
11. [Déploiement](#-déploiement)
12. [Conventions de développement](#-conventions-de-développement)
13. [Feuille de route](#-feuille-de-route)
14. [Contribuer](#-contribuer)
15. [Licence](#-licence)

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
- **Actualités** : Liste des articles avec filtres par catégorie et pagination.
- **Compétitions** : Calendrier des compétitions avec filtres et détail de chaque événement.
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

### 🏢 Back-office Administrateur
- **Layout modulaire** : Sidebar responsive (desktop + mobile menu hamburger) et header avec notifications.
- **Tableau de bord** : KPIs en temps réel (membres, clubs, licences), graphique "Membres par région" (Recharts), tableau des inscriptions récentes, et section "Actions urgentes".
- **Gestion des Membres** : (à venir) — CRUD complet.
- **Gestion des Clubs** : (à venir) — CRUD complet.
- **Gestion des Licences** : (à venir).
- **Gestion des Actualités** : (à venir) — Éditeur riche.
- **Gestion des Compétitions** : (à venir).

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
| State global | Zustand | 5.x |
| Thème | next-themes | 0.4 |
| Analytics | @vercel/analytics | 1.6 |
| Package manager | pnpm | — |

---

## 📁 Architecture du projet

```
Shaolin_Frontend/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Routes publiques (sans authentification)
│   │   ├── page.tsx              # Page d'accueil
│   │   ├── actualites/           # Blog / Actualités
│   │   ├── affiliation/          # Formulaire d'affiliation multi-étapes
│   │   ├── carte/                # Carte interactive des clubs
│   │   ├── clubs/                # Annuaire des clubs
│   │   ├── competitions/         # Calendrier des compétitions
│   │   ├── contact/              # Formulaire de contact
│   │   └── galerie/              # Galerie média
│   ├── (auth)/                   # Route groupe pour l'authentification
│   │   └── connexion/            # Page de connexion
│   ├── (membre)/                 # Zone privée membre (authentification requise)
│   │   └── membre/
│   │       ├── profil/           # Profil membre
│   │       ├── licence/          # Gestion de la licence
│   │       └── competitions/     # Compétitions du membre
│   ├── (admin)/                  # Zone privée admin (rôle ADMIN requis)
│   │   ├── layout.tsx            # Layout admin: sidebar + header
│   │   └── admin/
│   │       └── page.tsx          # Tableau de bord admin
│   ├── globals.css               # Styles globaux & design tokens Tailwind
│   └── layout.tsx                # Root layout (providers, fonts, analytics)
│
├── components/
│   ├── ui/                       # ~57 composants shadcn/ui
│   ├── layout/                   # Composants de mise en page
│   │   ├── admin-sidebar.tsx     # Sidebar admin (desktop + mobile)
│   │   ├── admin-header.tsx      # Header admin (notifications, profil)
│   │   ├── navbar.tsx            # Navigation publique
│   │   └── footer.tsx            # Pied de page
│   ├── home/                     # Sections de la page d'accueil
│   ├── affiliation/              # Composants du formulaire d'affiliation
│   │   ├── affiliation-form.tsx  # Formulaire multi-étapes principal
│   │   └── steps/                # 5 étapes du formulaire
│   ├── map/
│   │   └── senegal-map.tsx       # Carte Leaflet interactive
│   └── shared/
│       └── logo.tsx              # Composant Logo réutilisable
│
├── lib/
│   ├── api/                      # Services API (axios + React Query)
│   ├── constants/                # Constantes globales (régions, disciplines, etc.)
│   ├── data/                     # Données statiques (GeoJSON régions Sénégal)
│   ├── providers/                # Providers React (QueryClient, Theme)
│   ├── store/                    # Stores Zustand (état global)
│   ├── types/                    # Types TypeScript globaux
│   ├── validations/              # Schémas de validation Zod
│   └── utils.ts                  # Utilitaires (cn, etc.)
│
├── public/                       # Assets statiques
├── styles/                       # Fichiers CSS additionnels
├── next.config.mjs               # Configuration Next.js
├── tsconfig.json                 # Configuration TypeScript
└── package.json                  # Dépendances
```

---

## 🗺 Routes et pages

| Route | Groupe | Description | Auth requise |
|---|---|---|---|
| `/` | Public | Page d'accueil | Non |
| `/actualites` | Public | Liste des actualités | Non |
| `/actualites/[slug]` | Public | Détail d'un article | Non |
| `/competitions` | Public | Calendrier des compétitions | Non |
| `/galerie` | Public | Galerie photos/vidéos | Non |
| `/carte` | Public | Carte interactive des clubs | Non |
| `/clubs` | Public | Annuaire des clubs affiliés | Non |
| `/contact` | Public | Formulaire de contact | Non |
| `/affiliation` | Public | Formulaire d'inscription | Non |
| `/connexion` | Auth | Page de connexion | Non |
| `/membre` | Membre | Tableau de bord membre | Oui (MEMBRE) |
| `/membre/profil` | Membre | Profil et paramètres | Oui (MEMBRE) |
| `/membre/licence` | Membre | Licence sportive | Oui (MEMBRE) |
| `/membre/competitions` | Membre | Inscriptions compétitions | Oui (MEMBRE) |
| `/admin` | Admin | Tableau de bord admin | Oui (ADMIN) |
| `/admin/membres` | Admin | Gestion des membres | Oui (ADMIN) |
| `/admin/clubs` | Admin | Gestion des clubs | Oui (ADMIN) |
| `/admin/licences` | Admin | Gestion des licences | Oui (ADMIN) |
| `/admin/actualites` | Admin | Gestion du blog | Oui (ADMIN) |
| `/admin/competitions` | Admin | Gestion des compétitions | Oui (ADMIN) |

---

## 🧩 Composants

### Formulaire d'affiliation (`/affiliation`)

Le formulaire d'affiliation est une `multi-step form` composée de **5 étapes** :

| Étape | Composant | Champs |
|---|---|---|
| 1 | `PersonalInfoStep` | Prénom, Nom, Email, Téléphone, Date de naissance, Sexe, Nationalité |
| 2 | `AddressStep` | Adresse, Ville, Région, Code postal |
| 3 | `ClubSelectionStep` | Club, Discipline, Niveau, Expérience |
| 4 | `MedicalInfoStep` | Contact d'urgence, Groupe sanguin, Conditions médicales, Certificat médical |
| 5 | `DocumentsStep` | Consentement photo, CGU, Règlement intérieur |

- Validation step-by-step avec **Zod** et **React Hook Form** (`useFormContext`).
- Gestion de l'état centralisée dans `AffiliationForm` via `FormProvider`.
- Animations de transition entre les étapes via **Framer Motion**.

### Carte interactive (`/carte`)

- Composant `SenegalMap` utilisant **Leaflet** et **React Leaflet**.
- Affiche les 14 régions du Sénégal avec les marqueurs de chaque club.
- Popup de détail au survol/clic sur un marqueur.
- Panneau latéral avec les statistiques de la région sélectionnée.
- Grille récapitulative de toutes les régions triée par nombre de membres.

### Back-office Admin

- **`AdminSidebar`** : Navigation verticale avec groupes de liens (Tableau de bord, Membres, Clubs, Licences, Contenu, Paramètres). Gère le mode collapsed/expanded et le menu hamburger mobile.
- **`AdminHeader`** : Barre supérieure avec bouton menu mobile, titre de page, badge notifications, et menu déroulant utilisateur.
- **Dashboard** : Grille de 4 KPIs, graphique en barres (Recharts), section "Actions urgentes", tableau des inscriptions récentes.

---

## 📚 Bibliothèques et utilitaires

### `lib/constants`

Contient les constantes globales du projet :
- `SENEGAL_REGIONS` / `REGIONS` — Les 14 régions avec coordonnées GPS.
- `DISCIPLINES` — Disciplines d'arts martiaux (`{ id, name }`).
- `LEVELS` — Niveaux de pratique (Débutant → Expert).
- `GRADES` — Grades/ceintures.
- `PAYMENT_METHODS` — Méthodes de paiement (Wave, Orange Money, etc.).
- `LICENSE_FEES` — Tarifs de licence (nouvelle / renouvellement).
- `PUBLIC_NAV_ITEMS`, `ADMIN_NAV_ITEMS` — Éléments de navigation.
- `VALIDATION` — Règles de validation communes (regex, longueurs).
- `FADE_IN_UP`, `STAGGER_CONTAINER`, `SCALE_IN` — Variantes d'animation Framer Motion.

### `lib/validations`

Schémas Zod par domaine fonctionnel :
- `affiliation.ts` — Validation des 5 étapes du formulaire d'affiliation.

### `lib/data/senegal-regions.ts`

Données GeoJSON simplifiées des 14 régions du Sénégal pour la carte Leaflet, incluant les polygones de frontières approximatifs.

---

## 🚀 Installation et démarrage

### Prérequis

- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x (recommandé) — `npm install -g pnpm`
- Accès à l'**API backend** (voir Variables d'environnement)

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/<votre-organisation>/shaolin-senegal-frontend.git
cd shaolin-senegal-frontend

# 2. Installer les dépendances
pnpm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# 4. Lancer le serveur de développement
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## 🔑 Variables d'environnement

Créez un fichier `.env.local` à la racine du projet (non commité par défaut) :

```env
# URL de l'API backend
NEXT_PUBLIC_API_URL=https://api.shaolin-senegal.sn

# URL publique du site (utilisée pour les métadonnées SEO)
NEXT_PUBLIC_SITE_URL=https://shaolin-senegal.sn

# Clé secrète NextAuth (si utilisé) — 32+ caractères aléatoires
NEXTAUTH_SECRET=votre_clé_secrète_très_longue_et_aléatoire

# URL de NextAuth
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ Ne committez **jamais** votre fichier `.env.local`. Il est déjà inclus dans `.gitignore`.

---

## 📜 Scripts disponibles

| Commande | Description |
|---|---|
| `pnpm dev` | Lance le serveur de développement (Turbopack) |
| `pnpm build` | Crée une build de production optimisée |
| `pnpm start` | Démarre le serveur de production |
| `pnpm lint` | Analyse le code avec ESLint |

---

## ☁️ Déploiement

### Vercel (recommandé)

Ce projet est optimisé pour un déploiement sur **Vercel**.

1. Importez le dépôt GitHub dans votre dashboard Vercel.
2. Configurez les variables d'environnement dans les paramètres du projet.
3. Vercel détectera automatiquement Next.js et configurera le pipeline de build.

```bash
# Alternative : via CLI Vercel
npm i -g vercel
vercel --prod
```

### Autres plateformes

Pour un déploiement sur d'autres plateformes (Render, Railway, VPS) :

```bash
pnpm build
pnpm start
```

Assurez-vous que le port `3000` est exposé et que les variables d'environnement sont correctement configurées.

---

## 📐 Conventions de développement

### Structure des fichiers

- Les composants utilisent le format **PascalCase** pour les noms de fichiers : `MyComponent.tsx`
- Les hooks utilisent le format **camelCase** avec le préfixe `use` : `useAuth.ts`
- Les services API utilisent le format **camelCase** : `membersService.ts`

### Composants

- Toujours déclarer `'use client'` en haut des composants avec des hooks côté client (`useState`, `useEffect`, etc.)
- Les **Server Components** (sans `'use client'`) sont préférés pour les pages statiques/SSR.
- Utiliser `dynamic()` de Next.js uniquement dans les **Server Components** pour du code-splitting.

### Formulaires

- Utiliser **React Hook Form** + **Zod** pour tous les formulaires.
- Les schémas Zod sont définis dans `lib/validations/`.
- Pour les formulaires multi-étapes, utiliser `FormProvider` et `useFormContext`.

### API et données

- Les appels API passent par les services dans `lib/api/`.
- Utiliser **TanStack Query** (`useQuery`, `useMutation`) pour la gestion du cache et des états de chargement.
- Les données mockées (développement) sont clairement marquées avec un commentaire `// Mock data`.

### Styling

- Utiliser les classes **Tailwind CSS** directement dans le JSX.
- Utiliser la fonction `cn()` (de `lib/utils.ts`) pour combiner des classes conditionnelles.
- Le design système (couleurs, typographie, espacements) est défini dans `globals.css` via les variables CSS.

---

## 🗓 Feuille de route

### Version actuelle (v0.1)
- [x] Pages publiques complètes
- [x] Formulaire d'affiliation multi-étapes
- [x] Carte interactive des clubs
- [x] Layout authentification
- [x] Espace membre (profil, licence)
- [x] Back-office admin (layout + dashboard)

### Prochaines étapes (v0.2)
- [ ] Connexion à l'API backend (remplacement des données mockées)
- [ ] Pages CRUD Admin (Membres, Clubs, Actualités)
- [ ] Système de paiement en ligne (Wave, Orange Money)
- [ ] Génération PDF des licences
- [ ] Notifications en temps réel (WebSocket)
- [ ] Internationalisation (FR + WOL)

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment procéder :

1. **Fork** le dépôt
2. Créez votre branche de fonctionnalité : `git checkout -b feature/ma-super-feature`
3. **Committez** vos changements : `git commit -m "feat: ajout de ma super feature"`
4. **Poussez** vers la branche : `git push origin feature/ma-super-feature`
5. Ouvrez une **Pull Request**

### Convention de commits (Conventional Commits)

| Préfixe | Description |
|---|---|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `docs:` | Documentation uniquement |
| `style:` | Formatage, pas de changement de code |
| `refactor:` | Refactorisation du code |
| `chore:` | Maintenance (dépendances, config) |

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
