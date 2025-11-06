# 🧪 Guide de test - Métiers de Bouche

## 📋 Table des matières
1. [Tests Backend (Docker)](#tests-backend)
2. [Tests Frontend (Docker)](#tests-frontend)
3. [Tests d'intégration (Navigateur)](#tests-integration)
4. [Dépannage](#depannage)

---

## 🔧 Tests Backend (Docker)

### 1. Vérifier l'état des services

```powershell
docker-compose ps
```

**Résultat attendu** : Tous les services doivent être `Up` et `(healthy)`

### 2. Tester auth-service (35 tests)

```powershell
docker-compose exec auth-service npm test
```

**Résultat attendu** : `Test Suites: 4 passed, 4 total` | `Tests: 35 passed, 35 total`

**Tests couverts** :
- ✅ validators.test.js (7 tests) : Validation email/password
- ✅ middleware.integration.test.js (5 tests) : JWT authentication
- ✅ reset-password.integration.test.js (10 tests) : Reset password flow
- ✅ profile.integration.test.js (13 tests) : Profile CRUD

### 3. Tester recipe-service (70 tests)

```powershell
docker-compose exec recipe-service npm test
```

**Résultat attendu** : `Test Suites: 6 passed, 6 total` | `Tests: 70 passed, 70 total`

**Tests couverts** :
- ✅ recipes.integration.test.js (23 tests) : CRUD recettes
- ✅ ingredients.integration.test.js (19 tests) : CRUD ingrédients
- ✅ allergens.integration.test.js (8 tests) : Détection allergènes
- ✅ nutrition.integration.test.js (8 tests) : Calcul INCO
- ✅ pricing.integration.test.js (7 tests) : Calcul prix/marges
- ✅ stats.integration.test.js (5 tests) : Stats dashboard

### 4. Test d'un endpoint spécifique

```powershell
# Test GET /recipes/stats
docker-compose exec recipe-service npm test -- stats.integration.test.js
```

---

## 🎨 Tests Frontend (Docker)

### 1. Lancer tous les tests frontend (56 tests)

```powershell
cd C:\proj\saas\Métiers-de-Bouche
docker build --target test -f frontend/Dockerfile -t frontend-tests frontend
docker run --rm frontend-tests npm test -- --run
```

**Résultat attendu** : `Test Files: 7 passed (7)` | `Tests: 56 passed (56)`

**Tests couverts** :
- ✅ authStore.test.js (6 tests) : Zustand store
- ✅ Button.test.jsx (9 tests) : Composant UI
- ✅ Input.test.jsx (7 tests) : Composant UI
- ✅ LoginPage.test.jsx (7 tests) : Page login
- ✅ RegisterPage.test.jsx (9 tests) : Page register
- ✅ Dashboard.test.jsx (7 tests) : Page dashboard
- ✅ RecipesListPage.test.jsx (11 tests) : Page liste recettes

### 2. Test verbose (avec détails)

```powershell
docker run --rm frontend-tests npm test -- --run --reporter=verbose
```

### 3. Rebuild si changements

```powershell
docker-compose build frontend
docker-compose up -d frontend
```

---

## 🌐 Tests d'intégration (Navigateur)

### Configuration
- **URL** : http://localhost
- **Services requis** : Tous les conteneurs Docker UP

### Test Flow complet (US-017, US-018, US-019)

#### 1. **Page Register** (US-017)
1. Ouvrir http://localhost/register
2. Remplir le formulaire :
   - Prénom : `Test`
   - Nom : `User`
   - Email : `test@example.com`
   - Entreprise : `Ma Boulangerie`
   - Password : `Password123!`
   - Confirmer password : `Password123!`
3. Cliquer sur **"S'inscrire"**
4. ✅ **Attendu** : Message "Inscription réussie ! Redirection..."
5. ✅ **Attendu** : Redirection vers `/login` après 2s

#### 2. **Page Login** (US-017)
1. Sur http://localhost/login
2. Entrer :
   - Email : `test@example.com`
   - Password : `Password123!`
3. Cliquer sur **"Se connecter"**
4. ✅ **Attendu** : Redirection vers `/dashboard`

#### 3. **Dashboard** (US-018)
1. Sur http://localhost/dashboard (après login)
2. ✅ **Vérifier** :
   - En-tête : "🧁 Métiers de Bouche"
   - Message : "Bienvenue Test !"
   - Compteur : "0 Recettes créées"
   - Message : "Vous n'avez pas encore de recettes"
   - Bouton : "Créer ma première recette"
3. Ouvrir DevTools → Network → XHR
4. ✅ **Vérifier appel API** :
   - `GET /api/recipes/stats`
   - Status : `200 OK`
   - Response : `{"totalRecipes": 0, "topProfitable": []}`

#### 4. **Liste recettes vide** (US-019)
1. Cliquer sur le bouton **"Créer ma première recette"**
2. ✅ **Attendu** : Redirection vers `/recipes/new` (404 pour l'instant, US-020 pas encore fait)
3. Revenir en arrière
4. Accéder à http://localhost/recipes
5. ✅ **Vérifier** :
   - Titre : "Mes recettes (0)"
   - Bouton : "+ Nouvelle recette"
   - Filtres : Search input + Category select
   - Message : "Aucune recette trouvée"
   - Bouton : "Créer ma première recette"

#### 5. **Liste recettes avec données** (US-019)
**Prérequis** : Créer des recettes via API ou backend

```powershell
# Créer une recette de test via curl (avec token)
$token = "VOTRE_TOKEN_JWT_ICI"
$body = @{
  name = "Croissant"
  category = "Viennoiserie"
  servings = 10
  description = "Délicieux croissant au beurre"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost/api/recipes" -Method POST -Body $body -ContentType "application/json" -Headers @{Authorization="Bearer $token"}
```

Ensuite sur http://localhost/recipes :
1. ✅ **Vérifier tableau** :
   - Ligne avec "Croissant"
   - Catégorie : badge bleu "Viennoiserie"
   - Portions : "10 portions"
   - Date création
   - Actions : Voir | Modifier | Supprimer

2. ✅ **Tester filtre recherche** :
   - Taper "crois" dans le search
   - Attendre 500ms (debounce)
   - Vérifier que seul "Croissant" s'affiche

3. ✅ **Tester filtre catégorie** :
   - Sélectionner "Viennoiserie"
   - Vérifier que seules les viennoiseries s'affichent

4. ✅ **Tester suppression** :
   - Cliquer sur "Supprimer"
   - Confirmer dans la modal
   - Vérifier que la recette disparaît

5. ✅ **Tester pagination** (si >20 recettes) :
   - Vérifier texte "Page 1 sur X"
   - Cliquer sur "Suivant"
   - Vérifier chargement page 2

---

## 🐛 BUG CRITIQUE RÉSOLU (6 nov 2025)

### JWT_SECRET manquant dans recipe-service

**Symptôme** :
- ❌ Dashboard : "Erreur lors du chargement des statistiques"
- ❌ Tous les appels `/api/recipes/*` : `{"error":"Token invalide"}`
- ❌ 49/70 tests recipe-service échouaient avec 404

**Cause** : `recipe-service` sans `JWT_SECRET` dans `docker-compose.yml` → JWT non validés

**Fix** : Ligne 171 de docker-compose.yml :
```yaml
JWT_SECRET: ${JWT_SECRET:-your-super-secret-jwt-key-change-in-production}
```

**Redémarrage requis** : `docker-compose up -d recipe-service`

---

## 🔧 Dépannage

### Problème : "Erreur lors du chargement des statistiques"

**Causes possibles** :
1. Token JWT expiré (durée : 7 jours)
2. JWT_SECRET manquant (voir bug ci-dessus)
3. Services Docker down
4. Route `/stats` incorrecte

**Solutions** :

```powershell
# 1. Vérifier services
docker-compose ps

# 2. Redémarrer recipe-service
docker-compose restart recipe-service

# 3. Vérifier logs
docker logs saas-recipe-service --tail 50
docker logs saas-api-gateway --tail 50

# 4. Se reconnecter (obtenir nouveau token)
# Aller sur http://localhost/login et se reconnecter

# 5. Tester endpoint directement
docker-compose exec recipe-service npm test -- stats.integration.test.js
```

### Problème : Tests frontend échouent

```powershell
# Rebuild sans cache
docker build --target test --no-cache -f frontend/Dockerfile -t frontend-tests frontend

# Vérifier les erreurs de build
docker build --target test --progress=plain -f frontend/Dockerfile frontend 2>&1 | Select-String "Error|FAIL"
```

### Problème : Page blanche après login

```powershell
# 1. Ouvrir DevTools Console
# 2. Chercher erreurs JavaScript
# 3. Vérifier Network tab pour 404/500

# 4. Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# 5. Vérifier logs nginx
docker logs saas-frontend --tail 50
```

### Problème : API retourne 404

```powershell
# Vérifier les routes de l'API Gateway
docker logs saas-api-gateway --tail 50 | Select-String "Proxy"

# Exemple correct :
# [HPM] Proxy created: /  -> http://recipe-service:3002
# [HPM] Proxy rewrite rule created: "^/api/recipes" ~> ""
```

### Problème : Database connection

```powershell
# Vérifier PostgreSQL
docker-compose exec postgres psql -U postgres -c "\l"

# Devrait afficher : saas_auth, saas_recipes, saas_production

# Re-run migrations
docker-compose exec recipe-service npx prisma migrate deploy
docker-compose exec auth-service npx prisma migrate deploy
```

---

## 📊 Checklist complète Sprint 1

### Backend (100% ✅)
- [x] 35 tests auth-service passing
- [x] 70 tests recipe-service passing
- [x] Tous les services healthy
- [x] PostgreSQL 3 databases
- [x] Redis + MinIO opérationnels

### Frontend (62% ✅)
- [x] 56 tests frontend passing
- [x] US-017 : Login/Register (8 pts)
- [x] US-018 : Dashboard (5 pts)
- [x] US-019 : Liste recettes (8 pts)
- [ ] US-020 : Formulaire création (13 pts) - À FAIRE

### Tests d'intégration navigateur
- [x] Register → Login → Dashboard
- [x] Dashboard affiche stats
- [x] Liste recettes vide
- [ ] Liste recettes avec données (nécessite US-020)
- [ ] Création recette (US-020)
- [ ] Filtres et pagination

---

## 🚀 Commandes rapides

```powershell
# Test backend complet
docker-compose exec auth-service npm test ; docker-compose exec recipe-service npm test

# Test frontend complet
docker build --target test -f frontend/Dockerfile -t ft frontend ; docker run --rm ft npm test -- --run

# Rebuild + redeploy tout
docker-compose build ; docker-compose up -d

# Logs en temps réel
docker-compose logs -f recipe-service
docker-compose logs -f api-gateway
docker-compose logs -f frontend
```

---

**Dernière mise à jour** : 06/11/2025
**Sprint 1** : 94/107 points (88%)
