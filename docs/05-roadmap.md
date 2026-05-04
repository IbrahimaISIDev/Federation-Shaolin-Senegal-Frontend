# 05 — Roadmap de Développement

**Projet** : Plateforme Web — Fédération Shaolin Sénégal  
**Version** : 1.0  
**Approche** : Livraisons itératives par phase

---

## Vue d'ensemble

```
Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4
Setup       Carte        Affiliation  Admin +
Fondations  Interactive  & Licences   Compétitions
```

---

## Phase 1 — Fondations & Setup

**Objectif** : Monorepo opérationnel, BDD en place, API de base fonctionnelle.

### Tâches

- [ ] Initialisation monorepo Turborepo
- [ ] Configuration TypeScript, ESLint, Prettier
- [ ] Package `@shaolin/types` — types partagés (Member, Club, License...)
- [ ] Setup Next.js 14 avec Tailwind CSS
- [ ] Setup Node.js + Express + Prisma
- [ ] Connexion MySQL + première migration
- [ ] Seed BDD : 14 régions du Sénégal
- [ ] Système d'authentification :
  - Inscription / Connexion
  - JWT Access Token (15min) + Refresh Token (7j)
  - Middleware de protection des routes
  - Gestion des rôles (`member`, `club_manager`, `admin`)
- [ ] Endpoints API de base :
  - `GET /api/regions`
  - `GET /api/clubs`
  - `GET /api/members`
- [ ] Déploiement environnement de développement

### Livrable

Monorepo fonctionnel, authentification opérationnelle, API répondant avec données de seed.

---

## Phase 2 — Carte Interactive

**Objectif** : Page `/clubs` avec carte du Sénégal entièrement fonctionnelle.

### Tâches

- [ ] Intégration Leaflet.js + react-leaflet
- [ ] Récupération et intégration du GeoJSON Sénégal (14 régions)
- [ ] Couche GeoJSON cliquable avec highlight au survol
- [ ] Chargement des clubs/membres par région au clic
- [ ] Marqueurs différenciés (clubs vs membres)
- [ ] Clustering avec `leaflet.markercluster`
- [ ] Modal fiche détaillée au clic sur un marqueur
- [ ] Barre de recherche (nom club / membre)
- [ ] Filtres (par région, par type)
- [ ] Import dynamique Next.js (`ssr: false`)
- [ ] Optimisation performance (React Query, index BDD)
- [ ] Responsive mobile

### Livrable

Page carte interactive complète, navigable, avec données réelles depuis la BDD.

---

## Phase 3 — Affiliation & Licences

**Objectif** : Système d'inscription, gestion des licences et QR Code opérationnel.

### Tâches

- [ ] Page d'inscription en ligne (`/affiliation`)
- [ ] Création de compte membre
- [ ] Flux de paiement :
  - V1 : Paiement manuel validé par admin (`CASH`)
  - V2 (future) : Intégration Wave / Orange Money
- [ ] Génération automatique de licence à la validation
- [ ] Génération QR Code sécurisé (UUID signé JWT)
- [ ] Génération PDF licence (Puppeteer)
- [ ] Upload PDF sur Cloudinary
- [ ] Endpoint de vérification QR : `GET /api/licenses/verify`
- [ ] Espace membre :
  - Profil utilisateur
  - Statut de licence (`ACTIVE` / `EXPIRED` / `PENDING`)
  - Téléchargement PDF licence
  - Historique des paiements
- [ ] Notifications email (confirmation inscription, rappel expiration)
- [ ] CRON job quotidien : passage en `EXPIRED` des licences échues
- [ ] Renouvellement de licence

### Livrable

Flux d'affiliation complet de bout en bout (inscription → paiement → licence PDF + QR Code).

---

## Phase 4 — Back-office & Compétitions

**Objectif** : Administration complète et module compétitions.

### Tâches

**Back-office admin :**
- [ ] Dashboard admin (statistiques : membres, clubs, revenus, régions)
- [ ] Gestion des membres (liste, validation, suspension, export CSV)
- [ ] Gestion des clubs (liste, activation, édition)
- [ ] Gestion des paiements (historique, validation manuelle)
- [ ] Publication d'actualités (CRUD)
- [ ] Gestion de la galerie (photos/vidéos)

**Module compétitions :**
- [ ] Création et gestion des compétitions
- [ ] Page publique des compétitions (`/competitions`)
- [ ] Inscription des membres en ligne
- [ ] Gestion des catégories
- [ ] Saisie et publication des résultats
- [ ] Tableau des classements

**Espace club :**
- [ ] Dashboard club
- [ ] Liste des membres du club
- [ ] Suivi des licences membres

### Livrable

Plateforme complète V1 prête pour la mise en production.

---

## Mise en production

- [ ] Audit sécurité (headers HTTP, HTTPS, rate limiting)
- [ ] Tests end-to-end (Playwright)
- [ ] Optimisation performance (Lighthouse > 90)
- [ ] Déploiement Railway / Render
- [ ] Configuration domaine + SSL
- [ ] Monitoring (UptimeRobot ou Sentry)
- [ ] Documentation utilisateur (guide admin)

---

## Phase 2 (future) — Application mobile

> Hors périmètre V1. L'architecture monorepo est prête à l'accueillir.

- `apps/mobile/` — React Native + Expo
- Partage des packages `@shaolin/types`, `@shaolin/qrcode`
- Fonctionnalités : consultation licence, QR Code, notifications, compétitions

---

## Récap des décisions techniques actées

| Décision | Choix | Raison |
|---|---|---|
| Structure | Monorepo Turborepo | Partage de code, CI/CD unifiée, prêt pour le mobile |
| Frontend | Next.js 14 | SSR pour SEO, App Router, écosystème React |
| Backend | Node.js + Express | Simplicité, performance, large écosystème |
| ORM | Prisma | Typage fort, migrations, Studio UI |
| BDD | MySQL | Fiabilité, hébergement facile au Sénégal |
| Carte | Leaflet.js | Open source, gratuit, léger |
| Paiement | V2 (Wave, Orange Money) | APIs à contractualiser |
| Mobile | Phase 2 | Hors scope V1 |
