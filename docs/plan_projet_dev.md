# 🚀 PLAN DE PROJET - Architecture & Stack
## SaaS Métiers de Bouche - Microservices Docker

**Version** : 2.0  
**Dernière mise à jour** : 6 novembre 2025

---

## 🎯 TL;DR

**Architecture** : Microservices Docker anti-monolithique  
**Stack** : React 18 + TypeScript + Node.js 20 + PostgreSQL 16 + Prisma  
**Infra** : docker-compose avec 8 services isolés  
**Déploiement** : Vercel (frontend) + Railway (backend) + Supabase (DB)

**Voir aussi** :
- Schémas Prisma complets → `technical_specs.md`
- Sécurité & JWT → `security_plan.md`
- Commandes Docker → `NAVIGATION.md`

---

## 📐 1. ARCHITECTURE GLOBALE

### Principe anti-monolithe

⚠️ **IMPORTANT** :
- 1 service = 1 responsabilité = 1 DB = 1 container
- Communication via API REST uniquement
- Scalabilité indépendante par service
- Déploiement et versioning indépendants

### Diagramme simplifié

```
[Utilisateurs] → [CDN Cloudflare] → [Frontend React/Nginx]
                                            ↓
                                     [API Gateway :3000]
                                     (Auth JWT + Rate Limiting)
                                            ↓
                    ┌───────────────────────┼───────────────────────┐
                    ↓                       ↓                       ↓
            [Auth Service :3001]   [Recipe Service :3002]  [Label Service :3003]
            (Users, JWT)           (CRUD, Calculs)         (PDF Gen)
                    ↓                       ↓                       ↓
            [DB: saas_auth]        [DB: saas_recipes]     [MinIO S3]
                                            ↓
                                   [Production Service :3004]
                                   (Planning)
                                            ↓
                                   [DB: saas_production]

[Redis :6379] → Cache calculs + Sessions
[MinIO :9000] → Photos + PDFs
[PostgreSQL :5432] → 3 bases séparées
```

### Services Docker

| Service | Port | DB | Responsabilité |
|---------|------|----|----------------|
| Frontend | 80 | - | React + Nginx |
| API Gateway | 3000 | - | Routing + Auth JWT |
| auth-service | 3001 | saas_auth | Users, login, JWT |
| recipe-service | 3002 | saas_recipes | CRUD, nutrition, allergènes, coûts |
| label-service | 3003 | - | Génération PDF étiquettes |
| production-service | 3004 | saas_production | Planning, listes courses |
| PostgreSQL | 5432 | 3 DB | Données persistantes |
| Redis | 6379 | - | Cache + Sessions |
| MinIO | 9000 | - | Stockage S3 (photos, PDFs) |

---

## 🛠️ 2. STACK TECHNIQUE

### Frontend

```json
{
  "framework": "React 18+",
  "language": "TypeScript 5+",
  "bundler": "Vite",
  "styling": "TailwindCSS + shadcn/ui",
  "state": "Zustand",
  "routing": "React Router v6",
  "forms": "React Hook Form + Zod",
  "data": "TanStack Query"
}
```

**Structure** :
```
frontend/src/
├── api/          # Axios clients
├── components/ui/  # shadcn/ui
├── features/     # Par domaine (auth, recipes, labels)
├── hooks/        # Custom hooks
├── pages/        # Routes
├── store/        # Zustand
└── types/        # TypeScript
```

### Backend

```json
{
  "runtime": "Node.js 20+",
  "framework": "Express.js 4+",
  "language": "TypeScript 5+",
  "orm": "Prisma 5+",
  "database": "PostgreSQL 16+",
  "auth": "JWT (jsonwebtoken)",
  "validation": "Zod",
  "pdf": "PDFKit",
  "email": "Resend",
  "payments": "Stripe",
  "tests": "Jest + Supertest"
}
```

**Structure microservice type** :
```
backend/services/recipe-service/
├── Dockerfile
├── prisma/schema.prisma
├── src/
│   ├── controllers/  # Routes handlers
│   ├── services/     # Business logic
│   ├── middleware/   # Auth, validation
│   ├── routes/       # Express routes
│   └── server.ts     # Entry point
└── tests/            # Jest
```

### Base de données

**PostgreSQL 16** avec **3 bases séparées** :
- `saas_auth` : Users, abonnements
- `saas_recipes` : Recipes, Ingredients
- `saas_production` : Planning, tâches

**ORM** : Prisma (voir `technical_specs.md` pour schémas complets)

---

## 🐳 3. DOCKER COMPOSE

### Fichier principal (simplifié)

```yaml
# docker-compose.yml (racine)
version: '3.9'

networks:
  saas-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  minio-data:

services:
  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [api-gateway]
    
  api-gateway:
    build: ./backend/api-gateway
    ports: ["3000:3000"]
    environment:
      - AUTH_SERVICE_URL=http://auth-service:3001
      - RECIPE_SERVICE_URL=http://recipe-service:3002
    depends_on: [auth-service, recipe-service, redis]
    
  auth-service:
    build: ./backend/services/auth-service
    ports: ["3001:3001"]
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/saas_auth
    depends_on: [postgres]
    
  recipe-service:
    build: ./backend/services/recipe-service
    ports: ["3002:3002"]
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/saas_recipes
    depends_on: [postgres, redis, minio]
    
  label-service:
    build: ./backend/services/label-service
    ports: ["3003:3003"]
    depends_on: [recipe-service, minio]
    
  production-service:
    build: ./backend/services/production-service
    ports: ["3004:3004"]
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/saas_production
    depends_on: [postgres, recipe-service]
    
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      - POSTGRES_MULTIPLE_DATABASES=saas_auth,saas_recipes,saas_production
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./docker/init-databases.sh:/docker-entrypoint-initdb.d/init.sh
    
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redis-data:/data]
    
  minio:
    image: minio/minio:latest
    ports: ["9000:9000", "9001:9001"]
    volumes: [minio-data:/data]
    command: server /data --console-address ":9001"
```

### Dockerfiles

**Frontend (Multi-stage)** :
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Service (Template)** :
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npx prisma generate
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
```

### Communication inter-services

```typescript
// recipe-service appelle auth-service
const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

export const verifyToken = async (token: string) => {
  const response = await axios.post(`${AUTH_URL}/verify`, { token });
  return response.data;
};
```

### Avantages architecture

| Aspect | Bénéfice |
|--------|----------|
| Scalabilité | Scale uniquement recipe-service si calculs lourds |
| Maintenance | Update label-service sans toucher aux autres |
| Isolation | Bug dans un service n'affecte pas les autres |
| Développement | Équipes parallèles sur services différents |
| Testing | Tester chaque service indépendamment |
| Déploiement | Deploy que le service modifié |

---

## 🔐 4. AUTHENTIFICATION & SÉCURITÉ

### JWT Flow

```
1. POST /api/auth/login → Backend vérifie bcrypt
2. Génère JWT (expiration: 7 jours)
3. Retourne { accessToken, user }
4. Frontend stocke dans localStorage
5. Toutes requêtes : Authorization: Bearer <token>
6. Middleware vérifie token sur chaque route
```

### Middleware (simplifié)

```typescript
export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ error: 'Token invalide' });
  }
};
```

### Sécurité additionnelle

- **CORS** : Whitelist domaines autorisés
- **Helmet** : Headers sécurité HTTP
- **Rate Limiting** : 100 req/15min par IP
- **Validation Zod** : Toutes entrées utilisateur
- **Prisma** : Protection SQL injection native

Voir `security_plan.md` pour détails complets.

---

## 📦 5. HÉBERGEMENT & DÉPLOIEMENT

### Services recommandés

| Composant | Service | Prix |
|-----------|---------|------|
| Frontend | Vercel | Gratuit (<100k req/mois) |
| Backend | Railway | ~5$/mois |
| Database | Supabase | Gratuit (<500MB) |
| Storage | Cloudflare R2 | 0.015$/GB |
| Paiements | Stripe | 1.4% + 0.25€/tx |
| Emails | Resend | 100 emails/jour gratuits |
| Monitoring | Sentry | Gratuit (<5k events/mois) |

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci && npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 🧪 6. TESTS

### Stratégie

- **Backend** : >80% coverage (Jest + Supertest)
- **Frontend** : >60% coverage (Jest + React Testing Library)
- **E2E** : Parcours critiques (Playwright)

### Exemple backend

```typescript
describe('POST /api/recipes', () => {
  it('should create recipe', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tarte citron', category: 'PATISSERIE' });
    
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Tarte citron');
  });
});
```

---

## 🗓️ 7. PLANNING DÉVELOPPEMENT

### Phase 1 : Setup Docker (Semaine 1)
- [ ] docker-compose.yml avec 8 services
- [ ] Dockerfile par microservice
- [ ] PostgreSQL multi-DB (script init)
- [ ] Test : `docker-compose up -d` OK

### Phase 2 : MVP Core (Semaines 2-6)

**Sprint 1 : Recipe Service** (S2-S3)
- [ ] CRUD recettes
- [ ] Calcul allergènes automatique
- [ ] Calcul nutrition automatique
- [ ] Calcul coût de revient
- [ ] Cache Redis

**Sprint 2 : Base Ingrédients** (S3-S4)
- [ ] Import Ciqual (1000+ ingrédients)
- [ ] Recherche autocomplete
- [ ] Ingrédients personnalisés

**Sprint 3 : Label Service** (S4-S5)
- [ ] Génération PDF étiquettes
- [ ] Templates réglementaires INCO
- [ ] Upload MinIO

**Sprint 4 : Production Service** (S5-S6)
- [ ] Planning production
- [ ] Calcul quantités
- [ ] Liste de courses PDF

### Phase 3 : Beta (Semaines 7-8)
- [ ] 20 beta-testeurs
- [ ] Feedback + corrections

### Phase 4 : Launch (Semaine 9)
- [ ] Stripe production
- [ ] Landing page
- [ ] Support client (Crisp)
- [ ] Lancement public

---

## 💡 8. BONNES PRATIQUES

### Code Quality
- ESLint + Prettier par service
- Commits conventionnels (feat, fix, chore)
- Code Review obligatoire
- Branches : feature/*, bugfix/*
- Endpoint `/health` sur chaque service
- Semantic versioning

### Performance
- **Frontend** : Code splitting, lazy loading, debounce
- **Backend** : Pagination (limit 50), caching Redis, indexes DB

---

## 📚 9. STRUCTURE PROJET

```
Métiers-de-Bouche/
├── docker-compose.yml
├── .env.example
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── api/
│   │   ├── components/ui/
│   │   ├── features/
│   │   ├── pages/
│   │   └── store/
│   └── package.json
│
├── backend/
│   ├── api-gateway/
│   │   ├── Dockerfile
│   │   └── src/
│   │
│   └── services/
│       ├── auth-service/
│       │   ├── Dockerfile
│       │   ├── prisma/schema.prisma
│       │   └── src/
│       │
│       ├── recipe-service/
│       │   ├── Dockerfile
│       │   ├── prisma/schema.prisma
│       │   └── src/
│       │       ├── controllers/
│       │       ├── services/
│       │       │   ├── nutrition.service.ts
│       │       │   ├── allergen.service.ts
│       │       │   └── pricing.service.ts
│       │       └── routes/
│       │
│       ├── label-service/
│       └── production-service/
│
├── docker/
│   └── init-databases.sh
│
├── docs/
│   ├── IMPORTANT_INSTRUCTIONS.md  # Règles dev
│   ├── NAVIGATION.md              # Guide navigation
│   ├── technical_specs.md         # Schémas Prisma complets
│   ├── security_plan.md           # Sécurité détaillée
│   └── CONFORMITE_LEGALE.md       # Règlement INCO
│
└── .github/workflows/
    └── deploy.yml
```

---

## 🚀 10. COMMANDES DOCKER ESSENTIELLES

### Développement quotidien

```bash
# Démarrer tous les services
docker-compose up -d

# Voir logs d'un service
docker-compose logs -f recipe-service

# Rebuild après modification
docker-compose up -d --build recipe-service

# Arrêter tout
docker-compose down

# Reset complet (⚠️ supprime DB)
docker-compose down -v
```

### Database

```bash
# Accéder à PostgreSQL
docker exec -it saas-postgres psql -U postgres -d saas_recipes

# Prisma migrations
docker exec -it saas-recipe-service npx prisma migrate dev

# Prisma Studio (interface DB)
docker exec -it saas-recipe-service npx prisma studio
```

### Redis

```bash
# CLI Redis
docker exec -it saas-redis redis-cli

# Vider cache
docker exec -it saas-redis redis-cli FLUSHALL
```

### MinIO

```bash
# Console : http://localhost:9001
# Login : voir .env (MINIO_ACCESS_KEY / MINIO_SECRET_KEY)
```

### Scaling

```bash
# Lancer 3 instances recipe-service
docker-compose up -d --scale recipe-service=3
```

Voir `NAVIGATION.md` pour commandes complètes.

---

## 🎯 CHECKLIST AVANT LANCEMENT

### Technique
- [ ] Tests >80% backend, >60% frontend
- [ ] Lighthouse score >90
- [ ] Headers sécurité (Helmet) configurés
- [ ] HTTPS obligatoire (redirection 301)
- [ ] Backups DB automatiques

### Business
- [ ] Stripe mode production
- [ ] Emails transactionnels OK
- [ ] Support client opérationnel
- [ ] Analytics configurés (Sentry, PostHog)

### Legal
- [ ] CGU/CGV rédigées
- [ ] Politique confidentialité (RGPD)
- [ ] Mentions légales
- [ ] Cookies consent banner

---

## 📞 RESSOURCES

### Documentation
- **IMPORTANT_INSTRUCTIONS.md** : Règles critiques développement
- **technical_specs.md** : Schémas Prisma + API endpoints complets
- **security_plan.md** : JWT, rate limiting, RGPD détaillé
- **CONFORMITE_LEGALE.md** : Règlement INCO (300k€ amende)
- **NAVIGATION.md** : Guide "où trouver quoi" + commandes

### Liens externes
- **Docker** : https://docs.docker.com/compose/
- **Prisma** : https://www.prisma.io/docs/
- **Stripe** : https://stripe.com/docs/api
- **Vercel** : https://vercel.com/docs
- **Railway** : https://docs.railway.app/

---

**Version** : 2.0 (optimisée -58%)  
**Dernière mise à jour** : 6 novembre 2025  
**Contact** : Équipe technique
