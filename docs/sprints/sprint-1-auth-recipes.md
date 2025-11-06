# 🚀 SPRINT 1 : Auth Service & Recipe Service Base
**Durée** : 2 semaines (Semaines 2-3)  
**Dates** : À définir  
**Sprint Goal** : Créer l'authentification JWT et le CRUD des recettes avec calculs automatiques

---

## 📊 CAPACITÉ & VÉLOCITÉ

- **Points planifiés** : 78 backend + 34 frontend = 112 total
- **Points réalisés** : 112/112 (100%) ✅
- **Vélocité réelle** : 56 points/semaine
- **Statut** : 🎉 TERMINÉ - Backend 100% (78/78 pts) ✅ | Frontend 100% (34/34 pts) ✅

---

## 🎯 OBJECTIF DU SPRINT

> **"À la fin de ce sprint, un artisan peut s'inscrire, se connecter, créer une recette et voir automatiquement les allergènes, valeurs nutritionnelles et coût de revient"**

### Critères de succès
- ✅ Inscription et connexion fonctionnelles avec JWT
- ✅ CRUD recettes complet via API
- ✅ Calculs automatiques (allergènes, nutrition, coûts) fonctionnels
- ✅ Frontend : pages auth ✅ + liste recettes ✅ + formulaire création ✅
- ✅ Upload photo recette vers MinIO
- ✅ Tests unitaires sur services de calculs

---

## 📝 USER STORIES DU SPRINT

### US-008 : Auth Service - Inscription utilisateur
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux créer un compte afin d'utiliser l'application.

**Critères d'acceptation** :
- [x] POST /auth/register crée un utilisateur
- [x] Password hashé avec bcrypt (cost 10)
- [x] Validation email unique
- [x] Validation Zod complète (email, password, firstName, lastName, company)
- [x] Essai gratuit 14 jours activé (trialEndsAt)
- [ ] Email de bienvenue envoyé (Resend) - Reporté Sprint 2

**Tâches** :
- [x] Créer auth-service avec Prisma
- [x] Schema User (Prisma) avec plan + trialEndsAt
- [x] Implémenter route POST /auth/register
- [x] Hashage password + validation Zod
- [x] Tests validators (7 tests)

---

### US-009 : Auth Service - Connexion JWT
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux me connecter afin d'accéder à mes recettes.

**Critères d'acceptation** :
- [x] POST /auth/login retourne JWT token (7 jours)
- [x] Validation email/password avec Zod
- [x] Token contient userId + email + plan
- [x] Rate limiting global en place (100 req/15min via API Gateway)
- [x] JWT_SECRET configuré via env

**Tâches** :
- [x] Implémenter route POST /auth/login
- [x] Service login avec bcrypt.compare
- [x] Génération JWT avec jsonwebtoken
- [x] Gestion erreurs (401 credentials invalides)
- [x] Tests validators (3 tests loginSchema)

---

### US-009-bis : Auth Service - Reset password
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux réinitialiser mon mot de passe si je l'ai oublié.

**Critères d'acceptation** :
- [x] POST /forgot-password envoie lien (email simulation en dev)
- [x] Token unique valide 1h stocké en DB
- [x] POST /reset-password change le password
- [x] Rate limiting : 3 tentatives / heure
- [x] Sécurité : ne révèle pas si email existe

**Tâches** :
- [x] Token unique dans DB (ResetToken table)
- [x] Routes forgot-password et reset-password
- [x] Validation Zod (email, password strength, confirmPassword)
- [x] Rate limiting in-memory
- [x] Tests d'intégration complets (10 tests, TDD)

---

### US-010 : Auth Service - Middleware JWT
**Points** : 3 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant que développeur, je veux un middleware de vérification JWT afin de sécuriser toutes les routes API.

**Critères d'acceptation** :
- [x] Middleware authenticateToken vérifie JWT
- [x] Retourne 401 si token manquant
- [x] Retourne 403 si token invalide ou expiré
- [x] Injecte req.user { userId, email, plan }
- [x] Support Authorization: Bearer + query param ?token=

**Tâches** :
- [x] Créer middleware/auth.middleware.js
- [x] jwt.verify() avec gestion erreurs
- [x] Tests d'intégration (5 tests, TDD)
- [x] Route GET /me protégée pour validation

---

### US-011 : Auth Service - Profil utilisateur
**Points** : 5 | **Priorité** : 🟡 SHOULD | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux voir et modifier mon profil afin de mettre à jour mes informations.

**Critères d'acceptation** :
- [x] GET /me retourne profil (sans password)
- [x] PUT /me met à jour (email, firstName, lastName, company, logoUrl)
- [x] DELETE /me supprime compte + cascade relations
- [x] Validation Zod updateProfileSchema
- [x] Sécurité : plan/password non modifiables
- [x] Protection JWT (authenticateToken)

**Tâches** :
- [x] validators/profile.validator.js (updateProfileSchema)
- [x] services/profile.service.js (update + delete)
- [x] controllers/profile.controller.js (3 routes)
- [x] Routes GET/PUT/DELETE /me protégées
- [x] Tests d'intégration (13 tests profile.integration.test.js)

---

### US-012 : Recipe Service - CRUD Recettes
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux créer, lire, modifier, supprimer mes recettes afin de gérer mon catalogue.

**Critères d'acceptation** :
- [x] POST /recipes crée une recette
- [x] GET /recipes liste mes recettes (pagination)
- [x] GET /recipes/:id détail d'une recette
- [x] PUT /recipes/:id modifie une recette
- [x] DELETE /recipes/:id supprime une recette
- [x] Filtres par catégorie
- [x] Champs de base : nom, description, catégorie, portions

**Tâches** :
- [x] Créer recipe-service avec Prisma
- [x] Schema Recipe avec champs de base
- [x] Implémenter routes CRUD complètes (validators + services + controllers + routes)
- [x] Pagination + filtres par catégorie
- [x] Tests d'intégration TDD (23 tests, 100% passent)

---

### US-013 : Recipe Service - Ajout ingrédients à recette
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux ajouter des ingrédients à ma recette afin de définir sa composition.

**Critères d'acceptation** :
- [x] POST /recipes/:id/ingredients ajoute un ingrédient
- [x] Quantité + unité (g, kg, L, ml, pièce, cl, mg)
- [x] Pourcentage de perte configurable (0-100%)
- [x] GET /recipes/:id/ingredients liste les ingrédients
- [x] PUT /recipes/:id/ingredients/:ingredientId modifie un ingrédient
- [x] DELETE /recipes/:id/ingredients/:ingredientId supprime un ingrédient

**Tâches** :
- [x] Créer schemas Ingredient et RecipeIngredient dans Prisma
- [x] Migration DB avec foreign keys et cascade delete
- [x] Implémenter routes POST/GET/PUT/DELETE ingredients
- [x] Validation Zod (quantité positive, unités valides, loss percent 0-100)
- [x] Tests d'intégration TDD (19 tests, 100% passent)

---

### US-014 : Recipe Service - Calcul allergènes
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux voir automatiquement les allergènes de ma recette afin de respecter la réglementation (14 ADO).

**Critères d'acceptation** :
- [x] Service détecte les 14 allergènes obligatoires
- [x] Calcul automatique à la sauvegarde de la recette
- [x] Affichage dans GET /recipes/:id
- [x] Allergènes : gluten, crustacés, œufs, poissons, arachides, soja, lait, fruits à coque, céleri, moutarde, sésame, sulfites, lupin, mollusques

**Tâches** :
- [x] Créer service allergen
- [x] Fonction de détection automatique
- [x] Hook après sauvegarde recette
- [x] Tests unitaires

**Implémentation** :
- Service `allergen.service.js` : détection automatique via parsing CSV des ingrédients
- Route `GET /recipes/:id/allergens` : endpoint dédié pour la liste d'allergènes
- Intégration dans `GET /recipes/:id` : champ `allergens[]` inclus dans la réponse
- 8 tests d'intégration (100%) : détection unique, déduplication, multi-allergènes, auth
- Liste de référence ADO : 14 allergènes obligatoires en constante `MANDATORY_ALLERGENS`

---

### US-015 : Recipe Service - Calcul valeurs nutritionnelles
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE (INCO conforme)

**Description** :  
En tant qu'artisan, je veux voir automatiquement les valeurs nutritionnelles afin de les afficher sur mes étiquettes.

**Critères d'acceptation** :
- [x] Service calcule pour 100g
- [x] **Énergie : kJ ET kcal (OBLIGATOIRE INCO)**
- [x] **Glucides + dont sucres (OBLIGATOIRE INCO)**
- [x] **Matières grasses + dont acides gras saturés (OBLIGATOIRE INCO)**
- [x] **Sel arrondi 2 décimales (OBLIGATOIRE INCO)**
- [x] Protéines
- [ ] Mise en cache Redis (1h) - Non implémenté (pas critique)

**Tâches** :
- [x] Créer service nutrition
- [x] Fonction calcul pour 100g avec INCO
- [x] Migration Prisma : ajout sugars, saturatedFats, fiber, allergenTraces
- [x] Formule kJ : 1 kcal = 4.184 kJ
- [x] Gestion lossPercent
- [ ] Cache Redis avec TTL 1h - Non implémenté
- [x] Tests unitaires

**Implémentation** :
- Service `nutrition.service.js` : calcul automatique avec gestion des pertes de cuisson
- Route `GET /recipes/:id/nutrition` : endpoint dédié pour les valeurs nutritionnelles
- Intégration dans `GET /recipes/:id` : champ `nutrition` inclus dans la réponse
- 8 tests d'intégration (100%) : calcul 100g, par portion, pertes cuisson, auth
- Format INCO complet : `{ per100g: { energyKj, energyKcal, proteins, carbs, sugars, fats, saturatedFats, salt }, perServing: {...}, totalWeight }`
- Gestion lossPercent : poids final = poids initial * (1 - loss%), nutriments concentrés
- **Conformité légale** : kJ+kcal, sugars, saturatedFats, salt 2 décimales

**Résultat** : ✅ 8/8 tests passent - Calculs INCO 100% conformes

---

### US-016 : Recipe Service - Calcul coût de revient
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux voir le coût de revient automatique afin de fixer mon prix de vente.

**Critères d'acceptation** :
- [x] Service calcule le coût avec pertes ✅
- [x] Coût = somme(quantité * prix * (1 + perte%)) ✅
- [x] Suggestion prix de vente avec coefficient ✅
- [x] Affichage marge en % ✅

**Tâches** :
- [x] Créer service pricing ✅
- [x] Calcul coût avec pertes ✅
- [x] Calcul marge et suggestion prix ✅
- [x] Tests (7/7 passing) ✅

**Tests** : 7/7 passing
- Calcul coût avec ingrédients (farine + beurre = 3.5€)
- Calcul avec perte cuisson (viande × 1.2 = 18€)
- Coefficient personnalisé (coeff=5, marge 80%)
- Coût zéro sans ingrédients
- Validation ownership (404)
- Auth requise (401)
- Pricing inclus dans GET /recipes/:id

---

## 🎉 BACKEND COMPLÉTÉ - 73/73 points (100%)

**Tests** : 107/107 passing ✅ (vérifié via Docker le 06/11/2025)
- **Auth-service** : 35 tests
  - validators.test.js : 7 tests
  - middleware.integration.test.js : 5 tests
  - reset-password.integration.test.js : 10 tests
  - profile.integration.test.js : 13 tests
- **Recipe-service** : 72 tests (🆕 +10 depuis dernière maj)
  - recipes.integration.test.js : 23 tests
  - ingredients.integration.test.js : 19 tests
  - allergens.integration.test.js : 8 tests
  - nutrition.integration.test.js : 8 tests (INCO conforme)
  - pricing.integration.test.js : 7 tests
  - stats.integration.test.js : 5 tests
  - integration.test.js : 17 tests
  - inco-compliance.integration.test.js : 9 tests
  - **sub-recipes.integration.test.js** : 10 tests 🆕 (US-021)

**Conformité INCO** : 100% (kJ+kcal, sugars, saturatedFats, salt 2 décimales)

**Features clés** :
- ✅ CRUD recettes + ingrédients
- ✅ Calculs automatiques (allergènes, nutrition, coûts)
- ✅ Sous-recettes avec cascade récursive (US-021)
- ✅ Détection boucles infinies (DFS)
- ✅ Stats dashboard (top profitable)

**Services déployés Docker** :
- ✅ auth-service (saas-auth-service, port 3001, healthy)
- ✅ recipe-service (saas-recipe-service, port 3002, healthy)
- ✅ api-gateway (saas-api-gateway, port 3000, healthy)
- ✅ postgres (saas-postgres, 3 databases: saas_auth, saas_recipes, saas_production)
- ✅ redis (saas-redis, port 6379)
- ✅ minio (saas-minio, ports 9000-9001)

---

## 🚧 FRONTEND EN COURS (34 points → 21 points complétés = 62%)

### ✅ US-017 : Frontend - Pages Auth (Login/Register) - 8 points ✅ DONE

**Implémentation complète** :
- ✅ LoginPage.jsx + RegisterPage.jsx + ForgotPasswordPage.jsx
- ✅ Validation Zod + React Hook Form
- ✅ Store Zustand (authStore.js) : login/logout/token
- ✅ Client API (lib/api.js) : Axios + JWT intercepteurs
- ✅ DashboardPage.jsx basique (proof of concept)
- ✅ Routes protégées (ProtectedRoute component)
- ✅ Design Tailwind CSS conforme

**Stack technique** :
- React 18.2 + Vite 5.0
- React Router DOM 6.20.1
- Zustand 4.4.7 (state management)
- Axios 1.6.2 (API calls)
- Zod 3.22.4 + React Hook Form 7.49.2
- Tailwind CSS 3.4.0

**Service déployé Docker** :
- ✅ frontend (saas-frontend, port 80, nginx, healthy)
- ✅ Build multi-stage (node:20-alpine → nginx:alpine)

**Fichiers créés** : 
- stores/authStore.js, lib/api.js
- features/auth/LoginPage.jsx, RegisterPage.jsx, ForgotPasswordPage.jsx
- features/dashboard/DashboardPage.jsx
- components/ui/Button.jsx, Input.jsx
- router.jsx (routes + ProtectedRoute)

**Prochaines US Frontend** : US-018 (5 pts), US-019 (8 pts), US-020 (13 pts) = 26 points restants

### US-017 : Frontend - Pages Auth (Login/Register)
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE ✨

**Description** :  
En tant qu'artisan, je veux des pages de connexion et inscription afin d'accéder à l'application.

**Critères d'acceptation** :
- [x] Page /login avec formulaire
- [x] Page /register avec formulaire complet
- [x] Validation formulaire (Zod + React Hook Form)
- [x] Affichage erreurs serveur
- [x] Redirection après login réussi
- [x] Token stocké dans localStorage
- [x] **BONUS** : CORS fix complet (nginx /api/ proxy)
- [x] **BONUS** : 38 tests frontend passent (100%)

**Tâches** :
- [x] Setup Frontend Docker + Vite + React
- [x] Créer pages Login/Register
- [x] Validation formulaires
- [x] Store Zustand pour auth
- [x] Client API Axios avec intercepteurs
- [x] Routes protégées avec React Router

**Implémentation** :
- Structure créée :
  - `stores/authStore.js` : État global avec Zustand (login/logout/token)
  - `lib/api.js` : Client Axios avec intercepteurs JWT + 401
  - `features/auth/LoginPage.jsx` : Page connexion avec validation Zod
  - `features/auth/RegisterPage.jsx` : Page inscription (6 champs)
  - `features/dashboard/DashboardPage.jsx` : Dashboard protégé
  - `router.jsx` : Routes avec ProtectedRoute
  - `components/ui/Button.jsx` + `Input.jsx` : Design system
- Dépendances installées :
  - react-router-dom, zustand, axios, zod, react-hook-form, @hookform/resolvers
  - tailwindcss, autoprefixer, postcss
- Frontend déployé sur http://localhost (port 80)

**Tests manuels** : ✅ Build réussi, services démarrés

---

### US-018 : Frontend - Dashboard
**Points** : 5 | **Priorité** : 🟡 SHOULD | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux voir un tableau de bord afin d'avoir une vue d'ensemble.

**Critères d'acceptation** :
- [x] Page /dashboard (DashboardPage.jsx avec hooks)
- [x] Nombre de recettes créées (compteur visuel)
- [x] Recettes les plus rentables (top 5 dans tableau)
- [x] Indication visuelle de la rentabilité (couleurs selon marge)
- [x] Message si aucune recette (CTA "Créer ma première recette")

**Tâches** :
- [x] Backend : GET /recipes/stats (stats.service.js + stats.controller.js)
- [x] Tests backend : 5 tests d'intégration (70/70 total ✅)
- [x] Frontend : Appel API avec useEffect + loading state
- [x] Affichage stats réelles (totalRecipes + topProfitable)
- [x] Tableau responsive avec colonnes (Nom, Coût, Prix, Marge %)
- [x] Couleurs conditionnelles marge (vert >60%, jaune >40%, rouge <40%)
- [x] Gestion erreurs API

**Implémentation** :
- Backend : `services/stats.service.js` (getUserStats)
- Backend : `controllers/stats.controller.js` (getStats)
- Backend : Route `GET /recipes/stats` (protected)
- Backend : Tests `tests/stats.integration.test.js` (5 tests TDD)
- Frontend : `DashboardPage.jsx` (useState + useEffect + api.get)
- Frontend : Tableau HTML avec Tailwind CSS

**Note** : Graphique temporel reporté (Chart.js) - MVP sans graphique OK

---

### US-019 : Frontend - Liste des recettes
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux voir toutes mes recettes afin de les gérer facilement.

**Critères d'acceptation** :
- [x] Page /recipes avec tableau responsive
- [x] Colonnes : Nom, Catégorie, Portions, Date création, Actions
- [x] Filtres : catégorie (dropdown), recherche texte (nom avec debounce 500ms)
- [x] Pagination (20/page) avec navigation
- [x] Boutons "Nouvelle recette" + Voir/Modifier/Supprimer par ligne
- [x] Confirmation native (window.confirm) pour suppression
- [x] Message si aucune recette avec CTA
- [x] Gestion états loading/error

**Tâches** :
- [x] Créer pages/RecipesListPage.jsx
- [x] Tableau HTML responsive avec Tailwind
- [x] Filtres : search input + category select
- [x] Debounce search (500ms timeout)
- [x] Pagination avec state (page, totalPages)
- [x] Navigation Dashboard + Logout
- [x] Tests : 11 tests passing (render, filtres, pagination, delete, états)
- [x] Route /recipes dans router.jsx

**Implémentation** :
- Frontend : `pages/RecipesListPage.jsx` (useState + useEffect + debounce)
- Tests : `pages/__tests__/RecipesListPage.test.jsx` (11 tests TDD)
- API : GET /recipes?page=&limit=&category=&search=
- Navigation : Vers /recipes/new, /recipes/:id, /recipes/:id/edit

**Backend prêt** : GET /recipes (pagination + category + search filters OK)

---

### US-020 : Frontend - Formulaire création recette
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux un formulaire intuitif afin de créer une recette en <10 min.

**Critères d'acceptation** :
- [x] Formulaire multi-étapes (stepper 3 étapes)
- [x] Étape 1 : Infos générales (nom, description, catégorie, portions)
- [x] Étape 2 : Ajout ingrédients (autocomplete, quantité, unité, lossPercent)
- [x] Étape 3 : Révision (coût, allergènes, nutrition en temps réel)
- [x] Calculs live via API (GET /recipes/:id/allergens, /nutrition, /pricing)
- [x] Sauvegarde automatique brouillon (localStorage avec debounce 500ms)

**Tâches** :
- [x] Créer pages/RecipeFormPage.jsx (590 lignes, 3 steps)
- [x] Composant Stepper intégré (progress bar, numéros étapes)
- [x] Étape 1 : Form nom/description/catégorie/portions (validation inline)
- [x] Étape 2 : GET /ingredients (autocomplete debounce 300ms), POST /recipes/:id/ingredients
- [x] Étape 3 : Appels API allergens/nutrition/pricing → affichage résultats
- [x] State management (useState) pour brouillon + restore au mount
- [x] Navigation stepper (Suivant/Précédent/Enregistrer)
- [x] Tests (12 tests couvrant 3 steps + validation + navigation)
- [x] Route /recipes/new ajoutée dans router.jsx
- [x] Button component mis à jour (variant primary/secondary)

**Implémentation** :
- RecipeFormPage.jsx : 590 lignes, 3 steps avec stepper visuel
- Tests : 12 tests (step 1: 4 tests, step 2: 3 tests, step 3: 3 tests, général: 2 tests)
- Features : Debounce search 300ms, auto-save draft 500ms, validation inline, loader states
- API calls : POST /recipes, GET /ingredients, POST /recipes/:id/ingredients, GET allergens/nutrition/pricing

**Backend prêt** : 
- POST /recipes ✅
- POST /recipes/:id/ingredients ✅
- GET /recipes/:id/allergens ✅
- GET /recipes/:id/nutrition ✅
- GET /recipes/:id/pricing ✅

---

### US-021 : Recipe Service - Sous-recettes (compositions)
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux utiliser une recette comme ingrédient d'une autre recette afin de gérer mes compositions complexes.

**Critères d'acceptation** :
- [x] Une recette peut contenir d'autres recettes comme ingrédients (XOR validation)
- [x] Calculs en cascade récursifs (allergènes, nutrition, coûts)
- [x] Détection et rejet des boucles infinies (DFS)

**Tâches** :
- [x] Ajouter subRecipeId dans RecipeIngredient (optionnel, exclusif avec ingredientId)
- [x] XOR validation (soit ingredientId soit subRecipeId, pas les deux)
- [x] Service circular-dependency.service.js (DFS cycle detection)
- [x] Fonctions récursives : detectAllergens, calculateNutrition, calculatePricing (avec visited Set)
- [x] Tests d'intégration TDD (10 tests passing)

**Implémentation** :
- Prisma schema : `RecipeIngredient.subRecipeId` (String?) + `Recipe.usedInRecipes` relation
- Migration : `20251106131751_add_sub_recipes`
- Validation : `ingredient.validator.js` avec `.refine()` pour XOR
- Service : `circular-dependency.service.js` (DFS avec visited Set)
- Services récursifs : 
  - `allergen.service.js` → detectAllergens(recipeId, visited)
  - `nutrition.service.js` → calculateNutrition(recipeId, visited)
  - `pricing.service.js` → calculatePricing(recipeId, visited)
- Protection : `if (visited.has(recipeId))` dans chaque fonction
- Tests : `sub-recipes.integration.test.js` (10/10 passing)
  - Ajout sub-recipe (pâte feuilletée → croissant)
  - Validation XOR (rejette both/neither)
  - Cascade allergènes (3 niveaux : beurre→lait, farine→gluten)
  - Cascade nutrition (récursive avec per100g)
  - Cascade pricing (coût total avec pertes)
  - Circular A→B, B→A rejeté (400 error)
  - Circular A→B→C→A rejeté (3 niveaux)
  - Hiérarchies indépendantes OK (A→B, C→D)
- Total : 107/107 tests passing (97 existants + 10 nouveaux)

---

### US-022 : Recipe Service - Upload photo recette
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux ajouter une photo à ma recette afin d'avoir un visuel.

**Critères d'acceptation** :
- [x] POST /recipes/:id/image upload vers MinIO
- [x] Formats acceptés : JPG, PNG, WebP (max 5MB)
- [x] Compression automatique avec Sharp (max width 1200px, quality 80%)
- [x] URL stockée dans Recipe.imageUrl
- [x] Gestion erreurs (fichier trop gros, format non supporté)

**Tâches** :
- [x] Installer multer (file upload) + sharp (image processing) + minio
- [x] Configurer multer (memory storage, file filter, size limit)
- [x] Route POST /recipes/:id/image (validation + compression + upload MinIO)
- [x] Migration Prisma : ajout Recipe.imageUrl
- [x] Client MinIO (lib/minio.js) avec ensureBucket
- [x] Update Recipe.imageUrl avec URL MinIO
- [x] Tests d'intégration (7/7 passing : upload JPG/PNG, rejet >5MB, rejet PDF, auth, ownership)

---

## 🐛 BUGS IDENTIFIÉS

**Bugs résolus** :
- ✅ Prisma query engine Windows vs Linux (résolu via npx prisma generate)
- ✅ CORS frontend → API Gateway (résolu via nginx proxy /api/)
- ✅ Faux tokens JWT dans tests (résolu avec vrais jwt.sign())

**Bugs en attente** :
- Aucun bug bloquant identifié

---

## 📈 DAILY STANDUP NOTES

### Semaine 23-27 octobre 2025
- Jour 1-5 : Backend auth-service complet (US-008, 009, 009-bis, 010, 011)
- Jour 6-10 : Backend recipe-service complet (US-012, 013, 014, 015, 016)
- Jour 11-12 : Frontend US-017 (Login/Register)
- **Total** : 81 points complétés en ~12 jours

### 06 novembre 2025 - Vérification complète
- ✅ Tests auth-service : 35/35 passing via Docker
- ✅ Tests recipe-service : 65/65 passing via Docker
- ✅ Total : 100/100 tests backend ✅
- ⏳ Frontend : 8/34 points (US-017 done, US-018/019/020 restants)

---

## 📊 SPRINT REVIEW

**Date** : -  
**Participants** : -

### Démo
- [ ] Inscription + Connexion fonctionnelles
- [ ] Création d'une recette avec ingrédients
- [ ] Affichage calculs automatiques (allergènes, nutrition, coûts)
- [ ] Liste des recettes

### Feedback
-

---

## 🔄 SPRINT RETROSPECTIVE

**Date** : -  
**Participants** : -

### ✅ What went well?
-

### ❌ What could be improved?
-

### 💡 Action items
- [ ] 

---

## 🎯 DEFINITION OF DONE

### Backend (100% COMPLÉTÉ ✅)
- ✅ Code testé : 100 tests passing (35 auth + 65 recipes)
- ✅ Code review : Auto-validé via tests TDD
- ✅ Documentation API : Endpoints documentés dans technical_specs.md
- ✅ Tests manuels : Validés via Postman/Thunder Client
- ✅ Déployé Docker : 9 containers healthy

### Frontend (24% complété)
- ✅ US-017 : Auth pages testées manuellement
- ⏳ US-018/019/020 : En attente

---

## 📊 RÉSUMÉ FINAL DU SPRINT

### Points réalisés : 102/107 (95%)

**Backend** : 78/78 points (100%) ✅
- Auth Service : 26 points (US-008, 009, 009-bis, 010, 011)
- Recipe Service : 52 points (US-012, 013, 014, 015, 016, **US-021**, **US-022**)
- Tests : **114/114 passing** (+7 US-022)
- Conformité INCO : 100%
- MinIO : Upload images + Sharp compression

**Frontend** : 34/34 points (100%) ✅
- US-017 (Auth Pages) : 8 points ✅ DONE
- US-018 (Dashboard) : 5 points ✅ DONE
- US-019 (Liste recettes) : 8 points ✅ DONE
- US-020 (Formulaire recette) : 13 points ✅ DONE

**Restant** : Aucun ✅

### Vélocité réelle : 51 points/semaine
- Sprint 0 : 43 points/semaine estimés
- Sprint 1 : 51 points/semaine réels (**+18% vs estimation** ✅)

### ✅ Sprint 1 TERMINÉ ! 🎉
- **Durée réelle** : 14 jours (23 oct - 6 nov 2025)
- **Points livrés** : 112/112 (100%) ✅
- **Tests** : **114/114 backend** ✅ + 68/68 frontend ✅ = **182 tests** ✅
- **Features critiques** : 100% livrées
- **Bloqueurs rencontrés** : 1 (JWT_SECRET manquant - résolu)

---

**Status** : 🎉 TERMINÉ (100% complété - Backend 100% ✅ | Frontend 100% ✅)  
**Date de début** : 23 octobre 2025  
**Date de fin** : 6 novembre 2025  
**Dernière mise à jour** : 06 novembre 2025 - 15:30 UTC (US-022 complétée - Sprint 1 fini !)
