# 02 — Architecture Technique

**Projet** : Plateforme Web — Fédération Shaolin Sénégal  
**Version** : 1.0  
**Date** : Avril 2026

---

## 1. Vue d'ensemble

L'application est structurée en **monorepo Turborepo**, permettant de partager du code entre les différentes applications (web, API, et future app mobile) tout en maintenant une CI/CD unifiée.

```
shaolin-federation/
├── apps/
│   ├── web/              ← Next.js 14 (frontend)
│   └── api/              ← Node.js + Express (backend)
├── packages/
│   ├── types/            ← Types TypeScript partagés
│   ├── ui/               ← Composants UI réutilisables
│   ├── qrcode/           ← Logique QR Code partagée
│   └── config/           ← ESLint, Tailwind, TS configs
├── turbo.json
├── package.json
└── .env.example
```

> **Note** : Le répertoire `apps/mobile/` sera ajouté en Phase 2 sans modifier la structure existante.

---

## 2. Stack technique

### 2.1 Frontend — `apps/web`

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 14 (App Router) | Framework React SSR/SSG |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | 3.x | Styles utilitaires |
| **react-leaflet** | 4.x | Carte interactive |
| **Leaflet.markercluster** | 1.x | Clustering de marqueurs |
| **React Query** | 5.x | Fetching & cache côté client |
| **Zod** | 3.x | Validation des formulaires |
| **React Hook Form** | 7.x | Gestion des formulaires |

### 2.2 Backend — `apps/api`

| Technologie | Version | Rôle |
|---|---|---|
| **Node.js** | 20 LTS | Runtime |
| **Express** | 4.x | Framework HTTP |
| **TypeScript** | 5.x | Typage statique |
| **Prisma** | 5.x | ORM + migrations |
| **MySQL** | 8.x | Base de données |
| **JWT** | — | Authentification |
| **qrcode** (npm) | 1.x | Génération QR Code |
| **Puppeteer** | 21.x | Génération PDF licence |
| **node-cron** | 3.x | Jobs planifiés (expiration licences) |
| **Zod** | 3.x | Validation des entrées API |

### 2.3 Infrastructure

| Service | Usage | Environnement |
|---|---|---|
| **Railway** ou **Render** | Hébergement app + BDD | V1 |
| **Cloudinary** | Stockage photos / fichiers | V1 |
| **AWS / VPS dédié** | Migration possible sans refacto | V2+ |

---

## 3. Structure détaillée

### 3.1 Frontend `apps/web`

```
apps/web/
├── app/
│   ├── (public)/           ← Layout public (header/footer)
│   │   ├── page.tsx        ← Accueil
│   │   ├── a-propos/
│   │   ├── clubs/          ← Carte interactive
│   │   ├── actualites/
│   │   ├── competitions/
│   │   ├── galerie/
│   │   ├── contact/
│   │   └── affiliation/    ← Inscription / renouvellement
│   ├── (auth)/
│   │   └── connexion/
│   ├── (membre)/           ← Espace membre (protégé)
│   │   └── membre/
│   ├── (club)/             ← Espace club (protégé)
│   │   └── club/
│   └── (admin)/            ← Back-office (protégé)
│       └── admin/
├── components/
│   ├── map/                ← Composants carte Leaflet
│   ├── ui/                 ← Boutons, inputs, modals...
│   ├── licence/            ← Affichage licence + QR
│   └── layout/             ← Header, Footer, Sidebar
├── lib/
│   ├── api.ts              ← Client HTTP (React Query)
│   └── auth.ts             ← Helpers JWT côté client
└── middleware.ts            ← Protection des routes privées
```

### 3.2 Backend `apps/api`

```
apps/api/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── members.ts
│   │   ├── clubs.ts
│   │   ├── licenses.ts
│   │   ├── competitions.ts
│   │   ├── regions.ts
│   │   └── admin.ts
│   ├── controllers/
│   ├── services/
│   │   ├── license.service.ts    ← Génération licence + QR
│   │   ├── pdf.service.ts        ← Génération PDF
│   │   └── qr.service.ts         ← Vérification QR
│   ├── middlewares/
│   │   ├── auth.middleware.ts    ← Vérification JWT
│   │   └── role.middleware.ts    ← Contrôle des rôles
│   ├── jobs/
│   │   └── license-expiry.job.ts ← CRON expiration licences
│   └── prisma/
│       └── schema.prisma
└── package.json
```

---

## 4. Authentification & Rôles

### 4.1 Flux d'authentification

```
POST /api/auth/login
  → Vérifie email + password (bcrypt)
  → Retourne access_token (15min) + refresh_token (7j)

POST /api/auth/refresh
  → Vérifie refresh_token
  → Retourne nouveau access_token

POST /api/auth/logout
  → Invalide le refresh_token (blacklist Redis ou DB)
```

### 4.2 Rôles utilisateurs

| Rôle | Description | Accès |
|---|---|---|
| `public` | Visiteur non connecté | Pages publiques uniquement |
| `member` | Athlète inscrit | Espace membre |
| `club_manager` | Responsable de club | Espace club |
| `admin` | Staff fédération | Back-office complet |

---

## 5. Carte interactive — Architecture

```
Clic région (frontend)
  → GET /api/clubs?region=dakar&type=club&page=1
  → Réponse : { clubs: [...], total, page }
  → Affichage marqueurs Leaflet
  → Clic marqueur → Modal fiche détaillée
```

**Points techniques clés :**

- GeoJSON des 14 régions du Sénégal (fichier statique)
- Chargement des données **à la demande** par région (pas de chargement global)
- Clustering automatique avec `leaflet.markercluster`
- Index BDD sur `region_id` et coordonnées GPS
- Pagination : max 100 résultats par requête

---

## 6. Génération de licence

```
Paiement confirmé (V2: webhook Wave/Orange Money)
  → LicenseService.generate(memberId)
  → Création enregistrement License en BDD
  → UUID unique signé (JWT HS256, secret serveur)
  → Génération QR Code PNG (librairie qrcode)
  → Génération PDF licence (Puppeteer)
  → Upload PDF sur Cloudinary
  → Notification membre (email)
```

**Vérification QR Code lors d'un événement :**

```
Scan QR Code
  → GET /api/licenses/verify?token=<uuid_signé>
  → Vérification signature JWT
  → Vérification statut (actif / expiré)
  → Réponse : { valid: true/false, member: {...} }
```

---

## 7. Variables d'environnement

### `apps/api/.env`

```env
# Base de données
DATABASE_URL="mysql://user:password@localhost:3306/shaolin_db"

# Auth
JWT_SECRET="<secret_très_long>"
JWT_REFRESH_SECRET="<autre_secret>"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# QR Code
QR_SECRET="<secret_qr>"

# Stockage
CLOUDINARY_URL="cloudinary://..."

# App
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_MAP_TILE_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
```

---

## 8. CI/CD (Turborepo)

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {},
    "type-check": {},
    "test": {}
  }
}
```

**Commandes principales :**

```bash
# Installer toutes les dépendances
pnpm install

# Lancer en développement
pnpm dev

# Build complet
pnpm build

# Linter sur tout le monorepo
pnpm lint

# Migrations Prisma
pnpm --filter api prisma migrate dev
```
