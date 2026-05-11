# 06 — Sécurité & Bonnes Pratiques

**Projet** : Plateforme Web — Fédération Shaolin Sénégal  
**Version** : 1.0

---

## 1. Authentification

### JWT — Stratégie double token

```
Access Token  : durée de vie 15 minutes, stocké en mémoire (JS)
Refresh Token : durée de vie 7 jours, stocké en httpOnly cookie
```

**Règles impératives :**

- Ne jamais stocker l'access token dans `localStorage` (vulnérable aux XSS)
- Le refresh token est en cookie `HttpOnly; Secure; SameSite=Strict`
- Rotation du refresh token à chaque renouvellement
- Blacklist des refresh tokens révoqués (table `refresh_tokens` en BDD)

```typescript
// Envoi du refresh token côté serveur
res.cookie('refresh_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
});
```

### Mots de passe

- Hashage **bcrypt** avec salt rounds = 12
- Longueur minimale : 8 caractères
- Pas de règle de complexité imposée (contre-productif selon NIST 2024)

---

## 2. Protection des routes API

### Middleware d'authentification

```typescript
// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non authentifié' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};
```

### Middleware de rôles

```typescript
// middlewares/role.middleware.ts
export const requireRole = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    next();
  };

// Usage
router.get('/admin/members', requireAuth, requireRole('ADMIN'), handler);
```

---

## 3. Protection contre les attaques courantes

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Limite globale
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Limite stricte sur l'authentification
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
```

### Headers de sécurité (Helmet)

```typescript
import helmet from 'helmet';
app.use(helmet());
// Active : X-Frame-Options, X-XSS-Protection, HSTS,
//          Content-Security-Policy, X-Content-Type-Options
```

### CORS

```typescript
import cors from 'cors';
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // nécessaire pour les cookies httpOnly
}));
```

### Validation des entrées (Zod)

```typescript
// Toutes les entrées API sont validées avec Zod avant traitement
import { z } from 'zod';

const CreateMemberSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  prenom: z.string().min(1).max(100),
  nom: z.string().min(1).max(100),
  clubId: z.number().int().positive(),
});

// Dans le controller
const data = CreateMemberSchema.parse(req.body); // Throw si invalide
```

---

## 4. QR Code — Sécurité anti-fraude

```
Génération :
  UUID unique (v4) → signé avec JWT HS256 (secret QR dédié)
  → Encodé dans le QR Code

Vérification :
  1. Décodage du QR token
  2. Vérification signature JWT
  3. Lookup BDD : licence associée à ce UUID
  4. Vérification statut (ACTIVE) et date d'expiration
  5. Réponse immédiate

Sécurités :
  - Secret QR différent du secret JWT d'authentification
  - Impossible de forger un QR sans le secret serveur
  - Vérification en temps réel (pas de validation hors-ligne)
```

---

## 5. Protection des données personnelles

- Aucune donnée personnelle en clair dans les logs
- Les mots de passe ne sont jamais loggés ni renvoyés dans les réponses API
- Les données de paiement sensibles ne sont pas stockées en BDD (seule la référence transaction externe)
- Accès aux données membres limité par rôle :
  - Un membre voit uniquement son propre profil
  - Un club voit uniquement ses membres
  - L'admin voit tout

---

## 6. Sauvegardes

| Fréquence | Type | Rétention |
|---|---|---|
| Quotidienne | Dump MySQL complet | 30 jours |
| Hebdomadaire | Snapshot complet (BDD + fichiers) | 3 mois |
| Avant chaque déploiement | Backup manuel | Indéfini |

---

## 7. HTTPS & Infrastructure

- HTTPS obligatoire en production (certificat Let's Encrypt via Railway/Render)
- Redirection automatique HTTP → HTTPS
- HSTS activé (Strict-Transport-Security)
- Variables d'environnement : jamais dans le code source, toujours dans `.env` (non versionné)

---

## 8. Checklist pré-déploiement

- [ ] `NODE_ENV=production` défini
- [ ] Tous les secrets en variables d'environnement (pas dans le code)
- [ ] HTTPS actif et HSTS configuré
- [ ] Rate limiting activé sur toutes les routes publiques
- [ ] Helmet configuré
- [ ] CORS restreint au domaine de production uniquement
- [ ] Logs des erreurs activés (sans données sensibles)
- [ ] Sauvegardes automatiques configurées
- [ ] Test de vérification QR Code en conditions réelles
