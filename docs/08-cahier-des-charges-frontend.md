# CAHIER DES CHARGES FRONTEND
## Plateforme Web — Fédération Shaolin Sénégal
### Document destiné à une IA pour la génération complète du Frontend

---

## 🎯 CONTEXTE & MISSION

Tu es chargé de développer **l'intégralité du frontend** de la plateforme web officielle de la **Fédération Shaolin Sénégal**. Ce frontend est une application **Next.js 14** qui communique avec une **API REST Node.js/Express** déjà en cours de développement séparément.

Ton travail : produire un frontend **professionnel, moderne, responsive**, fidèle à l'identité sportive et culturelle de la fédération, avec une expérience utilisateur fluide et intuitive.

---

## 🏗️ STACK TECHNIQUE IMPOSÉE

```
Framework      : Next.js 14 (App Router) — OBLIGATOIRE
Langage        : TypeScript strict
Styles         : Tailwind CSS v3
Formulaires    : React Hook Form + Zod (validation)
Data fetching  : TanStack Query v5 (React Query)
HTTP Client    : Axios
Carte          : Leaflet.js + react-leaflet + react-leaflet-markercluster
Icônes         : lucide-react
Animations     : Framer Motion (légères, non intrusives)
Monorepo       : Turborepo (pnpm workspaces)
```

### Structure du projet (déjà initialisée)

```
shaolin-federation/
├── apps/
│   ├── web/          ← TON PÉRIMÈTRE
│   └── api/          ← Développé séparément, NE PAS TOUCHER
├── packages/
│   ├── types/        ← Types TypeScript partagés (à utiliser)
│   └── ui/           ← Composants partagés (optionnel)
```

---

## 🎨 IDENTITÉ VISUELLE & DESIGN SYSTEM

### Palette de couleurs

```css
/* Couleurs principales */
--primary-900: #0A1628;    /* Bleu nuit profond — fond hero */
--primary-800: #1A2B4A;    /* Bleu marine — header, nav */
--primary-700: #1A5276;    /* Bleu fédération — couleur principale */
--primary-600: #2471A3;    /* Bleu moyen — hover, accents */
--primary-100: #D6EAF8;    /* Bleu très clair — backgrounds */

/* Couleur d'accent */
--accent-500:  #E67E22;    /* Orange — CTAs, badges actifs */
--accent-400:  #F39C12;    /* Orange clair — hover accent */
--accent-100:  #FDEBD0;    /* Orange très clair — backgrounds */

/* Neutres */
--gray-900:    #1C1C1E;    /* Texte principal */
--gray-600:    #5D6D7E;    /* Texte secondaire */
--gray-200:    #EAECEE;    /* Bordures */
--gray-100:    #F8F9FA;    /* Backgrounds clairs */
--white:       #FFFFFF;

/* Sémantiques */
--success:     #1D9E75;    /* Licence active */
--warning:     #E67E22;    /* Licence bientôt expirée */
--danger:      #E74C3C;    /* Licence expirée / erreurs */
```

### Typographie

```css
/* Police principale */
font-family: 'Inter', sans-serif;

/* Hiérarchie */
h1 : 3rem   / font-weight: 800 / letter-spacing: -0.02em
h2 : 2.25rem / font-weight: 700
h3 : 1.5rem  / font-weight: 600
h4 : 1.25rem / font-weight: 600
body: 1rem   / font-weight: 400 / line-height: 1.7
small: 0.875rem
```

### Composants UI de base à créer

```
Button       : primary | secondary | outline | ghost | danger
              sizes : sm | md | lg
              states : default | loading | disabled
Badge        : success | warning | danger | info | neutral
Card         : avec header optionnel, shadow légère
Input        : avec label, helper text, état d'erreur
Select       : custom styled
Modal        : avec overlay, animation d'entrée
Toast        : notifications slide-in (succès, erreur, info)
Spinner      : loader animé
Avatar       : photo de profil avec fallback initiales
Skeleton     : placeholder de chargement
```

### Principes de design

- Design **flat moderne** — pas de skeuomorphisme
- **Espacement généreux** — padding/margin cohérents (base 4px)
- **Coins arrondis** — border-radius: 8px (cards), 12px (modals), 999px (badges)
- **Ombres subtiles** — box-shadow légère, pas d'ombres dramatiques
- **Transitions** — 200ms ease-in-out sur tous les états hover/focus
- **Dark mode** — non requis en V1 mais architecture CSS ready
- **Mobile first** — breakpoints : sm(640) md(768) lg(1024) xl(1280)

---

## 📁 STRUCTURE DES DOSSIERS

```
apps/web/
├── app/
│   ├── (public)/                    ← Layout avec header/footer public
│   │   ├── layout.tsx
│   │   ├── page.tsx                 ← Accueil
│   │   ├── a-propos/
│   │   │   └── page.tsx
│   │   ├── clubs/
│   │   │   └── page.tsx             ← Carte interactive
│   │   ├── actualites/
│   │   │   ├── page.tsx             ← Liste articles
│   │   │   └── [slug]/
│   │   │       └── page.tsx         ← Article détail
│   │   ├── competitions/
│   │   │   ├── page.tsx             ← Liste compétitions
│   │   │   └── [id]/
│   │   │       └── page.tsx         ← Compétition détail
│   │   ├── galerie/
│   │   │   └── page.tsx
│   │   ├── affiliation/
│   │   │   └── page.tsx             ← Inscription / renouvellement
│   │   └── contact/
│   │       └── page.tsx
│   ├── (auth)/                      ← Layout minimal (sans nav)
│   │   ├── layout.tsx
│   │   ├── connexion/
│   │   │   └── page.tsx
│   │   └── mot-de-passe-oublie/
│   │       └── page.tsx
│   ├── (membre)/                    ← Layout espace membre (sidebar)
│   │   ├── layout.tsx
│   │   └── membre/
│   │       ├── page.tsx             ← Dashboard membre
│   │       ├── profil/
│   │       │   └── page.tsx
│   │       ├── licence/
│   │       │   └── page.tsx
│   │       └── paiements/
│   │           └── page.tsx
│   ├── (club)/                      ← Layout espace club
│   │   ├── layout.tsx
│   │   └── club/
│   │       ├── page.tsx             ← Dashboard club
│   │       ├── membres/
│   │       │   └── page.tsx
│   │       └── licences/
│   │           └── page.tsx
│   └── (admin)/                     ← Layout back-office
│       ├── layout.tsx
│       └── admin/
│           ├── page.tsx             ← Dashboard admin
│           ├── membres/
│           │   └── page.tsx
│           ├── clubs/
│           │   └── page.tsx
│           ├── paiements/
│           │   └── page.tsx
│           ├── competitions/
│           │   └── page.tsx
│           └── actualites/
│               └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── MemberSidebar.tsx
│   │   └── AdminSidebar.tsx
│   ├── map/
│   │   ├── InteractiveMap.tsx       ← Composant principal (dynamic import)
│   │   ├── RegionLayer.tsx
│   │   ├── ClubMarker.tsx
│   │   ├── MemberMarker.tsx
│   │   ├── ClusterGroup.tsx
│   │   ├── ClubModal.tsx
│   │   ├── MemberModal.tsx
│   │   ├── MapSearchBar.tsx
│   │   ├── MapFilters.tsx
│   │   └── data/
│   │       └── senegal-regions.geojson
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Spinner.tsx
│   │   ├── Avatar.tsx
│   │   └── Skeleton.tsx
│   ├── licence/
│   │   ├── LicenceCard.tsx          ← Carte de licence numérique
│   │   ├── LicenceStatus.tsx        ← Badge statut actif/expiré
│   │   └── QRCodeDisplay.tsx        ← Affichage QR Code
│   ├── forms/
│   │   ├── InscriptionForm.tsx
│   │   ├── ConnexionForm.tsx
│   │   └── ProfilForm.tsx
│   └── sections/                    ← Sections de la page d'accueil
│       ├── HeroSection.tsx
│       ├── StatsSection.tsx
│       ├── ClubsPreviewSection.tsx
│       ├── ActualitesSection.tsx
│       └── CTASection.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts                ← Instance Axios configurée
│   │   ├── auth.ts                  ← Appels auth
│   │   ├── members.ts               ← Appels membres
│   │   ├── clubs.ts                 ← Appels clubs
│   │   ├── licenses.ts              ← Appels licences
│   │   ├── competitions.ts          ← Appels compétitions
│   │   └── map.ts                   ← Appels carte
│   ├── hooks/
│   │   ├── useAuth.ts               ← Hook authentification
│   │   ├── useMap.ts                ← Hook données carte
│   │   └── useLicense.ts            ← Hook licence membre
│   ├── stores/
│   │   └── authStore.ts             ← Zustand store auth (access token en mémoire)
│   └── utils/
│       ├── formatDate.ts
│       ├── formatPrice.ts
│       └── cn.ts                    ← clsx + tailwind-merge
├── middleware.ts                    ← Protection routes privées
└── public/
    ├── images/
    │   ├── logo.png
    │   └── hero-bg.jpg
    └── fonts/
```

---

## 🔐 AUTHENTIFICATION

### Stratégie (IMPORTANTE)

```
Access Token  : JWT 15min → stocké EN MÉMOIRE (Zustand store) — JAMAIS dans localStorage
Refresh Token : JWT 7j    → stocké en httpOnly Cookie (géré automatiquement par le navigateur)
```

### Store Zustand

```typescript
// lib/stores/authStore.ts
interface AuthStore {
  accessToken: string | null
  user: {
    id: number
    email: string
    role: 'MEMBER' | 'CLUB_MANAGER' | 'ADMIN'
    memberId?: number
  } | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}
```

### Client Axios

```typescript
// lib/api/client.ts
// - baseURL: process.env.NEXT_PUBLIC_API_URL
// - withCredentials: true  ← OBLIGATOIRE pour les cookies httpOnly
// - Intercepteur REQUEST : injecte le Bearer token depuis le store
// - Intercepteur RESPONSE : sur 401, appelle /auth/refresh, retry la requête
//   Si refresh échoue → clearAuth() + redirect /connexion
```

### Middleware Next.js

```typescript
// middleware.ts
// Routes protégées :
// /membre/*     → role: MEMBER, CLUB_MANAGER, ADMIN
// /club/*       → role: CLUB_MANAGER, ADMIN
// /admin/*      → role: ADMIN uniquement
// Redirect vers /connexion si non authentifié
// Redirect vers / si authentifié tente d'accéder à /connexion
```

---

## 🌍 CARTE INTERACTIVE — Spécifications détaillées

C'est la fonctionnalité **vitrine** du projet. Elle doit être impressionnante.

### Comportement attendu

```
1. Chargement initial
   → Carte Sénégal centrée (lat: 14.4974, lng: -14.4524, zoom: 7)
   → Contours des 14 régions visibles (GeoJSON)
   → Compteur total membres/clubs en overlay

2. Survol d'une région
   → Highlight bleu (#1A5276) avec opacity 0.4
   → Tooltip avec nom de la région + nb de clubs

3. Clic sur une région
   → GET /api/map/clubs?region=DK&limit=100
   → Zoom automatique sur la région (fitBounds)
   → Apparition des marqueurs avec animation
   → Panel latéral avec liste des clubs de la région

4. Clic sur un marqueur CLUB
   → Modal/drawer avec fiche complète :
      - Nom du club (titre)
      - Badge région
      - Nom du maître
      - Nombre d'élèves
      - Discipline(s)
      - Téléphone + Email (cliquables)
      - Bouton "Voir les membres"

5. Clic sur un marqueur MEMBRE
   → Modal compact :
      - Photo + Nom prénom
      - Club affilié
      - Grade + Discipline
      - Badge statut licence

6. Barre de recherche (top de la carte)
   → Recherche temps réel (debounce 300ms)
   → GET /api/map/search?q=nom
   → Résultats dans dropdown
   → Clic → zoom sur le marqueur + open modal

7. Filtres (panel lateral)
   → Par région (select des 14 régions)
   → Par type (Clubs / Membres / Tous)
   → Reset filtres
```

### Icônes des marqueurs

```
Club   : cercle bleu (#1A5276), 36px, lettre "C", bordure blanche
Membre : cercle orange (#E67E22), 28px, lettre "M", bordure blanche
Cluster: cercle avec compteur, dégradé bleu, taille proportionnelle au nb
```

### Import dynamique obligatoire (Leaflet = browser only)

```typescript
const InteractiveMap = dynamic(
  () => import('@/components/map/InteractiveMap'),
  {
    ssr: false,
    loading: () => <MapSkeleton />  // Placeholder animé pendant le chargement
  }
)
```

### GeoJSON

Le fichier `senegal-regions.geojson` doit contenir les polygones des 14 régions avec :
```json
{
  "properties": {
    "code": "DK",
    "nom": "Dakar",
    "chef_lieu": "Dakar"
  }
}
```

---

## 📄 PAGES — Spécifications détaillées

### Page Accueil `/`

**Section Hero :**
- Fond : image plein écran avec overlay bleu nuit (#0A1628 à 70%)
- Titre principal : "Fédération Shaolin Sénégal" (h1, blanc, 4rem)
- Sous-titre : "Arts martiaux traditionnels — Excellence & Discipline"
- Deux boutons CTA : "Nous rejoindre" (accent orange) + "Découvrir" (outline blanc)
- Scroll indicator animé

**Section Statistiques :**
- 4 compteurs animés (count-up au scroll) :
  - Nombre de membres actifs
  - Nombre de clubs affiliés
  - Nombre de régions couvertes
  - Années d'existence
- Fond bleu marine (#1A2B4A), texte blanc

**Section Clubs en vedette :**
- Titre "Nos clubs affiliés"
- Grille de 3 cards clubs (les plus récents)
- Chaque card : logo, nom, ville, nb membres, discipline
- Bouton "Voir tous les clubs → carte"

**Section Actualités :**
- Titre "Actualités"
- 3 dernières actualités en cards horizontales
- Image + titre + date + extrait (2 lignes max)
- Lien "Lire la suite"

**Section CTA Affiliation :**
- Fond accent (#E67E22)
- Titre : "Rejoignez la fédération"
- Texte court d'accroche
- Bouton "S'inscrire maintenant" (blanc)

---

### Page Clubs & Carte `/clubs`

- Layout 2 colonnes : carte (70%) + panel latéral (30%)
- Sur mobile : carte plein écran + panel en drawer bottom
- Carte interactive (specs détaillées ci-dessus)
- Panel latéral :
  - Barre de recherche
  - Filtres (région, type)
  - Liste des clubs de la région sélectionnée
  - Cards compactes avec infos essentielles

---

### Page Affiliation `/affiliation`

**Deux onglets :**

**Onglet 1 — Nouvelle inscription**
```
Étape 1 : Informations personnelles
  - Prénom, Nom
  - Date de naissance
  - Sexe (M/F)
  - Email
  - Téléphone
  - Mot de passe + confirmation

Étape 2 : Club & Discipline
  - Sélection région (select)
  - Sélection club (select filtré par région)
  - Grade actuel (optionnel)
  - Discipline

Étape 3 : Récapitulatif + Paiement
  - Résumé de la demande
  - Montant de la licence
  - Note : "Paiement activé prochainement — votre dossier sera validé par l'administration"
  - Bouton "Soumettre ma demande"

Étape 4 : Confirmation
  - Message de succès
  - "Votre demande a été envoyée. Vous recevrez un email de confirmation."
  - Bouton "Accéder à mon espace"
```

**Onglet 2 — Renouvellement**
```
- Connexion requise
- Affichage licence actuelle + date d'expiration
- Bouton "Renouveler ma licence"
- Note paiement identique
```

---

### Page Connexion `/connexion`

- Layout centré, fond bleu nuit avec motif subtil
- Card blanche centrée (max-width: 440px)
- Logo fédération en haut
- Formulaire : Email + Mot de passe
- Lien "Mot de passe oublié"
- Bouton "Se connecter" (full width, accent orange)
- Lien "Pas encore membre ? S'inscrire"
- Gestion erreurs inline (mauvais identifiants, compte inactif)

---

### Espace Membre `/membre`

**Dashboard :**
- Header avec avatar + nom + badge rôle
- Card licence numérique (voir specs ci-dessous)
- Statistiques rapides : date inscription, club, grade
- Notifications récentes

**Page Licence `/membre/licence` :**
- Carte de licence numérique stylisée :
  ```
  ┌─────────────────────────────────────┐
  │  [LOGO]  FÉDÉRATION SHAOLIN SÉNÉGAL │
  │                                     │
  │  Photo    NOM PRÉNOM                │
  │           Club : Club Shaolin Dakar │
  │           Grade : Ceinture noire    │
  │           Discipline : Kung Fu      │
  │                                     │
  │  [QR CODE]    Valide jusqu'au :     │
  │               31/12/2026            │
  │               N° : SHN-2026-00123   │
  └─────────────────────────────────────┘
  ```
- Badge statut (ACTIF en vert / EXPIRÉ en rouge)
- Bouton "Télécharger PDF"
- Bouton "Renouveler" (si expirée ou < 30j)

**Page Profil `/membre/profil` :**
- Formulaire édition profil
- Upload photo de profil
- Changement mot de passe

**Page Paiements `/membre/paiements` :**
- Tableau historique des paiements
- Colonnes : Date, Description, Montant, Statut, Reçu

---

### Espace Club `/club`

**Dashboard :**
- Stats : nb membres actifs, licences expirées, nouvelles inscriptions
- Tableau membres du club avec statut licence
- Actions rapides

**Page Membres `/club/membres` :**
- Tableau complet avec filtres
- Colonnes : Photo, Nom, Grade, Licence status, Date expiration
- Actions : voir profil, contacter

---

### Back-office Admin `/admin`

**Dashboard :**
- KPIs en cards :
  - Total membres actifs
  - Nouveaux cette semaine
  - Licences expirées
  - Revenus du mois (préparatoire V2)
- Graphique membres par région (bar chart)
- Dernières inscriptions (tableau 10 lignes)
- Alertes (licences expirées, demandes en attente)

**Page Membres `/admin/membres` :**
- Tableau avec recherche + filtres (région, statut, club)
- Colonnes : ID, Nom, Club, Région, Licence, Date inscription, Actions
- Actions : Valider, Suspendre, Voir profil
- Export CSV (bouton)
- Pagination

**Page Clubs `/admin/clubs` :**
- Tableau avec filtres
- Actions CRUD (créer, éditer, activer/désactiver)

**Page Actualités `/admin/actualites` :**
- Liste des articles
- Éditeur simple (textarea rich text ou markdown)
- Toggle publié/brouillon
- Upload image

---

## 🔌 COMMUNICATION AVEC L'API

### URL de base

```typescript
// apps/web/.env.local
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### Endpoints à consommer

```typescript
// AUTH
POST   /api/auth/register          → Inscription membre
POST   /api/auth/login             → Connexion → {accessToken, user}
POST   /api/auth/refresh           → Renouveler access token (cookie auto)
POST   /api/auth/logout            → Déconnexion

// MEMBRES
GET    /api/members/me             → Profil du membre connecté
PUT    /api/members/me             → Modifier profil
GET    /api/members/me/license     → Licence active
GET    /api/members/me/payments    → Historique paiements

// CLUBS
GET    /api/clubs                  → Liste clubs (params: region, search)
GET    /api/clubs/:id              → Détail club

// RÉGIONS
GET    /api/regions                → 14 régions du Sénégal

// CARTE
GET    /api/map/clubs              → Clubs/membres géolocalisés (params: region, type, limit)
GET    /api/map/search             → Recherche par nom (params: q)
GET    /api/licenses/verify        → Vérifier QR Code (params: token)

// COMPÉTITIONS
GET    /api/competitions           → Liste compétitions publiques
GET    /api/competitions/:id       → Détail compétition
POST   /api/competitions/:id/inscriptions → Inscription compétition

// ACTUALITÉS
GET    /api/actualites             → Liste articles publiés
GET    /api/actualites/:slug       → Article par slug

// ADMIN
GET    /api/admin/stats            → Statistiques globales
GET    /api/admin/members          → Tous les membres (paginé)
PATCH  /api/admin/members/:id/validate  → Valider inscription
PATCH  /api/admin/members/:id/suspend   → Suspendre membre
GET    /api/admin/clubs            → Tous les clubs
POST   /api/admin/actualites       → Créer article
PUT    /api/admin/actualites/:id   → Modifier article
```

### Format des réponses API

```typescript
// Réponse succès standard
{
  "data": { ... },
  "message": "Opération réussie"
}

// Réponse liste paginée
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20
}

// Réponse erreur
{
  "error": "Message d'erreur lisible",
  "code": "ERROR_CODE"
}
```

### Gestion des erreurs

```typescript
// Intercepteur Axios — comportements attendus :
// 401 → refresh token → retry
// 403 → toast "Accès refusé" + redirect
// 404 → page not found
// 422 → afficher erreurs de validation inline dans les formulaires
// 500 → toast "Erreur serveur, réessayez"
// Network error → toast "Connexion impossible"
```

---

## 📱 RESPONSIVE — Breakpoints

```
Mobile  (< 640px)  : Navigation hamburger, carte plein écran, tableaux scrollables
Tablet  (640-1024) : Layout 2 colonnes partiel
Desktop (> 1024px) : Layout complet, sidebar visible, carte 70/30
```

---

## ⚡ PERFORMANCE

- **Images** : next/image obligatoire pour toutes les images
- **Fonts** : next/font pour Inter (pas de CDN externe)
- **Code splitting** : dynamic import pour la carte et les composants lourds
- **React Query** : `staleTime: 5 * 60 * 1000` (5 min) pour les données statiques (régions, clubs)
- **Skeleton loaders** : sur toutes les zones de données asynchrones
- **Optimistic updates** : pour les actions admin (validation membre)

---

## 🚀 DÉMARRAGE DU PROJET

```bash
# Le projet est déjà initialisé dans apps/web/
# Dépendances déjà installées :
# - react-hook-form, zod, @hookform/resolvers
# - @tanstack/react-query, axios
# - leaflet, react-leaflet, react-leaflet-markercluster
# - lucide-react
# - @types/leaflet

# Ajouter les dépendances manquantes :
cd apps/web
pnpm add zustand framer-motion clsx tailwind-merge
pnpm add -D @types/leaflet

# Variables d'environnement (déjà créé) :
# apps/web/.env.local
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_NAME="Fédération Shaolin Sénégal"
NEXT_PUBLIC_MAP_TILE_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
```

---

## ✅ ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

```
1. Design system de base (Button, Card, Badge, Input, Spinner)
2. Layout public (Header + Footer + Navigation mobile)
3. Page Accueil (sections Hero, Stats, Clubs, Actualités, CTA)
4. Système d'authentification (ConnexionForm + store Zustand + intercepteurs Axios)
5. Middleware de protection des routes
6. Carte interactive (InteractiveMap + GeoJSON + Markers + Modals)
7. Page Clubs avec carte intégrée
8. Page Affiliation (formulaire multi-étapes)
9. Espace Membre (Dashboard + Licence + Profil)
10. Espace Club (Dashboard + Membres)
11. Back-office Admin (Dashboard + tableaux CRUD)
12. Pages publiques restantes (Actualités, Compétitions, Galerie, Contact)
13. Optimisations (Skeleton, Error boundaries, SEO meta)
```

---

## 📌 POINTS D'ATTENTION CRITIQUES

1. **Ne jamais stocker le JWT en localStorage** — uniquement en mémoire (Zustand)
2. **Leaflet nécessite `ssr: false`** dans dynamic import — sinon erreur window is not defined
3. **`withCredentials: true`** sur Axios — obligatoire pour que les cookies httpOnly fonctionnent
4. **GeoJSON Sénégal** — récupérer sur gadm.org ou geoboundaries.org, format FeatureCollection
5. **react-leaflet-markercluster** — vérifier la compatibilité de version avec react-leaflet 4.x
6. **Le backend tourne sur le port 4000** — le frontend sur 3000
7. **CORS** est configuré côté API pour accepter `http://localhost:3000`
8. **Prisma et toute logique BDD** sont côté API uniquement — jamais côté frontend

---

## 🤝 INTÉGRATION FINALE AVEC LE BACKEND

Quand le frontend sera complet, l'intégration se fera en :

1. Vérifier que tous les endpoints consommés correspondent exactement aux routes API
2. Tester le flux auth complet (login → token → refresh → logout)
3. Tester la carte avec de vraies données BDD
4. Tester le flux affiliation de bout en bout
5. Vérifier la vérification QR Code
6. Tests cross-origin (CORS) en conditions réelles

---

*Document généré par Shaoum Service Digital — Projet Fédération Shaolin Sénégal — Avril 2026*
