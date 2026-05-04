# 🥋 Shaolin Fédération Sénégal — Monorepo

> Plateforme digitale officielle de la **Fédération Shaolin Sénégal**  
> Développé par **Shaoum Service Digital**

[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 🏗 Structure du monorepo

```
shaolin-federation/
├── apps/
│   ├── api/          # 🚀 API REST — Express + Prisma + MySQL
│   └── web/          # 🌐 Frontend — Next.js (App Router)
│
├── packages/
│   ├── qrcode/       # 📦 Service QR Code partagé
│   ├── types/        # 📦 Types TypeScript partagés
│   ├── ui/           # 📦 Composants UI partagés
│   ├── config/       # 📦 Configurations partagées
│   └── eslint-config/# 📦 Config ESLint
│
├── turbo.json        # Pipeline Turborepo
└── pnpm-workspace.yaml
```

---

## 📱 Applications

| App | Stack | Port | README |
|---|---|---|---|
| **API** | Express + Prisma + MySQL | 4000 | [apps/api/README.md](./apps/api/README.md) |
| **Web** | Next.js 16 App Router + Tailwind | 3000 | [apps/web/README.md](./apps/web/README.md) |

---

## ⚡ Démarrage rapide

### Prérequis

- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x — `npm install -g pnpm`
- **MySQL** 8.x

### Installation

```bash
# Cloner le projet
git clone https://github.com/IbrahimaISIDev/shaolin-federation-api.git
cd shaolin-federation

# Installer toutes les dépendances
pnpm install

# Configurer l'API
cp apps/api/.env.example apps/api/.env
# → Éditer apps/api/.env avec vos valeurs

# Initialiser la base de données
cd apps/api
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

### Lancer les deux apps en parallèle

```bash
# Depuis la racine
pnpm dev
```

Ou séparément :

```bash
# API seule
pnpm --filter api dev

# Frontend seul
pnpm --filter web dev
```

---

## 📚 Documentation technique

| Document | Description |
|---|---|
| [`01-cahier-des-charges.md`](./01-cahier-des-charges.md) | Spécifications fonctionnelles |
| [`02-architecture-technique.md`](./02-architecture-technique.md) | Stack, structure, choix techniques |
| [`03-schema-base-de-donnees.md`](./03-schema-base-de-donnees.md) | Modèle de données complet |
| [`04-carte-interactive.md`](./04-carte-interactive.md) | Spécifications carte Sénégal |
| [`05-roadmap.md`](./05-roadmap.md) | Plan de développement |
| [`06-securite.md`](./06-securite.md) | Politique de sécurité |
| [`08-cahier-des-charges-frontend.md`](./08-cahier-des-charges-frontend.md) | Specs frontend détaillées |

---

## 🌐 Endpoints API (résumé)

| Groupe | Préfixe | Accès |
|---|---|---|
| Authentification | `/api/auth` | Public |
| Régions | `/api/regions` | Public |
| Clubs | `/api/clubs` | Public |
| Actualités | `/api/actualites` | Public |
| Compétitions | `/api/competitions` | Public / Membre |
| Membres | `/api/members` | Membre connecté |
| Licences | `/api/licenses` | Public / Membre / Admin |
| Upload | `/api/upload` | Membre / Admin |
| Administration | `/api/admin` | Admin uniquement |

→ **Documentation complète** : [apps/api/README.md](./apps/api/README.md)

---

## 🔐 Authentification

- **Access Token** : JWT 15 min — header `Authorization: Bearer <token>`
- **Refresh Token** : JWT 7 jours — cookie httpOnly `refresh_token`
- **Rôles** : `MEMBER` · `CLUB_MANAGER` · `ADMIN`

---

## 🗓 Feuille de route

### V1 ✅ (actuel)
- API REST complète (auth, membres, clubs, licences, compétitions, actualités)
- Site public + carte interactive des clubs
- Back-office administrateur complet
- Upload fichiers Cloudinary + génération PDF licence QR

### V2 (à venir)
- Paiement en ligne (Wave, Orange Money)
- Notifications email automatiques
- Application mobile
- Rôle gestionnaire de club

---

## 📄 Licence

Propriétaire — **Shaoum Service Digital** pour la **Fédération Shaolin Sénégal**  
Tous droits réservés © 2025

---

<div align="center">
  <p>Développé avec ❤️ pour la Fédération Shaolin Sénégal</p>
</div>
