# 07 — Setup Environnement de Travail

**Projet** : Plateforme Web — Fédération Shaolin Sénégal  
**Version** : 1.0  
**Date** : Avril 2026

---

## Prérequis système

| Outil | Version minimale | Vérification |
|---|---|---|
| Node.js | 20 LTS | `node --version` |
| pnpm | 9.x | `pnpm --version` |
| Git | 2.x | `git --version` |
| MySQL | 8.x | `mysql --version` |

---

## Étape 1 — Outils globaux

```bash
# Installer pnpm (gestionnaire de paquets recommandé pour Turborepo)
npm install -g pnpm

# Vérifier l'installation
pnpm --version
```

---

## Étape 2 — Initialiser le monorepo Turborepo

```bash
# Créer le monorepo avec le template officiel
pnpm dlx create-turbo@latest shaolin-federation

# Se déplacer dans le dossier
cd shaolin-federation

# Choisir pnpm comme gestionnaire de paquets lors de l'initialisation
```

---

## Étape 3 — Restructurer les apps

```bash
# Supprimer les apps de démo créées par create-turbo
rm -rf apps/docs apps/web

# Créer l'app Next.js (frontend)
cd apps
pnpm dlx create-next-app@latest web \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# Créer l'app API (backend)
mkdir api && cd api
pnpm init
cd ../..
```

---

## Étape 4 — Configurer le monorepo

```bash
# Remplacer le contenu de turbo.json à la racine
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
EOF

# Remplacer le package.json racine
cat > package.json << 'EOF'
{
  "name": "shaolin-federation",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "turbo": "latest",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
EOF

# Créer le fichier pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF
```

---

## Étape 5 — Créer les packages partagés

```bash
# Créer la structure des packages
mkdir -p packages/types packages/ui packages/config packages/qrcode

# --- Package types ---
cat > packages/types/package.json << 'EOF'
{
  "name": "@shaolin/types",
  "version": "0.0.1",
  "main": "./index.ts",
  "types": "./index.ts"
}
EOF

cat > packages/types/index.ts << 'EOF'
// Rôles utilisateurs
export type UserRole = "MEMBER" | "CLUB_MANAGER" | "ADMIN";

// Statuts de licence
export type LicenseStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "SUSPENDED";

// Statuts de paiement
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

// Providers de paiement
export type PaymentProvider = "WAVE" | "ORANGE_MONEY" | "CARD" | "CASH";

export interface Region {
  id: number;
  nom: string;
  code: string;
  latitude?: number;
  longitude?: number;
}

export interface Club {
  id: number;
  nom: string;
  regionId: number;
  region?: Region;
  ville?: string;
  latitude?: number;
  longitude?: number;
  nomMaitre?: string;
  telephone?: string;
  email?: string;
  nbMembres?: number;
}

export interface Member {
  id: number;
  userId: number;
  clubId: number;
  club?: Club;
  prenom: string;
  nom: string;
  grade?: string;
  discipline?: string;
  photoUrl?: string;
}

export interface License {
  id: number;
  memberId: number;
  uuid: string;
  status: LicenseStatus;
  dateDebut?: string;
  dateFin?: string;
  pdfUrl?: string;
  annee: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
EOF

# --- Package config ---
cat > packages/config/package.json << 'EOF'
{
  "name": "@shaolin/config",
  "version": "0.0.1",
  "main": "./index.js"
}
EOF
```

---

## Étape 6 — Installer les dépendances Frontend (Next.js)

```bash
cd apps/web

# UI & Formulaires
pnpm add react-hook-form zod @hookform/resolvers

# Data fetching
pnpm add @tanstack/react-query axios

# Carte interactive
pnpm add leaflet react-leaflet
pnpm add -D @types/leaflet

# Clustering de marqueurs
pnpm add react-leaflet-markercluster

# Icônes
pnpm add lucide-react

# Types partagés
pnpm add @shaolin/types@"workspace:*"

cd ../..
```

---

## Étape 7 — Installer les dépendances Backend (API)

```bash
cd apps/api

# Init TypeScript
pnpm add -D typescript @types/node ts-node nodemon
pnpm add -D @types/express @types/bcryptjs @types/jsonwebtoken @types/cors

# Framework
pnpm add express cors helmet express-rate-limit

# Auth
pnpm add jsonwebtoken bcryptjs

# BDD
pnpm add prisma @prisma/client
pnpm add -D prisma

# Validation
pnpm add zod

# QR Code & PDF
pnpm add qrcode puppeteer
pnpm add -D @types/qrcode

# Jobs planifiés
pnpm add node-cron
pnpm add -D @types/node-cron

# Upload fichiers
pnpm add cloudinary multer
pnpm add -D @types/multer

# Email
pnpm add nodemailer
pnpm add -D @types/nodemailer

# Logs
pnpm add morgan
pnpm add -D @types/morgan

# Types partagés
pnpm add @shaolin/types@"workspace:*"

cd ../..
```

---

## Étape 8 — Configurer TypeScript Backend

```bash
cd apps/api

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

cat > package.json << 'EOF'
{
  "name": "api",
  "version": "0.0.1",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  }
}
EOF

cd ../..
```

---

## Étape 9 — Initialiser Prisma

```bash
cd apps/api

# Initialiser Prisma avec MySQL
pnpm prisma init --datasource-provider mysql

# Copier le schéma complet (depuis 03-schema-base-de-donnees.md)
# Éditer prisma/schema.prisma avec le schéma du projet

# Créer la base de données MySQL
mysql -u root -p -e "CREATE DATABASE shaolin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Configurer l'URL dans .env
echo 'DATABASE_URL="mysql://root:password@localhost:3306/shaolin_db"' > .env

# Première migration
pnpm prisma migrate dev --name init

# Générer le client Prisma
pnpm prisma generate

# Insérer les données de seed (14 régions)
pnpm prisma db seed

cd ../..
```

---

## Étape 10 — Configurer les variables d'environnement

```bash
# Backend — apps/api/.env
cat > apps/api/.env << 'EOF'
# Base de données
DATABASE_URL="mysql://root:password@localhost:3306/shaolin_db"

# Auth JWT
JWT_SECRET="change_this_to_a_very_long_random_secret_key"
JWT_REFRESH_SECRET="change_this_to_another_very_long_random_secret"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# QR Code
QR_SECRET="change_this_to_a_qr_secret_key"

# Cloudinary (stockage fichiers)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# App
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your@email.com"
SMTP_PASS="your_app_password"
EOF

# Frontend — apps/web/.env.local
cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_MAP_TILE_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
NEXT_PUBLIC_APP_NAME="Fédération Shaolin Sénégal"
EOF

# Ajouter .env au .gitignore racine
cat >> .gitignore << 'EOF'
.env
.env.local
.env.*.local
EOF
```

---

## Étape 11 — Structure des dossiers API

```bash
# Créer toute la structure src/ du backend
mkdir -p apps/api/src/{routes,controllers,services,middlewares,jobs,utils,types}

# Fichier d'entrée principal
cat > apps/api/src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globaux
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// TODO: importer les routes
// app.use('/api/auth', authRouter);
// app.use('/api/regions', regionsRouter);
// app.use('/api/clubs', clubsRouter);

app.listen(PORT, () => {
  console.log(`🥋 API Shaolin démarrée sur http://localhost:${PORT}`);
});
EOF
```

---

## Étape 12 — Lancer le projet

```bash
# Depuis la racine du monorepo

# Installer toutes les dépendances
pnpm install

# Lancer frontend + backend simultanément
pnpm dev

# Ou séparément :
pnpm --filter web dev      # Frontend sur http://localhost:3000
pnpm --filter api dev      # Backend  sur http://localhost:4000

# Vérifier que l'API répond
curl http://localhost:4000/health
# → { "status": "ok" }
```

---

## Commandes Prisma — Référence rapide

```bash
# Lancer depuis apps/api/ ou avec --filter depuis la racine

# Créer une nouvelle migration
pnpm prisma migrate dev --name <nom_migration>

# Appliquer les migrations (production)
pnpm prisma migrate deploy

# Régénérer le client après modif du schéma
pnpm prisma generate

# Interface graphique BDD
pnpm prisma studio

# Reset complet de la BDD (dev uniquement !)
pnpm prisma migrate reset

# Inspecter la BDD existante
pnpm prisma db pull
```

---

## Commandes Turborepo — Référence rapide

```bash
# Lancer tout en dev
pnpm dev

# Build complet du monorepo
pnpm build

# Linter sur tout le monorepo
pnpm lint

# Vérification TypeScript
pnpm type-check

# Cibler une app spécifique
pnpm --filter web build
pnpm --filter api build

# Voir le graphe de dépendances
pnpm turbo run build --graph
```

---

## Git — Initialisation

```bash
# Initialiser le dépôt Git
git init
git add .
git commit -m "chore: init monorepo shaolin-federation"

# Créer les branches de travail
git checkout -b develop
git checkout -b feature/phase-1-setup

# Convention de commits recommandée
# feat: nouvelle fonctionnalité
# fix: correction de bug
# chore: maintenance / config
# docs: documentation
# refactor: refactoring sans changement fonctionnel
```

---

## Vérification finale

```bash
# Tout doit passer sans erreur
node --version          # v20.x.x
pnpm --version          # 9.x.x
git --version           # 2.x.x
mysql --version         # 8.x.x

curl http://localhost:4000/health   # { "status": "ok" }
# Frontend accessible sur http://localhost:3000
# Prisma Studio sur http://localhost:5555 (pnpm prisma studio)
```
