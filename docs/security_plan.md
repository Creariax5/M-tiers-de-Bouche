# 🔒 PLAN DE SÉCURITÉ
## SaaS Métiers de Bouche

**Version** : 1.0  
**Date** : 22 octobre 2025

---

## 🎯 PRIORITÉS SÉCURITÉ MVP

### 🔴 CRITIQUE (À implémenter obligatoirement)

#### 1. Authentification & Sessions
- ✅ Passwords hashés avec **bcrypt** (cost factor 12)
- ✅ JWT avec expiration **7 jours**
- ✅ Tokens stockés en **httpOnly cookies** (pas localStorage pour production)
- ✅ HTTPS obligatoire en production
- ⚠️ **Ajouter** : Rate limiting login (5 tentatives / 15min)
- ⚠️ **Ajouter** : Reset password sécurisé

#### 2. Validation des données
- ✅ Validation **Zod** sur toutes les routes
- ✅ Sanitization des inputs (XSS)
- ✅ Parameterized queries Prisma (anti SQL injection)
- ⚠️ **Ajouter** : Limite taille uploads (5MB images, 10MB PDF)

#### 3. Rate Limiting
```javascript
// api-gateway/src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

// Global
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes
  message: 'Trop de requêtes, réessayez dans 15 minutes'
});

// Login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

// Génération étiquettes
export const labelLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 50
});
```

#### 4. CORS sécurisé
```javascript
// api-gateway/src/middleware/cors.ts
import cors from 'cors';

export const corsOptions = {
  origin: process.env.FRONTEND_URL, // Seulement le frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

#### 5. Headers de sécurité (Helmet)
```javascript
// api-gateway/src/middleware/helmet.ts
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}));
```

---

## 🟡 IMPORTANT (Phase 2 ou si le temps)

### 6. Gestion multi-utilisateurs
**User Stories à ajouter dans Sprint 2** :

```markdown
### US-XXX : Gestion des rôles
**Points** : 8 | **Priorité** : 🟡 SHOULD

**Critères d'acceptation** :
- [ ] 3 rôles : OWNER, ADMIN, EMPLOYEE
- [ ] OWNER : tout peut faire + gestion abonnement
- [ ] ADMIN : CRUD recettes, ingrédients, production
- [ ] EMPLOYEE : lecture seule + production
- [ ] Middleware de vérification rôle

**Schema Prisma** :
```prisma
model User {
  role Role @default(EMPLOYEE)
}

enum Role {
  OWNER
  ADMIN
  EMPLOYEE
}
```

### 7. Audit Logs (traçabilité)
```prisma
model AuditLog {
  id        String   @id @default(uuid())
  userId    String
  action    String   // "CREATE_RECIPE", "DELETE_INGREDIENT"
  entityType String  // "Recipe", "Ingredient"
  entityId  String
  changes   Json?    // Détails des changements
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([createdAt])
}
```

### 8. RGPD - Export données
**User Story Sprint 5** :

```markdown
### US-XXX : RGPD - Export données
**Points** : 5 | **Priorité** : 🟡 SHOULD

**Critères d'acceptation** :
- [ ] GET /auth/export génère ZIP
- [ ] Contenu : recettes (JSON), ingrédients, étiquettes (PDF)
- [ ] Envoi par email
- [ ] Délai max : 48h

**Route** :
GET /auth/export
→ Job async : collecter données de tous les microservices
→ ZIP + envoi email
```

### 9. RGPD - Suppression compte
```markdown
### US-XXX : RGPD - Suppression compte
**Points** : 5 | **Priorité** : 🟡 SHOULD

**Critères d'acceptation** :
- [ ] DELETE /auth/me/account supprime tout
- [ ] Confirmation par email (lien sécurisé)
- [ ] Cascade delete : recettes, ingrédients, productions, labels
- [ ] Anonymisation dans logs (GDPR)
- [ ] Cancel abonnement Stripe
```

---

## 🟢 NICE TO HAVE (Post-MVP)

### 10. 2FA (Two-Factor Authentication)
- SMS ou Authenticator app
- Obligatoire pour plans PRO/PREMIUM

### 11. SSO (Single Sign-On)
- Login avec Google / Microsoft
- Utile pour entreprises

### 12. Chiffrement données sensibles
- Chiffrement at-rest pour données financières
- KMS (Key Management Service)

---

## ⚠️ CHECKLIST SÉCURITÉ AVANT LANCEMENT

### Avant déploiement production :

#### Backend
- [ ] Toutes les variables d'environnement en `.env` (jamais en dur)
- [ ] JWT_SECRET généré aléatoirement (min 32 chars)
- [ ] HTTPS obligatoire (redirection 301)
- [ ] Rate limiting actif sur toutes les routes
- [ ] Helmet configuré
- [ ] CORS restrictif (pas de wildcard `*`)
- [ ] Validation Zod sur toutes les routes
- [ ] Logs d'erreur (Sentry) sans données sensibles
- [ ] PostgreSQL en réseau privé (pas exposé publiquement)
- [ ] Backup automatique DB (quotidien)

#### Frontend
- [ ] Pas de secrets dans le code (API keys, etc.)
- [ ] Content Security Policy (CSP)
- [ ] Sanitization des inputs (DOMPurify)
- [ ] HTTPS strict
- [ ] Cookies httpOnly + secure + sameSite

#### Stripe
- [ ] Webhook secret vérifié
- [ ] Clés API en mode production (pas test)
- [ ] Jamais de `STRIPE_SECRET_KEY` côté frontend

#### Infrastructure
- [ ] Secrets dans GitHub Secrets / Railway Env Vars
- [ ] Firewall configuré (ports 80/443 seulement)
- [ ] Monitoring actif (Sentry)
- [ ] Uptime monitoring (BetterStack)

---

## 🚨 INCIDENTS - Plan de réponse

### En cas de faille détectée :

1. **Immédiat (0-1h)** :
   - Couper l'accès si critique
   - Analyser les logs
   - Identifier l'ampleur

2. **Court terme (1-24h)** :
   - Patch la faille
   - Déploiement en urgence
   - Communication utilisateurs si données compromises

3. **Moyen terme (24-48h)** :
   - Post-mortem détaillé
   - Amélioration process
   - Audit sécurité complet

### Contacts d'urgence :
- **Dev** : [ton email]
- **Hébergeur** : Railway / Vercel support
- **Paiements** : Stripe support

---

## 📚 RESSOURCES

- **OWASP Top 10** : https://owasp.org/www-project-top-ten/
- **RGPD** : https://www.cnil.fr/
- **JWT Best Practices** : https://jwt.io/
- **Node.js Security Checklist** : https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices

---

## ✅ IMPLÉMENTATION SPRINT PAR SPRINT

### Sprint 0 (Infrastructure)
- [x] HTTPS
- [x] Helmet
- [x] CORS
- [ ] Rate limiting global

### Sprint 1 (Auth)
- [ ] Bcrypt passwords
- [ ] JWT secure
- [ ] Rate limiting login
- [ ] Reset password

### Sprint 2 (Recettes/Ingredients)
- [ ] Validation Zod toutes routes
- [ ] Sanitization inputs

### Sprint 5 (Stripe)
- [ ] Webhook signature verification
- [ ] Sentry configuré

### Post-MVP
- [ ] Rôles multi-utilisateurs
- [ ] Audit logs
- [ ] RGPD export/delete

---

**Status** : 🟡 EN COURS  
**Dernière révision** : 22 octobre 2025
