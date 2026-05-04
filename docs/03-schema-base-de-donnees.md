# 03 — Schéma Base de Données

**Projet** : Plateforme Web — Fédération Shaolin Sénégal  
**ORM** : Prisma  
**BDD** : MySQL 8.x  
**Version** : 1.0

---

## 1. Entités & Relations

```
Region (1) ──────< Club (N)
Region (1) ──────< Competition (N)
Club   (1) ──────< Member (N)
User   (1) ──────── Member (1)
Member (1) ──────< License (N)
License(1) ──────< Payment (N)
Member (N) >────< Competition (N)  via Inscription
```

---

## 2. Schéma Prisma complet

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// REGION
// ─────────────────────────────────────────
model Region {
  id           Int           @id @default(autoincrement())
  nom          String        @db.VarChar(100)
  code         String        @unique @db.VarChar(10)
  latitude     Float?
  longitude    Float?
  createdAt    DateTime      @default(now())

  clubs        Club[]
  competitions Competition[]

  @@map("regions")
}

// ─────────────────────────────────────────
// USER
// ─────────────────────────────────────────
model User {
  id          Int       @id @default(autoincrement())
  email       String    @unique @db.VarChar(255)
  phone       String?   @db.VarChar(20)
  password    String    @db.VarChar(255)
  role        UserRole  @default(MEMBER)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  member      Member?
  refreshTokens RefreshToken[]

  @@index([email])
  @@map("users")
}

enum UserRole {
  MEMBER
  CLUB_MANAGER
  ADMIN
}

// ─────────────────────────────────────────
// REFRESH TOKEN
// ─────────────────────────────────────────
model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique @db.VarChar(512)
  userId    Int
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("refresh_tokens")
}

// ─────────────────────────────────────────
// CLUB
// ─────────────────────────────────────────
model Club {
  id          Int      @id @default(autoincrement())
  nom         String   @db.VarChar(150)
  regionId    Int
  ville       String?  @db.VarChar(100)
  adresse     String?  @db.VarChar(255)
  latitude    Float?
  longitude   Float?
  nomMaitre   String?  @db.VarChar(100)
  telephone   String?  @db.VarChar(20)
  email       String?  @db.VarChar(255)
  description String?  @db.Text
  logoUrl     String?  @db.VarChar(500)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  region      Region   @relation(fields: [regionId], references: [id])
  members     Member[]

  @@index([regionId])
  @@map("clubs")
}

// ─────────────────────────────────────────
// MEMBER
// ─────────────────────────────────────────
model Member {
  id          Int          @id @default(autoincrement())
  userId      Int          @unique
  clubId      Int
  prenom      String       @db.VarChar(100)
  nom         String       @db.VarChar(100)
  dateNaissance DateTime?
  sexe        Sexe?
  grade       String?      @db.VarChar(50)
  discipline  String?      @db.VarChar(100)
  photoUrl    String?      @db.VarChar(500)
  latitude    Float?
  longitude   Float?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  club          Club         @relation(fields: [clubId], references: [id])
  licenses      License[]
  inscriptions  Inscription[]

  @@index([clubId])
  @@map("members")
}

enum Sexe {
  M
  F
}

// ─────────────────────────────────────────
// LICENSE
// ─────────────────────────────────────────
model License {
  id          Int           @id @default(autoincrement())
  memberId    Int
  uuid        String        @unique @default(uuid()) @db.VarChar(36)
  qrToken     String        @unique @db.VarChar(512)
  status      LicenseStatus @default(PENDING)
  dateDebut   DateTime?
  dateFin     DateTime?
  pdfUrl      String?       @db.VarChar(500)
  annee       Int
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  member      Member        @relation(fields: [memberId], references: [id])
  payments    Payment[]

  @@index([memberId])
  @@index([status, dateFin])
  @@map("licenses")
}

enum LicenseStatus {
  PENDING      // En attente de paiement
  ACTIVE       // Licence valide
  EXPIRED      // Expirée
  SUSPENDED    // Suspendue
}

// ─────────────────────────────────────────
// PAYMENT
// ─────────────────────────────────────────
model Payment {
  id          Int           @id @default(autoincrement())
  licenseId   Int
  montant     Decimal       @db.Decimal(10, 2)
  devise      String        @default("XOF") @db.VarChar(5)
  provider    PaymentProvider
  transactionRef String?   @db.VarChar(255)
  status      PaymentStatus @default(PENDING)
  paidAt      DateTime?
  createdAt   DateTime      @default(now())

  license     License       @relation(fields: [licenseId], references: [id])

  @@index([licenseId])
  @@map("payments")
}

enum PaymentProvider {
  WAVE
  ORANGE_MONEY
  CARD
  CASH          // Paiement manuel (admin)
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

// ─────────────────────────────────────────
// COMPETITION
// ─────────────────────────────────────────
model Competition {
  id          Int       @id @default(autoincrement())
  titre       String    @db.VarChar(200)
  description String?   @db.Text
  regionId    Int
  lieu        String?   @db.VarChar(200)
  dateDebut   DateTime
  dateFin     DateTime?
  categories  Json?     // ["seniors", "juniors", "kata", ...]
  imageUrl    String?   @db.VarChar(500)
  isPublished Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  region        Region        @relation(fields: [regionId], references: [id])
  inscriptions  Inscription[]
  resultats     Resultat[]

  @@index([regionId])
  @@index([dateDebut])
  @@map("competitions")
}

// ─────────────────────────────────────────
// INSCRIPTION (table pivot Member <-> Competition)
// ─────────────────────────────────────────
model Inscription {
  id            Int       @id @default(autoincrement())
  memberId      Int
  competitionId Int
  categorie     String?   @db.VarChar(100)
  statut        String    @default("inscrit") @db.VarChar(50)
  createdAt     DateTime  @default(now())

  member        Member      @relation(fields: [memberId], references: [id])
  competition   Competition @relation(fields: [competitionId], references: [id])

  @@unique([memberId, competitionId])
  @@index([competitionId])
  @@map("inscriptions")
}

// ─────────────────────────────────────────
// RESULTAT
// ─────────────────────────────────────────
model Resultat {
  id            Int       @id @default(autoincrement())
  competitionId Int
  memberId      Int
  categorie     String?   @db.VarChar(100)
  classement    Int?
  points        Float?
  medaille      String?   @db.VarChar(20)  // "or", "argent", "bronze"
  createdAt     DateTime  @default(now())

  competition   Competition @relation(fields: [competitionId], references: [id])

  @@index([competitionId])
  @@map("resultats")
}

// ─────────────────────────────────────────
// ACTUALITE
// ─────────────────────────────────────────
model Actualite {
  id          Int       @id @default(autoincrement())
  titre       String    @db.VarChar(255)
  slug        String    @unique @db.VarChar(255)
  contenu     String    @db.LongText
  imageUrl    String?   @db.VarChar(500)
  isPublished Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([slug])
  @@index([isPublished, publishedAt])
  @@map("actualites")
}
```

---

## 3. Index critiques

Les index suivants sont **indispensables** pour la performance à grande échelle (objectif : couverture nationale, 5 000 à 20 000+ membres) :

```sql
-- Déjà définis dans le schéma Prisma, générés automatiquement
-- par `prisma migrate`

-- Clubs par région (carte interactive)
INDEX idx_clubs_region (region_id)

-- Membres par club
INDEX idx_members_club (club_id)

-- Licences par statut + date (CRON expiration)
INDEX idx_licenses_status (status, date_fin)

-- Compétitions à venir
INDEX idx_competitions_date (date_debut)

-- Actualités publiées
INDEX idx_actualites_published (is_published, published_at)
```

---

## 4. Commandes Prisma

```bash
# Créer la première migration
pnpm --filter api prisma migrate dev --name init

# Appliquer les migrations en production
pnpm --filter api prisma migrate deploy

# Générer le client Prisma
pnpm --filter api prisma generate

# Ouvrir Prisma Studio (UI BDD)
pnpm --filter api prisma studio

# Seed de données de test
pnpm --filter api prisma db seed
```

---

## 5. Seed de développement

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REGIONS_SENEGAL = [
  { nom: 'Dakar',      code: 'DK', latitude: 14.6937, longitude: -17.4441 },
  { nom: 'Thiès',      code: 'TH', latitude: 14.7886, longitude: -16.9260 },
  { nom: 'Saint-Louis',code: 'SL', latitude: 16.0179, longitude: -16.4896 },
  { nom: 'Diourbel',   code: 'DB', latitude: 14.6550, longitude: -16.2314 },
  { nom: 'Louga',      code: 'LG', latitude: 15.6179, longitude: -16.2243 },
  { nom: 'Fatick',     code: 'FK', latitude: 14.3390, longitude: -16.4110 },
  { nom: 'Kaolack',    code: 'KL', latitude: 14.1520, longitude: -16.0726 },
  { nom: 'Kaffrine',   code: 'KF', latitude: 14.1059, longitude: -15.5506 },
  { nom: 'Tambacounda',code: 'TC', latitude: 13.7707, longitude: -13.6673 },
  { nom: 'Kédougou',   code: 'KD', latitude: 12.5549, longitude: -12.1758 },
  { nom: 'Kolda',      code: 'KO', latitude: 12.8979, longitude: -14.9410 },
  { nom: 'Ziguinchor', code: 'ZG', latitude: 12.5681, longitude: -16.2719 },
  { nom: 'Sédhiou',    code: 'SD', latitude: 12.7081, longitude: -15.5572 },
  { nom: 'Matam',      code: 'MT', latitude: 15.6560, longitude: -13.2558 },
];

async function main() {
  // Insérer les 14 régions
  for (const region of REGIONS_SENEGAL) {
    await prisma.region.upsert({
      where: { code: region.code },
      update: {},
      create: region,
    });
  }
  console.log('✅ 14 régions insérées');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```
