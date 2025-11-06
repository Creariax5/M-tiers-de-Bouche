# 🧪 GUIDE DE TEST - Création de Recette
**Métiers de Bouche SaaS**

---

## 🎯 OBJECTIF

Tester le **flow complet de création d'une recette** avec :
- Formulaire multi-étapes (3 steps)
- Ajout d'ingrédients avec autocomplete
- Calculs en temps réel (allergènes, nutrition, pricing)
- Sauvegarde brouillon automatique

---

## 📋 PRÉREQUIS

### 1. Services démarrés

```powershell
# Vérifier que tous les services sont UP
docker-compose ps

# Doit afficher :
# saas-postgres        Up (healthy)
# saas-redis           Up (healthy)
# saas-minio           Up (healthy)
# saas-auth-service    Up (healthy)
# saas-recipe-service  Up (healthy)
# saas-api-gateway     Up (healthy)
# saas-frontend        Up (healthy)
```

### 2. Compte de test

**Option A : Utiliser compte existant**
- Email : `test@example.com`
- Password : `Password123!`

**Option B : Créer nouveau compte**
1. Aller sur http://localhost/register
2. Remplir le formulaire
3. Cliquer "S'inscrire"

---

## 🌐 TEST MANUEL (NAVIGATEUR)

### Étape 1 : Connexion

1. Ouvrir http://localhost/login
2. Entrer credentials :
   - Email : `test@example.com`
   - Password : `Password123!`
3. Cliquer "Se connecter"
4. ✅ **Vérifier** : Redirection vers `/dashboard`

### Étape 2 : Accéder au formulaire

**Option A : Depuis le Dashboard**
1. Cliquer sur le bouton "Créer une recette" (si présent)

**Option B : URL directe**
1. Naviguer vers http://localhost/recipes/new
2. ✅ **Vérifier** : Page formulaire 3 étapes s'affiche

### Étape 3 : Informations générales (Step 1)

1. **Remplir le formulaire** :
   - Nom : `Croissant au beurre`
   - Description : `Croissant artisanal au beurre français`
   - Catégorie : Sélectionner `Viennoiserie`
   - Nombre de portions : `10`

2. **Tester la validation** :
   - Laisser le nom vide et cliquer "Suivant"
   - ✅ **Vérifier** : Message d'erreur "Le nom est requis"

3. **Tester auto-save** :
   - Ouvrir DevTools (F12) → Application → LocalStorage
   - ✅ **Vérifier** : Clé `recipeDraft` existe et se met à jour

4. **Passer à l'étape 2** :
   - Remplir tous les champs
   - Cliquer "Suivant"
   - ✅ **Vérifier** : Stepper passe à "2/3"

### Étape 4 : Ajout ingrédients (Step 2)

1. **Tester l'autocomplete** :
   - Dans le champ "Rechercher un ingrédient", taper `farine`
   - ✅ **Vérifier** : Liste d'ingrédients s'affiche (après 300ms)

2. **Ajouter premier ingrédient** :
   - Sélectionner "Farine de blé T55" dans la liste
   - Quantité : `500`
   - Unité : `g`
   - Perte (%) : `2`
   - Cliquer "Ajouter l'ingrédient"
   - ✅ **Vérifier** : Ingrédient apparaît dans le tableau

3. **Ajouter deuxième ingrédient** :
   - Taper `beurre` dans la recherche
   - Sélectionner "Beurre doux"
   - Quantité : `250`
   - Unité : `g`
   - Perte (%) : `0`
   - Cliquer "Ajouter l'ingrédient"
   - ✅ **Vérifier** : Deuxième ingrédient s'ajoute

4. **Tester suppression** :
   - Cliquer sur l'icône poubelle du premier ingrédient
   - ✅ **Vérifier** : Ingrédient disparaît

5. **Re-ajouter l'ingrédient** (farine 500g, perte 2%)

6. **Tester navigation** :
   - Cliquer "Précédent"
   - ✅ **Vérifier** : Retour à l'étape 1 avec données conservées
   - Cliquer "Suivant" pour revenir à l'étape 2
   - ✅ **Vérifier** : Ingrédients toujours présents

7. **Passer à l'étape 3** :
   - Cliquer "Suivant"
   - ✅ **Vérifier** : Stepper passe à "3/3"

### Étape 5 : Révision et calculs (Step 3)

1. **Vérifier affichage récapitulatif** :
   - ✅ Nom : "Croissant au beurre"
   - ✅ Catégorie : "Viennoiserie"
   - ✅ Portions : 10
   - ✅ Liste ingrédients : farine (500g, 2%), beurre (250g, 0%)

2. **Vérifier calculs automatiques** :

   **Allergènes** :
   - ✅ **Vérifier** : Badge "gluten" affiché (farine)
   - ✅ **Vérifier** : Badge "lait" affiché (beurre)

   **Valeurs nutritionnelles** :
   - ✅ **Vérifier** : Section "Valeurs nutritionnelles" affichée
   - ✅ **Vérifier** : Données pour 100g :
     - Énergie : XXX kJ / XXX kcal
     - Protéines : X.X g
     - Glucides : X.X g (dont sucres X.X g)
     - Matières grasses : X.X g (dont saturés X.X g)
     - Sel : X.XX g
   - ✅ **Vérifier** : Données par portion affichées

   **Coût de revient** :
   - ✅ **Vérifier** : Section "Pricing" affichée
   - ✅ **Vérifier** : Coût total : X.XX €
   - ✅ **Vérifier** : Coût par portion : X.XX €
   - ✅ **Vérifier** : Prix suggéré : X.XX €
   - ✅ **Vérifier** : Marge : XX %

3. **Tester état loading** :
   - Observer l'affichage pendant 1-2 secondes après arrivée sur step 3
   - ✅ **Vérifier** : Loader ou texte "Calcul en cours..." visible

4. **Sauvegarder la recette** :
   - Cliquer "Sauvegarder"
   - ✅ **Vérifier** : Redirection vers `/recipes`
   - ✅ **Vérifier** : Nouvelle recette visible dans la liste

5. **Vérifier localStorage nettoyé** :
   - Ouvrir DevTools → Application → LocalStorage
   - ✅ **Vérifier** : Clé `recipeDraft` supprimée

### Étape 6 : Vérifier la recette créée

1. Dans la liste des recettes (`/recipes`) :
   - ✅ **Vérifier** : "Croissant au beurre" présent
   - ✅ **Vérifier** : Catégorie "Viennoiserie"
   - ✅ **Vérifier** : Portions "10"
   - ✅ **Vérifier** : Date de création = aujourd'hui

2. Cliquer sur "Voir" pour voir les détails (si implémenté)

---

## 🔧 TEST API (POWERSHELL)

### 1. Obtenir un token JWT

```powershell
# Login
$response = Invoke-WebRequest -Uri "http://localhost/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"test@example.com","password":"Password123!"}'

$json = $response.Content | ConvertFrom-Json
$token = $json.token

Write-Host "Token: $token"
```

### 2. Créer une recette (Step 1)

```powershell
$body = @{
    name = "Croissant au beurre"
    description = "Croissant artisanal"
    category = "Viennoiserie"
    servings = 10
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost/api/recipes" `
  -Method POST `
  -Headers @{
      "Authorization" = "Bearer $token"
      "Content-Type" = "application/json"
  } `
  -Body $body

$recipe = ($response.Content | ConvertFrom-Json).recipe
$recipeId = $recipe.id

Write-Host "Recipe créée : $recipeId"
```

### 3. Lister les ingrédients disponibles

```powershell
$response = Invoke-WebRequest -Uri "http://localhost/api/ingredients" `
  -Headers @{"Authorization" = "Bearer $token"}

$ingredients = ($response.Content | ConvertFrom-Json).ingredients

Write-Host "Nombre d'ingrédients : $($ingredients.Count)"
$ingredients | Select-Object -First 5 | Format-Table name, id
```

### 4. Ajouter des ingrédients (Step 2)

**Ingrédient 1 : Farine**

```powershell
# Chercher l'ID de "Farine de blé T55"
$farineId = ($ingredients | Where-Object { $_.name -like "*Farine*blé*" }).id[0]

$body = @{
    ingredientId = $farineId
    quantity = 500
    unit = "g"
    lossPercent = 2
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost/api/recipes/$recipeId/ingredients" `
  -Method POST `
  -Headers @{
      "Authorization" = "Bearer $token"
      "Content-Type" = "application/json"
  } `
  -Body $body

Write-Host "Ingrédient 1 ajouté (Farine)"
```

**Ingrédient 2 : Beurre**

```powershell
$beurreId = ($ingredients | Where-Object { $_.name -like "*Beurre*" }).id[0]

$body = @{
    ingredientId = $beurreId
    quantity = 250
    unit = "g"
    lossPercent = 0
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost/api/recipes/$recipeId/ingredients" `
  -Method POST `
  -Headers @{
      "Authorization" = "Bearer $token"
      "Content-Type" = "application/json"
  } `
  -Body $body

Write-Host "Ingrédient 2 ajouté (Beurre)"
```

### 5. Calculer allergènes (Step 3)

```powershell
$response = Invoke-WebRequest -Uri "http://localhost/api/recipes/$recipeId/allergens" `
  -Headers @{"Authorization" = "Bearer $token"}

$allergens = ($response.Content | ConvertFrom-Json).allergens

Write-Host "Allergènes détectés :"
$allergens | ForEach-Object { Write-Host "- $_" }
```

**✅ Attendu** : `gluten`, `lait`

### 6. Calculer nutrition (Step 3)

```powershell
$response = Invoke-WebRequest -Uri "http://localhost/api/recipes/$recipeId/nutrition" `
  -Headers @{"Authorization" = "Bearer $token"}

$nutrition = ($response.Content | ConvertFrom-Json).nutrition

Write-Host "`nValeurs nutritionnelles (pour 100g) :"
$nutrition.per100g | Format-List
```

**✅ Attendu** :
```
energyKj        : 1830
energyKcal      : 437
proteins        : 8.5
carbs           : 53.2
sugars          : 2.1
fats            : 20.3
saturatedFats   : 12.5
salt            : 0.45
```

### 7. Calculer pricing (Step 3)

```powershell
$response = Invoke-WebRequest -Uri "http://localhost/api/recipes/$recipeId/pricing" `
  -Headers @{"Authorization" = "Bearer $token"}

$pricing = ($response.Content | ConvertFrom-Json).pricing

Write-Host "`nPricing :"
$pricing | Format-List
```

**✅ Attendu** :
```
totalCost       : 3.50
costPerServing  : 0.35
suggestedPrice  : 10.50
marginPercent   : 66.67
```

### 8. Récupérer la recette complète

```powershell
$response = Invoke-WebRequest -Uri "http://localhost/api/recipes/$recipeId" `
  -Headers @{"Authorization" = "Bearer $token"}

$fullRecipe = ($response.Content | ConvertFrom-Json).recipe

Write-Host "`nRecette complète :"
$fullRecipe | Format-List
```

---

## 🐛 TROUBLESHOOTING

### Erreur : "Token invalide"

**Cause** : JWT_SECRET différent entre auth-service et recipe-service

**Solution** :
```powershell
# Vérifier docker-compose.yml
docker-compose config | Select-String "JWT_SECRET"

# Doit être identique pour auth-service ET recipe-service
```

### Erreur : "Aucun ingrédient disponible"

**Cause** : Base de données ingredients vide

**Solution** :
```powershell
# Vérifier les ingrédients dans la DB
docker-compose exec postgres psql -U user -d saas_recipes -c "SELECT COUNT(*) FROM ingredients;"

# Si 0, importer le fichier CSV d'ingrédients (non fourni dans ce sprint)
```

### Erreur : "Cannot read property 'value' of null" (frontend)

**Cause** : Composant non monté ou ref cassée

**Solution** :
1. Ouvrir DevTools Console
2. Voir la stack trace complète
3. Vérifier que tous les composants sont bien importés

### Calculs retournent null

**Cause** : Ingrédients sans données nutritionnelles

**Solution** :
```powershell
# Vérifier les données nutritionnelles d'un ingrédient
docker-compose exec postgres psql -U user -d saas_recipes -c "SELECT name, proteins, carbs, fats FROM ingredients LIMIT 5;"

# Si NULL partout, les données ne sont pas importées
```

---

## ✅ CHECKLIST VALIDATION

### Tests manuels navigateur
- [ ] Login réussi → Redirection dashboard
- [ ] Accès formulaire `/recipes/new`
- [ ] Step 1 : Validation nom requis fonctionne
- [ ] Step 1 : Auto-save localStorage (visible DevTools)
- [ ] Step 1 → Step 2 : Navigation fonctionne
- [ ] Step 2 : Autocomplete ingrédients fonctionne (debounce 300ms)
- [ ] Step 2 : Ajout ingrédient affiche dans tableau
- [ ] Step 2 : Suppression ingrédient fonctionne
- [ ] Step 2 → Step 1 : Retour conserve données
- [ ] Step 2 → Step 3 : Navigation fonctionne
- [ ] Step 3 : Allergènes affichés (badges)
- [ ] Step 3 : Nutrition affichée (kJ + kcal + détails)
- [ ] Step 3 : Pricing affiché (coût + prix suggéré + marge)
- [ ] Step 3 : Bouton "Sauvegarder" redirige vers `/recipes`
- [ ] Liste recettes : Nouvelle recette visible
- [ ] LocalStorage : `recipeDraft` supprimé après save

### Tests API PowerShell
- [ ] POST /auth/login retourne token valide
- [ ] POST /recipes crée recette (201)
- [ ] GET /ingredients retourne liste (200)
- [ ] POST /recipes/:id/ingredients ajoute ingrédient (201)
- [ ] GET /recipes/:id/allergens retourne liste (200)
- [ ] GET /recipes/:id/nutrition retourne calculs (200)
- [ ] GET /recipes/:id/pricing retourne pricing (200)
- [ ] GET /recipes/:id retourne recette complète avec allergens (200)

---

## 📊 RÉSULTAT ATTENDU

**Recette créée** :
- Nom : "Croissant au beurre"
- Catégorie : "Viennoiserie"
- Portions : 10
- Ingrédients : 2 (farine 500g, beurre 250g)
- Allergènes : gluten, lait
- Nutrition : calculée pour 100g et par portion
- Pricing : coût total, coût/portion, prix suggéré, marge %

**Temps estimé** : 10-15 minutes pour le test complet
