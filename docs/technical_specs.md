# 🔧 SPÉCIFICATIONS TECHNIQUES
## SaaS Métiers de Bouche

**Version** : 1.0  
**Date** : 22 octobre 2025

---

## 📊 SCHÉMA PRISMA COMPLET

### Database: saas_auth

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_AUTH")
}

model User {
  id          String    @id @default(uuid())
  email       String    @unique
  password    String
  firstName   String
  lastName    String
  companyName String?
  address     String?
  phone       String?
  logoUrl     String?
  
  // Abonnement
  plan        Plan      @default(STARTER)
  stripeCustomerId String? @unique
  stripeSubscriptionId String?
  trialEndsAt DateTime?
  subscriptionStatus SubscriptionStatus @default(TRIALING)
  
  // Configuration
  defaultMargin Float @default(2.5)
  currency      String @default("EUR")
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([email])
  @@map("users")
}

enum Plan {
  STARTER   // 50 recettes, 1 user
  PRO       // Illimité, 3 users
  PREMIUM   // Illimité, 10 users, multi-sites
}

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
}
```

---

### Database: saas_recipes

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_RECIPES")
}

model Recipe {
  id          String   @id @default(uuid())
  userId      String
  name        String
  category    Category
  description String?
  
  // Quantités
  servings    Int      @default(1)
  yieldWeight Float?   // Poids total en g
  
  // Temps
  prepTime    Int?     // minutes
  cookTime    Int?     // minutes
  
  // Instructions
  instructions String?
  
  // Conservation
  shelfLife   Int?     // jours
  conservationConditions String?
  
  // Prix & marges
  costPrice   Float    @default(0)
  sellingPrice Float?
  margin      Float?   // %
  
  // Calculs automatiques
  calories    Float?
  protein     Float?
  carbs       Float?
  fat         Float?
  salt        Float?
  allergens   String[] // Array des 14 allergènes
  
  // Média
  imageUrl    String?
  
  // Relations
  ingredients RecipeIngredient[]
  subRecipeUsages RecipeIngredient[] @relation("SubRecipe")
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId, category])
  @@index([name])
  @@map("recipes")
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
  id          String   @id @default(uuid())
  recipeId    String
  recipe      Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  // Ingrédient de base OU personnalisé OU sous-recette
  baseIngredientId   String?
  baseIngredient     BaseIngredient? @relation(fields: [baseIngredientId], references: [id])
  
  customIngredientId String?
  customIngredient   CustomIngredient? @relation(fields: [customIngredientId], references: [id])
  
  subRecipeId String?
  subRecipe   Recipe? @relation("SubRecipe", fields: [subRecipeId], references: [id])
  
  // Quantité
  quantity    Float
  unit        Unit
  
  // Pertes
  wastePercentage Float @default(0) // %
  
  order       Int      @default(0) // Ordre d'affichage
  
  @@index([recipeId])
  @@map("recipe_ingredients")
}

enum Unit {
  G
  KG
  ML
  L
  PIECE
  TABLESPOON
  TEASPOON
}

model BaseIngredient {
  id          String   @id @default(uuid())
  name        String
  category    IngredientCategory
  
  // Valeurs nutritionnelles pour 100g
  calories    Float
  protein     Float
  carbs       Float
  fat         Float
  salt        Float
  fiber       Float?
  sugar       Float?
  
  // Allergènes (14 obligatoires)
  allergens   String[]
  
  // Source Ciqual
  ciqualCode  String?
  
  recipes     RecipeIngredient[]
  
  @@index([name])
  @@map("base_ingredients")
}

enum IngredientCategory {
  FARINES
  SUCRES
  MATIERES_GRASSES
  PRODUITS_LAITIERS
  OEUFS
  CHOCOLAT_CACAO
  FRUITS
  FRUITS_SECS
  EPICES
  LEVURES
  ADDITIFS
  AUTRE
}

model CustomIngredient {
  id          String   @id @default(uuid())
  userId      String
  name        String
  category    IngredientCategory
  
  // Prix
  price       Float    // Prix par unité (kg, L, pièce)
  priceUnit   Unit
  supplier    String?
  
  // Traçabilité
  lotNumber   String?
  expiryDate  DateTime?
  
  // Valeurs nutritionnelles pour 100g
  calories    Float?
  protein     Float?
  carbs       Float?
  fat         Float?
  salt        Float?
  
  // Allergènes
  allergens   String[]
  
  recipes     RecipeIngredient[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
  @@index([name])
  @@map("custom_ingredients")
}

model Label {
  id          String   @id @default(uuid())
  userId      String
  recipeId    String
  
  // PDF
  pdfUrl      String
  format      LabelFormat
  
  // Données générées
  generatedAt DateTime @default(now())
  
  @@index([userId])
  @@index([recipeId])
  @@map("labels")
}

enum LabelFormat {
  A4
  FORMAT_40X30
  FORMAT_50X30
  FORMAT_70X50
  CUSTOM
}
```

---

### Database: saas_production

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_PRODUCTION")
}

model ProductionTask {
  id          String   @id @default(uuid())
  userId      String
  recipeId    String
  
  // Planning
  scheduledDate DateTime
  quantity    Int
  
  // Statut
  status      ProductionStatus @default(PLANNED)
  
  // Notes
  notes       String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId, scheduledDate])
  @@index([status])
  @@map("production_tasks")
}

enum ProductionStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

---

## 🔌 API ENDPOINTS

### Auth Service (port 3001)

```
POST   /auth/register          Inscription
POST   /auth/login             Connexion JWT
POST   /auth/forgot-password   Reset password
POST   /auth/reset-password    Confirmer reset
GET    /auth/me                Profil utilisateur
PUT    /auth/me                Modifier profil
POST   /auth/me/logo           Upload logo
```

### Recipe Service (port 3002)

```
// Recettes
POST   /recipes                Créer recette
GET    /recipes                Liste recettes (pagination, filtres)
GET    /recipes/:id            Détail recette
PUT    /recipes/:id            Modifier recette
DELETE /recipes/:id            Supprimer recette
POST   /recipes/:id/image      Upload photo

// Ingrédients dans recette
POST   /recipes/:id/ingredients        Ajouter ingrédient
DELETE /recipes/:id/ingredients/:ingId Supprimer ingrédient

// Fiche fabrication
GET    /recipes/:id/fabrication        PDF fiche labo

// Ingrédients de base
GET    /ingredients                    Recherche ingrédients
GET    /ingredients/:id                Détail ingrédient

// Ingrédients personnalisés
GET    /ingredients/custom             Mes ingrédients
POST   /ingredients/custom             Créer ingrédient
PUT    /ingredients/custom/:id         Modifier ingrédient
DELETE /ingredients/custom/:id         Supprimer ingrédient
```

### Label Service (port 3003)

```
POST   /labels/generate        Générer étiquette PDF
GET    /labels                 Historique étiquettes
GET    /labels/:id             Détail étiquette
```

### Production Service (port 3004)

```
// Planning
POST   /production             Créer tâche production
GET    /production             Liste tâches (par semaine)
PUT    /production/:id         Modifier tâche
DELETE /production/:id         Supprimer tâche

// Calculs
GET    /production/ingredients Liste ingrédients nécessaires (semaine)
GET    /production/shopping-list  PDF liste courses
GET    /production/economat    PDF bon d'économat
```

### Billing (dans Auth Service)

```
POST   /billing/checkout       Créer session Stripe
GET    /billing/subscription   Abonnement actuel
POST   /billing/portal         Ouvrir Stripe Portal
POST   /webhooks/stripe        Webhooks Stripe
```

---

## 🔐 SÉCURITÉ

### JWT Token
- **Algorithme** : HS256
- **Expiration** : 7 jours
- **Refresh** : Non (reconnexion après 7j)
- **Secret** : `process.env.JWT_SECRET`

### Rate Limiting
```javascript
// Global API Gateway
100 requêtes / 15 minutes par IP

// Endpoints sensibles
POST /auth/login: 5 tentatives / 15 min
POST /auth/register: 3 tentatives / heure
POST /labels/generate: 50 / heure
```

### CORS
```javascript
origin: process.env.FRONTEND_URL
credentials: true
methods: ['GET', 'POST', 'PUT', 'DELETE']
```

---

## 📦 STRUCTURE DU PROJET

```
Métiers-de-Bouche/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/          # Zustand
│   │   ├── api/            # Axios clients
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── api-gateway/
│   │   ├── src/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   └── server.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── services/
│   │   ├── auth-service/
│   │   │   ├── prisma/
│   │   │   │   └── schema.prisma
│   │   │   ├── src/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── middleware/
│   │   │   │   └── server.ts
│   │   │   ├── Dockerfile
│   │   │   └── package.json
│   │   │
│   │   ├── recipe-service/
│   │   ├── label-service/
│   │   └── production-service/
│   │
│   └── postgres/
│       └── init-databases.sh
│
├── docs/
│   ├── cahier_des_charges.md
│   ├── plan_projet_dev.md
│   ├── product_backlog.md
│   ├── technical_specs.md         # Ce fichier
│   ├── testing_strategy.md
│   └── sprints/
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🧪 TESTS

### Coverage minimum
- **Unitaires** : >70% (services, utils)
- **Intégration** : >50% (routes API)
- **E2E** : Parcours critiques

### Stack
- **Backend** : Jest + Supertest
- **Frontend** : Jest + React Testing Library
- **E2E** : Playwright

---

## 🚀 DÉPLOIEMENT

### Staging
- **Frontend** : Vercel Preview
- **Backend** : Railway Staging
- **Database** : Supabase Dev

### Production
- **Frontend** : Vercel Production
- **Backend** : Railway Production
- **Database** : Supabase Production
- **Storage** : Cloudflare R2 ou AWS S3
- **CDN** : Cloudflare

---

## 📊 MONITORING

- **Errors** : Sentry
- **Analytics** : Plausible
- **Uptime** : BetterStack (gratuit jusqu'à 10 checks)
- **Logs** : Railway/Vercel native

---

**Dernière mise à jour** : 22 octobre 2025
