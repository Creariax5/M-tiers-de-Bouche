# 👨‍🍳 Métiers de Bouche - SaaS HACCP

> Plateforme SaaS pour artisans des métiers de bouche : fiches techniques, étiquettes nutritionnelles et gestion de production conformes HACCP.

![CI Tests](https://github.com/Creariax5/M-tiers-de-Bouche/workflows/CI%20Tests/badge.svg)
![Docker Build](https://github.com/Creariax5/M-tiers-de-Bouche/workflows/Docker%20Build/badge.svg)
![Deploy](https://github.com/Creariax5/M-tiers-de-Bouche/workflows/Deploy/badge.svg)

---

## 🎯 Objectif

Simplifier la gestion quotidienne des **pâtissiers, boulangers et chocolatiers** avec :
- ✅ Fiches techniques de recettes (coûts, marges, temps)
- ✅ Calcul nutritionnel automatique (Ciqual)
- ✅ Détection des 14 allergènes obligatoires
- ✅ Génération d'étiquettes INCO (PDF)
- ✅ Planning de production hebdomadaire
- ✅ Conformité HACCP

---

## 🚀 Stack Technique

### Frontend
- **React 18** + **TypeScript 5** + **Vite**
- **TailwindCSS** + **shadcn/ui**
- **Zustand** (state), **React Hook Form** + **Zod**

### Backend (Microservices Docker)
- **Node.js 20** + **Express/Fastify** + **TypeScript**
- **Prisma 5** + **PostgreSQL 16**
- **JWT** + **bcrypt** + **Helmet**

### Services
```
frontend          → React (port 80/443)
api-gateway       → Routage + Auth (port 3000)
auth-service      → Users + Stripe (port 3001)
recipe-service    → CRUD + Calculs (port 3002)
label-service     → PDF INCO (port 3003)
production-service → Planning (port 3004)
```

### Infrastructure
- **PostgreSQL** (3 bases : auth, recipes, production)
- **Redis 7** (cache)
- **MinIO** (stockage S3)

---

## 📦 Installation

### Prérequis
- Node.js 20+
- Docker Desktop
- PostgreSQL 16 (ou via Docker)

### Setup
```bash
# Cloner le repo
git clone <repo-url>
cd Métiers-de-Bouche

# Variables d'environnement
cp .env.example .env
# Éditer .env avec vos secrets

# Lancer l'infrastructure
docker-compose up -d

# Stripe CLI pour webhooks locaux (développement uniquement)
docker-compose --profile dev up stripe-cli
# Copier le webhook secret (whsec_...) depuis les logs
docker logs saas-stripe-cli
# Coller dans .env → STRIPE_WEBHOOK_SECRET=whsec_...
# Redémarrer auth-service
docker-compose restart auth-service

# Frontend
cd frontend
npm install
npm run dev

# Backend (chaque service)
cd backend/services/auth-service
npm install
npm run dev
```

---

## 📋 Tarifs

| Plan | Prix | Recettes | Export |
|------|------|----------|--------|
| **Starter** | 39€/mois | 50 max | ❌ |
| **Pro** | 69€/mois | Illimité | Excel |
| **Premium** | 129€/mois | Illimité | Excel + Multi-sites |

---

## 🗂️ Structure du Projet

```
Métiers-de-Bouche/
├── docs/
│   ├── cahier_des_charges.md
│   ├── plan_projet_dev.md
│   ├── technical_specs.md
│   ├── security_plan.md
│   ├── design_system.md
│   ├── product_backlog.md
│   └── sprints/
│       ├── sprint-0-infrastructure.md
│       ├── sprint-1-auth-recipes.md
│       ├── sprint-2-ingredients.md
│       ├── sprint-3-labels.md
│       ├── sprint-4-production.md
│       └── sprint-5-stripe.md
│
├── frontend/
│   └── src/
│       ├── features/
│       ├── components/
│       └── lib/
│
├── backend/
│   ├── api-gateway/
│   └── services/
│       ├── auth-service/
│       ├── recipe-service/
│       ├── label-service/
│       └── production-service/
│
├── docker-compose.yml
└── .env
```

---

## 🏃 Développement

### Méthodologie Agile
- **6 sprints** de 2 semaines (11 semaines total)
- **285 story points** pour MVP++
- Planning, daily standup, review, retrospective

### Commandes utiles
```bash
# Tests
npm test                    # Tests unitaires
npm run test:e2e           # Tests E2E

# Linting
npm run lint               # ESLint
npm run format             # Prettier

# Build
npm run build              # Production build
docker-compose build       # Rebuild services
```

### Workflow Git
```bash
git checkout -b feature/US-XXX-description
# Coder...
git commit -m "feat(recipes): US-XXX description"
git push origin feature/US-XXX-description
# Ouvrir une PR
```

---

## 🔒 Sécurité

- ✅ JWT (7 jours, httpOnly cookies)
- ✅ bcrypt (cost 12)
- ✅ Rate limiting (100/15min global, 5/15min login)
- ✅ Helmet + CORS strict
- ✅ Validation Zod partout
- ✅ Sentry monitoring

Voir [`docs/security_plan.md`](docs/security_plan.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`cahier_des_charges.md`](docs/cahier_des_charges.md) | Spécifications complètes |
| [`plan_projet_dev.md`](docs/plan_projet_dev.md) | Plan de développement |
| [`technical_specs.md`](docs/technical_specs.md) | Schémas Prisma + APIs |
| [`security_plan.md`](docs/security_plan.md) | Sécurité + RGPD |
| [`design_system.md`](docs/design_system.md) | Guidelines code + UI |
| [`product_backlog.md`](docs/product_backlog.md) | 47 user stories |

---

## 🎨 Design

- **Simple et professionnel**
- **Bleu** (#2563eb) + **Vert** (#10b981) + **Rouge** (#ef4444)
- **Inter** (typographie)
- **Mobile first**

Voir [`docs/design_system.md`](docs/design_system.md)

---

## 🚢 Déploiement

### Production
- **Frontend** : Vercel
- **Backend** : Railway / Render
- **Database** : Supabase / Neon
- **Storage** : Cloudflare R2 / AWS S3

### Commandes
```bash
# Vercel (frontend)
vercel --prod

# Railway (backend)
railway up

# Docker (staging)
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Roadmap

- [x] Sprint 0 : Infrastructure Docker (1 semaine)
- [x] Sprint 1 : Auth + Recettes (2 semaines)
- [ ] Sprint 2 : Base ingrédients (2 semaines)
- [ ] Sprint 3 : Génération étiquettes (2 semaines)
- [ ] Sprint 4 : Planning production (2 semaines)
- [ ] Sprint 5 : Stripe + Launch (2 semaines)

**Objectif** : 100 clients payants à M12

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/US-XXX`)
3. Commit (`git commit -m "feat: description"`)
4. Push (`git push origin feature/US-XXX`)
5. Ouvrir une Pull Request

---

## 📝 Licence

Propriétaire - Tous droits réservés

---

## 📞 Contact

**Support** : support@metiers-de-bouche.fr  
**Documentation** : https://docs.metiers-de-bouche.fr

---

Made with ❤️ for artisans
