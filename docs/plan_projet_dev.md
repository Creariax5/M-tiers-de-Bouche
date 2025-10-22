# 🚀 PLAN DE PROJET - DÉVELOPPEMENT
## SaaS Métiers de Bouche - Architecture & Technologies

---

## 📐 1. ARCHITECTURE GLOBALE

### Type d'application
**SaaS Multi-tenant** avec architecture **microservices modulaire en Docker**

⚠️ **IMPORTANT : Architecture anti-monolithe**
- Chaque service est isolé dans son propre conteneur Docker
- Communication inter-services via API REST
- Scalabilité indépendante de chaque service
- Déploiement et versioning indépendants

```
┌─────────────────────────────────────────────────────────┐
│                    UTILISATEURS                          │
│  (Navigateur Web - Desktop, Tablette, Mobile)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 CDN (Cloudflare)                         │
│              (Assets statiques + Cache)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         🐳 FRONTEND SERVICE (Docker Container)           │
│              React + TypeScript + Nginx                  │
│  - Interface utilisateur                                 │
│  - Routing (React Router)                                │
│  - State Management (Zustand)                            │
│  - UI Components (TailwindCSS + shadcn/ui)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│         🐳 API GATEWAY (Docker Container)                │
│              Node.js + Express                           │
│  - Routage vers microservices                            │
│  - Authentification JWT centralisée                      │
│  - Rate limiting global                                  │
│  - CORS & Security headers                               │
└──────┬──────────┬─────────────┬─────────────┬───────────┘
       │          │             │             │
       ▼          ▼             ▼             ▼
┌──────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐
│🐳 AUTH   │ │🐳 RECIPE│ │🐳 LABEL  │ │🐳 PRODUCTION │
│ SERVICE  │ │ SERVICE │ │ SERVICE  │ │   SERVICE    │
│          │ │         │ │          │ │              │
│- Login   │ │- CRUD   │ │- PDF Gen │ │- Planning    │
│- Register│ │- Calculs│ │- Templates│ │- Ingredients │
│- JWT     │ │  nutri  │ │- Print   │ │- Lists       │
│- Users   │ │- Coûts  │ └──────────┘ └──────────────┘
└─────┬────┘ └────┬────┘
      │           │
      │           │
      ▼           ▼
┌──────────────────────────────────────────────────────────┐
│         🐳 DATABASE SERVICE (Docker Container)            │
│                    PostgreSQL 16                          │
│  - Users, Recipes, Ingredients, Production, Orders       │
│  - Volumes Docker pour persistance                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│     🐳 STORAGE SERVICE (Docker Container - MinIO)         │
│              Compatible S3                                │
│  - Photos recettes                                        │
│  - PDFs étiquettes                                        │
│  - Logos entreprises                                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│         🐳 CACHE SERVICE (Docker Container - Redis)       │
│  - Cache des calculs nutritionnels                        │
│  - Sessions utilisateurs                                  │
│  - Rate limiting data                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              SERVICES EXTERNES                            │
│  - Stripe (paiements)                                     │
│  - Resend/SendGrid (emails)                               │
│  - Sentry (monitoring erreurs)                            │
│  - PostHog/Plausible (analytics)                          │
└──────────────────────────────────────────────────────────┘
```

### Architecture Docker Compose
Tous les services sont orchestrés via **docker-compose.yml** :
- **Frontend** : Container Nginx servant le build React
- **API Gateway** : Reverse proxy et authentification
- **Auth Service** : Gestion utilisateurs et JWT
- **Recipe Service** : CRUD recettes + calculs
- **Label Service** : Génération PDFs étiquettes
- **Production Service** : Planning et listes
- **PostgreSQL** : Base de données
- **Redis** : Cache et sessions
- **MinIO** : Stockage S3-compatible (local dev)

### Communication inter-services
- **API REST interne** : Services communiquent via HTTP/JSON
- **Network Docker** : Tous les services sur le même réseau `saas-network`
- **Service Discovery** : Via noms de services Docker (ex: `http://recipe-service:3001`)
- **Pas de couplage direct** : Chaque service a son propre code et DB schema

---

## 🛠️ 2. STACK TECHNIQUE DÉTAILLÉ

### 2.1 Frontend

#### Technologies principales
```json
{
  "framework": "React 18+",
  "language": "TypeScript 5+",
  "bundler": "Vite",
  "styling": "TailwindCSS 3+",
  "ui_library": "shadcn/ui + Radix UI",
  "state_management": "Zustand (ou Redux Toolkit)",
  "routing": "React Router v6",
  "forms": "React Hook Form + Zod",
  "data_fetching": "TanStack Query (React Query)",
  "date_handling": "date-fns",
  "charts": "Recharts",
  "pdf_generation": "jsPDF + html2canvas",
  "icons": "Lucide React"
}
```

#### Structure des dossiers
```
frontend/
├── Dockerfile              # Multi-stage build
├── nginx.conf             # Configuration Nginx
├── .dockerignore
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── api/              # Appels API
│   │   ├── recipes.ts
│   │   ├── ingredients.ts
│   │   ├── labels.ts
│   │   └── auth.ts
│   ├── components/       # Composants réutilisables
│   │   ├── ui/          # shadcn/ui components
│   │   ├── forms/       # Formulaires
│   │   ├── layout/      # Header, Sidebar, Footer
│   │   └── shared/      # Composants partagés
│   ├── features/         # Features par domaine
│   │   ├── auth/
│   │   ├── recipes/
│   │   ├── ingredients/
│   │   ├── labels/
│   │   └── production/
│   ├── hooks/            # Custom hooks
│   │   ├── useRecipes.ts
│   │   ├── useAuth.ts
│   │   └── useDebounce.ts
│   ├── lib/              # Utilitaires
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── validators.ts
│   ├── store/            # State management (Zustand)
│   │   ├── authStore.ts
│   │   └── settingsStore.ts
│   ├── types/            # Types TypeScript
│   │   ├── recipe.ts
│   │   ├── ingredient.ts
│   │   └── user.ts
│   ├── pages/            # Pages/Routes
│   │   ├── Dashboard.tsx
│   │   ├── Recipes.tsx
│   │   ├── RecipeDetail.tsx
│   │   ├── Ingredients.tsx
│   │   ├── Labels.tsx
│   │   ├── Production.tsx
│   │   ├── Settings.tsx
│   │   └── Auth/
│   │       ├── Login.tsx
│   │       └── Register.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

#### Dépendances clés (package.json)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.0",
    "typescript": "^5.4.5",
    "@tanstack/react-query": "^5.35.0",
    "zustand": "^4.5.2",
    "react-hook-form": "^7.51.3",
    "zod": "^3.23.6",
    "axios": "^1.6.8",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.379.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "recharts": "^2.12.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.10",
    "tailwindcss": "^3.4.3",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

---

### 2.2 Backend

#### Technologies principales
```json
{
  "runtime": "Node.js 20+ LTS",
  "framework": "Express.js 4+ (ou Fastify 4+)",
  "language": "TypeScript 5+",
  "orm": "Prisma 5+",
  "database": "PostgreSQL 16+",
  "authentication": "JWT (jsonwebtoken)",
  "validation": "Zod",
  "file_upload": "Multer + AWS SDK",
  "pdf_generation": "PDFKit",
  "email": "Resend (ou Nodemailer)",
  "payments": "Stripe SDK",
  "testing": "Jest + Supertest",
  "logging": "Winston + Morgan"
}
```

#### Structure des dossiers (Architecture Microservices)
```
backend/
├── api-gateway/              # 🐳 API Gateway Service
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── cors.ts
│   │   ├── routes/
│   │   │   └── index.ts     # Routage vers microservices
│   │   └── server.ts
│   └── .dockerignore
│
├── services/
│   ├── auth-service/        # 🐳 Auth Microservice
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   └── schema.prisma  # Uniquement tables User
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── routes/
│   │   │   │   └── auth.routes.ts
│   │   │   └── server.ts
│   │   └── .dockerignore
│   │
│   ├── recipe-service/      # 🐳 Recipe Microservice
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   └── schema.prisma  # Tables Recipe, Ingredient
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── recipe.controller.ts
│   │   │   │   └── ingredient.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── recipe.service.ts
│   │   │   │   ├── nutrition.service.ts
│   │   │   │   ├── allergen.service.ts
│   │   │   │   └── pricing.service.ts
│   │   │   ├── routes/
│   │   │   │   ├── recipe.routes.ts
│   │   │   │   └── ingredient.routes.ts
│   │   │   └── server.ts
│   │   └── .dockerignore
│   │
│   ├── label-service/       # 🐳 Label Generation Microservice
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── label.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── label.service.ts
│   │   │   │   └── pdf.service.ts
│   │   │   ├── templates/
│   │   │   │   └── label-templates/
│   │   │   ├── routes/
│   │   │   │   └── label.routes.ts
│   │   │   └── server.ts
│   │   └── .dockerignore
│   │
│   └── production-service/  # 🐳 Production Planning Microservice
│       ├── Dockerfile
│       ├── package.json
│       ├── prisma/
│       │   └── schema.prisma  # Table Production
│       ├── src/
│       │   ├── controllers/
│       │   │   └── production.controller.ts
│       │   ├── services/
│       │   │   └── production.service.ts
│       │   ├── routes/
│       │   │   └── production.routes.ts
│       │   └── server.ts
│       └── .dockerignore
│
├── shared/                   # Code partagé entre services
│   ├── types/
│   ├── utils/
│   └── constants/
│
├── docker-compose.yml        # Orchestration de tous les services
├── docker-compose.dev.yml    # Override pour développement
├── docker-compose.prod.yml   # Override pour production
└── .env.example

backend/ (ANCIEN - À SUPPRIMER, remplacé par l'architecture ci-dessus)
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   ├── migrations/        # Migrations SQL
│   └── seed.ts           # Données initiales
├── src/
│   ├── config/           # Configuration
│   │   ├── database.ts
│   │   ├── auth.ts
│   │   └── aws.ts
│   ├── middleware/       # Middlewares Express
│   │   ├── auth.ts      # Vérification JWT
│   │   ├── validate.ts  # Validation Zod
│   │   ├── errorHandler.ts
│   │   └── rateLimit.ts
│   ├── routes/           # Routes API
│   │   ├── auth.routes.ts
│   │   ├── recipes.routes.ts
│   │   ├── ingredients.routes.ts
│   │   ├── labels.routes.ts
│   │   ├── production.routes.ts
│   │   └── users.routes.ts
│   ├── controllers/      # Logique métier
│   │   ├── auth.controller.ts
│   │   ├── recipes.controller.ts
│   │   ├── ingredients.controller.ts
│   │   ├── labels.controller.ts
│   │   └── production.controller.ts
│   ├── services/         # Business logic
│   │   ├── recipe.service.ts
│   │   ├── nutrition.service.ts   # Calculs nutritionnels
│   │   ├── allergen.service.ts    # Détection allergènes
│   │   ├── pricing.service.ts     # Calcul coûts
│   │   ├── label.service.ts       # Génération étiquettes
│   │   ├── email.service.ts
│   │   ├── storage.service.ts     # Upload S3
│   │   └── stripe.service.ts
│   ├── models/           # Types & Interfaces
│   │   ├── User.ts
│   │   ├── Recipe.ts
│   │   ├── Ingredient.ts
│   │   └── Label.ts
│   ├── utils/            # Utilitaires
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── logger.ts
│   ├── types/            # Types TypeScript
│   │   ├── express.d.ts
│   │   └── custom.d.ts
│   ├── app.ts            # Configuration Express
│   └── server.ts         # Point d'entrée
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── package.json
├── tsconfig.json
└── jest.config.js
```

#### Dépendances clés (package.json)
```json
{
  "dependencies": {
    "express": "^4.19.2",
    "typescript": "^5.4.5",
    "@prisma/client": "^5.13.0",
    "prisma": "^5.13.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "zod": "^3.23.6",
    "dotenv": "^16.4.5",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.2.0",
    "multer": "^1.4.5-lts.1",
    "@aws-sdk/client-s3": "^3.556.0",
    "pdfkit": "^0.15.0",
    "stripe": "^15.2.0",
    "resend": "^3.2.0",
    "winston": "^3.13.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.7",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.6",
    "tsx": "^4.7.3",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.2"
  }
}
```

---

### 2.3 Base de données (PostgreSQL + Prisma)

#### Schéma Prisma (prisma/schema.prisma)
```prisma
// Configuration
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modèles

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  firstName     String
  lastName      String
  companyName   String?
  companyLogo   String?   // URL S3
  address       String?
  phone         String?
  
  // Paramètres entreprise
  defaultMargin Float     @default(2.5)  // Coefficient multiplicateur
  
  // Abonnement
  plan          Plan      @default(STARTER)
  stripeCustomerId String?
  subscriptionId   String?
  subscriptionStatus String? // active, canceled, past_due
  trialEndsAt   DateTime?
  
  // Relations
  recipes       Recipe[]
  ingredients   CustomIngredient[]
  productions   Production[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
}

enum Plan {
  STARTER   // 39€/mois - 50 recettes
  PRO       // 69€/mois - illimité
  PREMIUM   // 129€/mois - multi-sites
}

model Recipe {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name            String
  category        Category
  description     String?
  
  // Portions
  servings        Int       @default(1)
  
  // Temps (en minutes)
  prepTime        Int?
  cookTime        Int?
  
  // Coûts & Prix
  costPrice       Float     @default(0)    // Calculé automatiquement
  sellingPrice    Float?
  margin          Float?                   // Coefficient utilisé
  
  // Photo
  imageUrl        String?
  
  // Relations
  ingredients     RecipeIngredient[]
  subRecipes      RecipeSubRecipe[] @relation("ParentRecipe")
  usedInRecipes   RecipeSubRecipe[] @relation("SubRecipe")
  
  // Nutritionnel (pour 100g) - calculé automatiquement
  calories        Float?
  protein         Float?
  carbs           Float?
  fat             Float?
  salt            Float?
  
  // Allergènes (array de strings)
  allergens       String[]  // ["gluten", "lait", "oeufs", ...]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId, category])
  @@index([name])
}

enum Category {
  PATISSERIE
  VIENNOISERIE
  CHOCOLATERIE
  CONFISERIE
  GLACERIE
  TRAITEUR
  AUTRE
}

model RecipeIngredient {
  id              String     @id @default(uuid())
  recipeId        String
  recipe          Recipe     @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  // Référence ingrédient (base ou custom)
  ingredientId    String?
  baseIngredient  BaseIngredient? @relation(fields: [ingredientId], references: [id])
  customIngredientId String?
  customIngredient CustomIngredient? @relation(fields: [customIngredientId], references: [id])
  
  quantity        Float
  unit            Unit      @default(GRAM)
  
  // Gestion des pertes
  wastePercent    Float     @default(0)  // % de perte (ex: 5%)
  
  @@index([recipeId])
}

// Gestion des sous-recettes (composition)
model RecipeSubRecipe {
  id              String    @id @default(uuid())
  
  parentRecipeId  String
  parentRecipe    Recipe    @relation("ParentRecipe", fields: [parentRecipeId], references: [id], onDelete: Cascade)
  
  subRecipeId     String
  subRecipe       Recipe    @relation("SubRecipe", fields: [subRecipeId], references: [id], onDelete: Cascade)
  
  quantity        Float     // Quantité de la sous-recette utilisée
  unit            Unit      @default(GRAM)
  
  @@unique([parentRecipeId, subRecipeId])
}

enum Unit {
  GRAM
  KILOGRAM
  MILLILITER
  LITER
  PIECE
  TABLESPOON
  TEASPOON
}

// Base d'ingrédients pré-remplie (Ciqual)
model BaseIngredient {
  id              String    @id @default(uuid())
  name            String
  category        String    // Farine, Sucre, Matière grasse...
  
  // Valeurs nutritionnelles (pour 100g)
  calories        Float
  protein         Float
  carbs           Float
  fat             Float
  salt            Float
  
  // Allergènes
  allergens       String[]
  
  // Prix moyen indicatif
  averagePrice    Float?
  unit            Unit      @default(KILOGRAM)
  
  // Relations
  usedInRecipes   RecipeIngredient[]
  
  @@index([name, category])
}

// Ingrédients personnalisés par utilisateur
model CustomIngredient {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name            String
  category        String?
  
  // Valeurs nutritionnelles (pour 100g)
  calories        Float     @default(0)
  protein         Float     @default(0)
  carbs           Float     @default(0)
  fat             Float     @default(0)
  salt            Float     @default(0)
  
  // Allergènes
  allergens       String[]  @default([])
  
  // Prix & Fournisseur
  price           Float
  unit            Unit      @default(KILOGRAM)
  supplier        String?
  
  // Traçabilité
  lotNumber       String?
  expiryDate      DateTime?
  
  // Relations
  usedInRecipes   RecipeIngredient[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId, name])
}

// Planning de production
model Production {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  productionDate  DateTime
  recipeId        String
  
  quantity        Int       // Nombre de portions
  status          ProductionStatus @default(PLANNED)
  
  notes           String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId, productionDate])
}

enum ProductionStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

---

## � 3. DOCKER & ARCHITECTURE MODULAIRE

### 3.1 Principe : Microservices, pas Monolithe

#### ❌ Ce qu'on NE fait PAS (Monolithe)
- Un seul serveur avec toute la logique
- Couplage fort entre fonctionnalités
- Scalabilité impossible sans tout redéployer
- Un bug peut crasher toute l'app

#### ✅ Ce qu'on FAIT (Microservices)
- **Séparation des responsabilités** : Chaque service = 1 domaine métier
- **Isolation** : Un service qui crash n'affecte pas les autres
- **Scalabilité granulaire** : Scale uniquement le service Recipe si besoin
- **Déploiement indépendant** : Update Label Service sans toucher aux autres
- **Techno mixte possible** : Recipe en Node, Label en Python si besoin

### 3.2 Docker Compose - Fichier principal

#### `docker-compose.yml` (racine du projet)
```yaml
version: '3.9'

networks:
  saas-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  minio-data:

services:
  # ==============================
  # FRONTEND SERVICE
  # ==============================
  frontend:
    container_name: saas-frontend
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    environment:
      - VITE_API_URL=http://api-gateway:3000
    networks:
      - saas-network
    depends_on:
      - api-gateway
    restart: unless-stopped

  # ==============================
  # API GATEWAY (Reverse Proxy)
  # ==============================
  api-gateway:
    container_name: saas-api-gateway
    build:
      context: ./backend/api-gateway
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - AUTH_SERVICE_URL=http://auth-service:3001
      - RECIPE_SERVICE_URL=http://recipe-service:3002
      - LABEL_SERVICE_URL=http://label-service:3003
      - PRODUCTION_SERVICE_URL=http://production-service:3004
      - REDIS_URL=redis://redis:6379
    networks:
      - saas-network
    depends_on:
      - redis
      - auth-service
      - recipe-service
      - label-service
      - production-service
    restart: unless-stopped

  # ==============================
  # MICROSERVICES
  # ==============================
  
  auth-service:
    container_name: saas-auth-service
    build:
      context: ./backend/services/auth-service
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/saas_auth
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
    networks:
      - saas-network
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  recipe-service:
    container_name: saas-recipe-service
    build:
      context: ./backend/services/recipe-service
      dockerfile: Dockerfile
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/saas_recipes
      - REDIS_URL=redis://redis:6379
      - MINIO_URL=http://minio:9000
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
    networks:
      - saas-network
    depends_on:
      - postgres
      - redis
      - minio
    restart: unless-stopped

  label-service:
    container_name: saas-label-service
    build:
      context: ./backend/services/label-service
      dockerfile: Dockerfile
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=production
      - MINIO_URL=http://minio:9000
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
      - RECIPE_SERVICE_URL=http://recipe-service:3002
    networks:
      - saas-network
    depends_on:
      - minio
      - recipe-service
    restart: unless-stopped

  production-service:
    container_name: saas-production-service
    build:
      context: ./backend/services/production-service
      dockerfile: Dockerfile
    ports:
      - "3004:3004"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/saas_production
      - RECIPE_SERVICE_URL=http://recipe-service:3002
    networks:
      - saas-network
    depends_on:
      - postgres
      - recipe-service
    restart: unless-stopped

  # ==============================
  # INFRASTRUCTURE
  # ==============================
  
  postgres:
    container_name: saas-postgres
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_MULTIPLE_DATABASES=saas_auth,saas_recipes,saas_production
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./scripts/init-databases.sh:/docker-entrypoint-initdb.d/init-databases.sh
    networks:
      - saas-network
    restart: unless-stopped

  redis:
    container_name: saas-redis
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - saas-network
    restart: unless-stopped

  minio:
    container_name: saas-minio
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"  # Console UI
    environment:
      - MINIO_ROOT_USER=${MINIO_ACCESS_KEY}
      - MINIO_ROOT_PASSWORD=${MINIO_SECRET_KEY}
    volumes:
      - minio-data:/data
    command: server /data --console-address ":9001"
    networks:
      - saas-network
    restart: unless-stopped

  # ==============================
  # MONITORING (Optionnel)
  # ==============================
  
  # prometheus:
  #   container_name: saas-prometheus
  #   image: prom/prometheus:latest
  #   ports:
  #     - "9090:9090"
  #   volumes:
  #     - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
  #   networks:
  #     - saas-network

  # grafana:
  #   container_name: saas-grafana
  #   image: grafana/grafana:latest
  #   ports:
  #     - "3001:3000"
  #   networks:
  #     - saas-network
```

### 3.3 Dockerfiles pour chaque service

#### Frontend Dockerfile (Multi-stage)
```dockerfile
# frontend/Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json et installer dépendances
COPY package*.json ./
RUN npm ci

# Copier le code source et build
COPY . .
RUN npm run build

# Stage 2: Production avec Nginx
FROM nginx:alpine

# Copier le build React
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Service Dockerfile (Template)
```dockerfile
# backend/services/{service-name}/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copier package.json
COPY package*.json ./
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build TypeScript
RUN npm run build

# Installer Prisma Client (si nécessaire)
RUN npx prisma generate

EXPOSE 3001

# Run migrations puis start
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
```

### 3.4 Communication inter-services

#### Exemple : Recipe Service appelle Auth Service
```typescript
// recipe-service/src/middleware/auth.ts
import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

export const verifyToken = async (token: string) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/verify`, {
      token
    });
    return response.data;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

#### Exemple : Label Service récupère données recette
```typescript
// label-service/src/services/label.service.ts
import axios from 'axios';

const RECIPE_SERVICE_URL = process.env.RECIPE_SERVICE_URL || 'http://recipe-service:3002';

export const generateLabel = async (recipeId: string) => {
  // 1. Récupérer données recette depuis Recipe Service
  const recipe = await axios.get(`${RECIPE_SERVICE_URL}/recipes/${recipeId}`);
  
  // 2. Générer PDF avec les données
  const pdf = await createPDF(recipe.data);
  
  // 3. Upload vers MinIO
  await uploadToStorage(pdf);
  
  return pdf;
};
```

### 3.5 Avantages de cette architecture

| Aspect | Bénéfice |
|--------|----------|
| **Scalabilité** | Scale uniquement recipe-service si forte charge calculs |
| **Maintenance** | Update label-service sans toucher aux autres |
| **Isolation** | Bug dans production-service n'affecte pas les recettes |
| **Développement** | Équipes peuvent travailler sur services différents en parallèle |
| **Testing** | Tester chaque service indépendamment |
| **Déploiement** | Deploy que le service modifié |
| **Monitoring** | Logs et métriques par service |

### 3.6 Commandes Docker utiles

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs d'un service
docker-compose logs -f recipe-service

# Rebuild un service après modification
docker-compose up -d --build recipe-service

# Arrêter tous les services
docker-compose down

# Supprimer volumes (reset DB)
docker-compose down -v

# Scale un service (3 instances)
docker-compose up -d --scale recipe-service=3

# Accéder au shell d'un container
docker exec -it saas-recipe-service sh

# Voir l'état des services
docker-compose ps
```

---

## �🔐 4. AUTHENTIFICATION & SÉCURITÉ

### Flux d'authentification JWT
```
1. User login → POST /api/auth/login
2. Backend vérifie credentials (bcrypt)
3. Génère JWT token (expiration: 7 jours)
4. Retourne { accessToken, user }
5. Frontend stocke token dans localStorage
6. Toutes les requêtes incluent: Authorization: Bearer <token>
7. Middleware backend vérifie token à chaque requête
```

### Middleware d'authentification (auth.ts)
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};
```

### Sécurité additionnelle
- **CORS** : Whitelist des domaines autorisés
- **Helmet** : Headers de sécurité HTTP
- **Rate Limiting** : Max 100 requêtes/15min par IP
- **Validation** : Zod sur toutes les entrées utilisateur
- **SQL Injection** : Protection native avec Prisma
- **XSS** : Sanitization des inputs

---

## 📦 5. HÉBERGEMENT & DÉPLOIEMENT

### Environnements

| Environnement | Frontend | Backend | Database | Usage |
|---------------|----------|---------|----------|-------|
| **Development** | localhost:5173 | localhost:3000 | PostgreSQL local | Dev local |
| **Staging** | staging.app.com | api-staging.app.com | Supabase Dev | Tests pré-prod |
| **Production** | app.com | api.app.com | Supabase Prod | Clients réels |

### Services recommandés

#### Frontend
- **Vercel** (recommandé) ou Netlify
  - Déploiement automatique depuis GitHub
  - Preview branches
  - CDN global
  - SSL gratuit
  - Prix : Gratuit jusqu'à 100k requêtes/mois

#### Backend
- **Railway** (recommandé) ou Render
  - Node.js natif
  - Variables d'environnement
  - Logs en temps réel
  - Restart automatique
  - Prix : ~5$/mois (starter)

#### Base de données
- **Supabase** (recommandé) ou Neon
  - PostgreSQL managé
  - Backups automatiques
  - Interface d'administration
  - Prix : Gratuit jusqu'à 500MB, puis 25$/mois

#### Stockage fichiers
- **Cloudflare R2** (recommandé) ou AWS S3
  - Compatible S3
  - Pas de frais de sortie
  - Prix : 0.015$/GB stocké

#### Paiements
- **Stripe**
  - Abonnements récurrents
  - Webhooks
  - Prix : 1.4% + 0.25€ par transaction (EU)

#### Emails
- **Resend** (recommandé) ou SendGrid
  - API simple
  - Templates
  - Prix : 100 emails/jour gratuits

---

## 🚀 6. DÉPLOIEMENT CI/CD

### GitHub Actions (/.github/workflows/deploy.yml)
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      - name: Build
        working-directory: ./frontend
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## 🧪 7. TESTS

### Stratégie de tests

#### Frontend
```typescript
// Tests unitaires (Jest + React Testing Library)
// Exemple: RecipeForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import RecipeForm from './RecipeForm';

test('should calculate cost price automatically', () => {
  render(<RecipeForm />);
  
  const ingredientInput = screen.getByLabelText('Ingrédient');
  fireEvent.change(ingredientInput, { target: { value: 'Farine' } });
  
  const costDisplay = screen.getByTestId('cost-price');
  expect(costDisplay).toHaveTextContent('€');
});
```

#### Backend
```typescript
// Tests d'intégration (Jest + Supertest)
// Exemple: recipes.test.ts
import request from 'supertest';
import app from '../src/app';

describe('POST /api/recipes', () => {
  it('should create a new recipe', async () => {
    const response = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: 'Tarte citron',
        category: 'PATISSERIE',
        servings: 8
      });
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Tarte citron');
  });
});
```

### Couverture cible
- **Backend** : >80% coverage
- **Frontend** : >60% coverage (composants critiques)

---

## 📊 8. MONITORING & ANALYTICS

### Outils

| Outil | Usage | Prix |
|-------|-------|------|
| **Sentry** | Tracking erreurs frontend/backend | Gratuit jusqu'à 5k events/mois |
| **PostHog** | Analytics produit + feature flags | Gratuit jusqu'à 1M events/mois |
| **Better Uptime** | Monitoring disponibilité | Gratuit 1 monitor |
| **Vercel Analytics** | Performance frontend | Inclus |

### Métriques clés à tracker
- **Technique** : Uptime, temps de réponse API, erreurs
- **Business** : MRR, churn, conversion trial→paid
- **Usage** : Recettes créées, étiquettes générées, sessions

---

## 🗓️ 9. PLANNING DE DÉVELOPPEMENT

### Phase 1 : Setup & Infrastructure Docker (Semaine 1)
- [ ] Setup repos GitHub (frontend + backend microservices)
- [ ] Créer docker-compose.yml avec tous les services
- [ ] Dockerfile pour chaque microservice
- [ ] Setup réseau Docker (saas-network)
- [ ] Configuration PostgreSQL multi-databases
- [ ] Setup Redis pour cache
- [ ] Setup MinIO (S3 local)
- [ ] Script init-databases.sh
- [ ] Variables d'environnement (.env)
- [ ] Test : `docker-compose up -d` fonctionne
- [ ] Configuration CI/CD avec Docker
- [ ] Auth Service : Authentification JWT

### Phase 2 : MVP Core Features (Semaines 2-6)

#### Sprint 1 : Recipe Microservice (S2-S3)
- [ ] **Recipe Service** : Dockerfile + Prisma schema
- [ ] API : CRUD recettes (POST, GET, PUT, DELETE)
- [ ] Service : Calcul automatique allergènes
- [ ] Service : Calcul automatique valeurs nutritionnelles
- [ ] Service : Calcul coût de revient
- [ ] Tests unitaires du service
- [ ] Communication avec API Gateway
- [ ] Cache Redis pour calculs nutritionnels

#### Sprint 2 : Recipe Service - Base Ingrédients (S3-S4)
- [ ] Import base Ciqual (1000+ ingrédients) dans PostgreSQL
- [ ] API : Recherche d'ingrédients (autocomplete)
- [ ] API : Ajout ingrédients personnalisés
- [ ] API : Gestion fournisseurs & prix
- [ ] Tests d'intégration avec DB

#### Sprint 3 : Label Microservice (S4-S5)
- [ ] **Label Service** : Dockerfile + setup
- [ ] API : Génération étiquettes (POST /labels)
- [ ] Service : Appel Recipe Service pour données
- [ ] Service : Génération PDF (PDFKit)
- [ ] Templates d'étiquettes réglementaires
- [ ] Upload PDF vers MinIO
- [ ] API : Personnalisation (logo, couleurs)
- [ ] API : Formats multiples
- [ ] Tests : Génération PDF

#### Sprint 4 : Production Microservice & Polish (S5-S6)
- [ ] **Production Service** : Dockerfile + Prisma
- [ ] API : Planning de production (CRUD)
- [ ] Service : Calcul quantités ingrédients (appel Recipe Service)
- [ ] API : Liste de courses
- [ ] Frontend : Intégration tous les services
- [ ] UI/UX polish
- [ ] Tests end-to-end avec Docker Compose

### Phase 3 : Beta Testing (Semaines 7-8)
- [ ] Onboarding 20 beta-testeurs
- [ ] Collecte feedback
- [ ] Corrections bugs
- [ ] Documentation

### Phase 4 : Launch (Semaine 9)
- [ ] Intégration Stripe
- [ ] Landing page marketing
- [ ] Support client (Crisp)
- [ ] Lancement public

---

## 💡 10. BONNES PRATIQUES

### Code Quality
- **Linting** : ESLint + Prettier (chaque service)
- **Git** : Commits conventionnels (feat, fix, chore)
- **Branches** : feature/*, bugfix/*, hotfix/*
- **Code Review** : Obligatoire avant merge
- **Documentation** : README + commentaires JSDoc
- **Docker** : .dockerignore dans chaque service
- **Healthchecks** : Endpoint `/health` sur chaque service
- **Versioning** : Semantic versioning pour chaque microservice

### Performance
- **Frontend** :
  - Code splitting (React.lazy)
  - Image optimization (WebP, lazy loading)
  - Debounce sur recherches
- **Backend** :
  - Pagination (limit 50 par défaut)
  - Caching (Redis si besoin)
  - Indexes DB sur colonnes fréquentes

### SEO (Landing page)
- Meta tags optimisés
- Sitemap.xml
- Schema.org markup
- Blog technique (guides)

---

## 📚 11. RESSOURCES & DOCUMENTATION

### Documentation à créer
1. **README.md** : Setup projet
2. **API.md** : Documentation endpoints REST
3. **ARCHITECTURE.md** : Diagrammes architecture
4. **CONTRIBUTING.md** : Guide contribution
5. **CHANGELOG.md** : Historique versions

### Outils de documentation
- **Backend API** : Swagger/OpenAPI
- **Frontend** : Storybook (composants UI)
- **Database** : Prisma Studio

---

## 🎯 CHECKLIST AVANT LANCEMENT

### Technique
- [ ] Tests automatisés passent (>80% backend)
- [ ] Pas d'erreurs console
- [ ] Performance : Lighthouse score >90
- [ ] Sécurité : Headers configurés (helmet)
- [ ] RGPD : Politique confidentialité + CGU
- [ ] Backups automatiques configurés

### Business
- [ ] Stripe en mode production
- [ ] Emails transactionnels fonctionnels
- [ ] Support client opérationnel
- [ ] Landing page live
- [ ] Analytics configurés

### Legal
- [ ] CGU/CGV rédigées
- [ ] Mentions légales
- [ ] Politique de confidentialité (RGPD)
- [ ] Cookies consent banner

---

## � 12. STRUCTURE COMPLÈTE DU PROJET

```
metiers-de-bouche/
├── 📄 docker-compose.yml           # Orchestration principale
├── 📄 docker-compose.dev.yml       # Override développement
├── 📄 docker-compose.prod.yml      # Override production
├── 📄 .env.example                 # Template variables
├── 📄 .gitignore
├── 📄 README.md
│
├── 🐳 frontend/                    # SERVICE FRONTEND
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   └── types/
│   └── public/
│
├── 🐳 backend/
│   ├── api-gateway/                # SERVICE API GATEWAY
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── middleware/
│   │       ├── routes/
│   │       └── server.ts
│   │
│   ├── services/
│   │   ├── auth-service/          # MICROSERVICE AUTH
│   │   │   ├── Dockerfile
│   │   │   ├── package.json
│   │   │   ├── prisma/
│   │   │   │   └── schema.prisma
│   │   │   └── src/
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       ├── routes/
│   │   │       └── server.ts
│   │   │
│   │   ├── recipe-service/        # MICROSERVICE RECIPES
│   │   │   ├── Dockerfile
│   │   │   ├── package.json
│   │   │   ├── prisma/
│   │   │   │   └── schema.prisma
│   │   │   └── src/
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       │   ├── recipe.service.ts
│   │   │       │   ├── nutrition.service.ts
│   │   │       │   ├── allergen.service.ts
│   │   │       │   └── pricing.service.ts
│   │   │       ├── routes/
│   │   │       └── server.ts
│   │   │
│   │   ├── label-service/         # MICROSERVICE LABELS
│   │   │   ├── Dockerfile
│   │   │   ├── package.json
│   │   │   └── src/
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       │   ├── label.service.ts
│   │   │       │   └── pdf.service.ts
│   │   │       ├── templates/
│   │   │       ├── routes/
│   │   │       └── server.ts
│   │   │
│   │   └── production-service/    # MICROSERVICE PRODUCTION
│   │       ├── Dockerfile
│   │       ├── package.json
│   │       ├── prisma/
│   │       │   └── schema.prisma
│   │       └── src/
│   │           ├── controllers/
│   │           ├── services/
│   │           ├── routes/
│   │           └── server.ts
│   │
│   └── shared/                    # CODE PARTAGÉ
│       ├── types/
│       ├── utils/
│       └── constants/
│
├── 📁 scripts/
│   ├── init-databases.sh          # Init multi-DB PostgreSQL
│   ├── seed-ingredients.ts        # Import base Ciqual
│   └── backup-db.sh               # Backup automatique
│
├── 📁 docs/
│   ├── cahier_des_charges.md
│   ├── plan_projet_dev.md
│   ├── API.md                     # Documentation API
│   └── ARCHITECTURE.md            # Diagrammes
│
├── 📁 .github/
│   └── workflows/
│       ├── deploy.yml             # CI/CD
│       ├── test.yml               # Tests automatiques
│       └── docker-build.yml       # Build images Docker
│
└── 📁 monitoring/                 # Optionnel
    ├── prometheus.yml
    └── grafana-dashboard.json
```

---

## 🚀 COMMANDES UTILES

### 🐳 Docker (Commandes principales)
```bash
# ========================================
# DÉVELOPPEMENT
# ========================================

# Premier démarrage (build + start)
docker-compose up -d --build

# Démarrer tous les services
docker-compose up -d

# Voir les logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f recipe-service

# Arrêter tous les services
docker-compose down

# Arrêter + supprimer volumes (RESET COMPLET)
docker-compose down -v

# Rebuild un seul service
docker-compose up -d --build recipe-service

# Accéder au shell d'un container
docker exec -it saas-recipe-service sh

# Voir l'état des services
docker-compose ps

# Voir les ressources utilisées
docker stats

# ========================================
# DATABASE (via Docker)
# ========================================

# Accéder à PostgreSQL
docker exec -it saas-postgres psql -U postgres -d saas_recipes

# Backup base de données
docker exec saas-postgres pg_dump -U postgres saas_recipes > backup.sql

# Restore base de données
docker exec -i saas-postgres psql -U postgres saas_recipes < backup.sql

# Prisma migrations (dans un service)
docker exec -it saas-recipe-service npx prisma migrate dev

# Prisma Studio (interface DB)
docker exec -it saas-recipe-service npx prisma studio

# ========================================
# REDIS (cache)
# ========================================

# Accéder au CLI Redis
docker exec -it saas-redis redis-cli

# Vider le cache
docker exec -it saas-redis redis-cli FLUSHALL

# ========================================
# MINIO (stockage S3)
# ========================================

# Accéder à la console MinIO
# http://localhost:9001
# Login : voir .env (MINIO_ACCESS_KEY / MINIO_SECRET_KEY)

# ========================================
# SCALING
# ========================================

# Lancer 3 instances du recipe-service
docker-compose up -d --scale recipe-service=3

# ========================================
# NETTOYAGE
# ========================================

# Supprimer tous les containers arrêtés
docker container prune

# Supprimer toutes les images non utilisées
docker image prune -a

# Supprimer tous les volumes non utilisés
docker volume prune

# Nettoyage complet (ATTENTION : supprime tout)
docker system prune -a --volumes
```

### 💻 Développement local (sans Docker)

#### Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
npm run build
npm run preview
npm run test
npm run lint
```

#### Backend - Recipe Service (exemple)
```bash
cd backend/services/recipe-service
npm install
npm run dev            # http://localhost:3002
npm run build
npm start
npx prisma migrate dev
npx prisma generate
npx prisma studio
npm run test
```

### 🔄 Workflow quotidien

```bash
# Matin : Démarrer l'environnement
docker-compose up -d

# Travailler sur le code...
# Les modifications sont hot-reload en dev

# Tester un changement
docker-compose restart recipe-service
docker-compose logs -f recipe-service

# Soir : Arrêter l'environnement
docker-compose down
```

---

## 📞 SUPPORT & CONTACT

Pour toute question sur l'architecture ou les choix techniques, référez-vous à ce document ou contactez l'équipe technique.

**Version** : 1.0  
**Dernière mise à jour** : Octobre 2025
