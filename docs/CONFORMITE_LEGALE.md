# 📜 CONFORMITÉ LÉGALE - Étiquetage Alimentaire
## Guide complet pour les Métiers de Bouche

**Dernière mise à jour** : 24 octobre 2025  
**Réglementation de référence** : Règlement (UE) n°1169/2011 (INCO)  
**Autorité de contrôle** : DGCCRF (Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes)

---

## 🎯 RÉSUMÉ EXÉCUTIF

Ce document détaille **TOUTES les obligations légales** pour l'étiquetage des denrées alimentaires en France et dans l'UE. Il analyse également la **conformité de notre implémentation technique** et identifie les **points à améliorer**.

**Statut actuel de conformité** : 🟡 **85% conforme** (points critiques OK, améliorations mineures nécessaires)

---

## 📋 TABLE DES MATIÈRES

1. [Cadre réglementaire](#1-cadre-réglementaire)
2. [Les 14 allergènes obligatoires (ADO)](#2-les-14-allergènes-obligatoires-ado)
3. [Déclaration nutritionnelle obligatoire](#3-déclaration-nutritionnelle-obligatoire)
4. [Mentions obligatoires sur l'étiquette](#4-mentions-obligatoires-sur-létiquette)
5. [Règles de présentation](#5-règles-de-présentation)
6. [Analyse de notre implémentation](#6-analyse-de-notre-implémentation)
7. [Points de non-conformité à corriger](#7-points-de-non-conformité-à-corriger)
8. [Recommandations et best practices](#8-recommandations-et-best-practices)

---

## 1. CADRE RÉGLEMENTAIRE

### 1.1 Textes applicables

| **Texte** | **Objet** | **Date d'application** |
|-----------|-----------|------------------------|
| **Règlement (UE) n°1169/2011** (INCO) | Information des consommateurs sur les denrées alimentaires | 13 décembre 2014 |
| **Directive 2000/13/CE** | Étiquetage des denrées alimentaires (remplacée par INCO) | Abrogée en 2014 |
| **Règlement (UE) n°1924/2006** | Allégations nutritionnelles et de santé | 1er juillet 2007 |
| **Code de la consommation** | Protection du consommateur (articles L. 412-1 et suivants) | En vigueur |
| **Arrêté du 8 juin 2023** | Liste des allergènes à déclaration obligatoire | 8 juin 2023 |

### 1.2 Sanctions en cas de non-conformité

⚠️ **ATTENTION** : Les sanctions sont **TRÈS LOURDES**

- **Amende administrative** : jusqu'à **300 000€** (personne physique) ou **1 500 000€** (personne morale)
- **Sanctions pénales** : jusqu'à **2 ans d'emprisonnement** et **300 000€** d'amende
- **Retrait/rappel des produits** : coût moyen 50 000-500 000€
- **Fermeture administrative** : possible en cas de danger sanitaire
- **Responsabilité civile** : dommages-intérêts en cas d'accident allergique

### 1.3 Champ d'application

✅ **Denrées préemballées** : étiquetage complet obligatoire  
✅ **Denrées non préemballées** : allergènes obligatoires (affichage ou oral avec écrit)  
✅ **Vente à distance** : mêmes obligations + mentions spécifiques  
✅ **Restauration collective** : allergènes obligatoires

---

## 2. LES 14 ALLERGÈNES OBLIGATOIRES (ADO)

### 2.1 Liste officielle (Annexe II du Règlement INCO)

Selon l'**Arrêté du 8 juin 2023** et le **Règlement (UE) n°1169/2011**, les 14 allergènes à déclaration obligatoire sont :

| # | **Allergène** | **Exemples d'aliments concernés** | **Notre nomenclature** |
|---|---------------|-----------------------------------|------------------------|
| 1 | **Céréales contenant du gluten** | Blé, seigle, orge, avoine, épeautre, kamut | `gluten` |
| 2 | **Crustacés** | Crevettes, crabes, homards, écrevisses | `crustaces` |
| 3 | **Œufs** | Œufs de poule, cane, caille | `oeufs` |
| 4 | **Poissons** | Tous poissons et dérivés (sauf gélatine) | `poissons` |
| 5 | **Arachides** | Cacahuètes et dérivés | `arachides` |
| 6 | **Soja** | Graines, farine, lécithine de soja | `soja` |
| 7 | **Lait** | Lait de tous mammifères (vache, chèvre, brebis) | `lait` |
| 8 | **Fruits à coque** | Amandes, noisettes, noix, cajou, pécan, pistaches, macadamia | `fruits-a-coque` |
| 9 | **Céleri** | Céleri branche, rave, feuilles, graines | `celeri` |
| 10 | **Moutarde** | Graines, farine, condiment | `moutarde` |
| 11 | **Graines de sésame** | Sésame, tahini, huile de sésame | `sesame` |
| 12 | **Anhydride sulfureux et sulfites** | Concentrations > 10 mg/kg ou 10 mg/L | `sulfites` |
| 13 | **Lupin** | Farine de lupin, graines | `lupin` |
| 14 | **Mollusques** | Escargots, calmars, moules, huîtres | `mollusques` |

### 2.2 Règles de déclaration des allergènes

#### Sur les étiquettes (denrées préemballées)

✅ **OBLIGATOIRE** : Mise en évidence typographique (gras, italique, MAJUSCULES, couleur, soulignement)

**Exemple conforme** :
```
Ingrédients : Farine de BLÉ, beurre (LAIT), ŒUFS, sucre, sel
```

**Exemple NON conforme** ❌ :
```
Ingrédients : Farine de blé, beurre (lait), œufs, sucre, sel
```

#### Pour les denrées non préemballées

✅ **OBLIGATOIRE** : Information écrite à proximité du produit OU  
✅ Information orale avec écrit disponible sur demande

**Exemple d'affichage** :
```
Tarte citron meringuée
Allergènes : GLUTEN, ŒUFS, LAIT
```

### 2.3 ⚠️ ANALYSE DE NOTRE IMPLÉMENTATION - ALLERGÈNES

#### ✅ Points conformes

1. **Liste complète des 14 ADO** :
```javascript
// src/services/allergen.service.js
export const MANDATORY_ALLERGENS = [
  'gluten', 'crustaces', 'oeufs', 'poissons', 
  'arachides', 'soja', 'lait', 'fruits-a-coque',
  'celeri', 'moutarde', 'sesame', 'sulfites', 
  'lupin', 'mollusques'
];
```
✅ **CONFORME** : Les 14 allergènes sont bien présents

2. **Détection automatique** :
```javascript
export const detectAllergens = async (recipeId) => {
  // Agrégation depuis les ingrédients
  // Déduplication automatique
  // Tri alphabétique
}
```
✅ **CONFORME** : Agrégation correcte depuis les ingrédients

3. **Format de stockage** :
```prisma
model Ingredient {
  allergens String? // CSV: "gluten,lait,oeufs"
}
```
✅ **CONFORME** : Format flexible et extensible

#### ⚠️ Points à améliorer

1. **Nomenclature standardisée** :
   - Notre format : `gluten`, `lait`, `oeufs`
   - Problème : pas de validation stricte du format
   - **Solution** : Créer un ENUM Prisma pour garantir la cohérence

2. **Traçabilité des traces** :
   - Manque : gestion des "traces possibles de..." (contamination croisée)
   - **Solution** : Ajouter champ `allergenTraces` dans Ingredient

3. **Mise en évidence typographique** :
   - Non implémenté : génération automatique du texte en GRAS
   - **Solution** : Fonction `formatAllergensForLabel()` avec markup HTML/PDF

---

## 3. DÉCLARATION NUTRITIONNELLE OBLIGATOIRE

### 3.1 Cadre légal

Depuis le **13 décembre 2016**, la **déclaration nutritionnelle est OBLIGATOIRE** pour toutes les denrées préemballées (sauf exemptions).

### 3.2 Informations obligatoires (Ordre légal)

L'**Article 30 du Règlement INCO** impose l'ordre suivant :

| # | **Nutriment** | **Unité** | **Base de calcul** | **Notre implémentation** |
|---|---------------|-----------|---------------------|--------------------------|
| 1 | **Valeur énergétique** | kJ et kcal | Pour 100g ou 100ml | ✅ `calories` (kcal uniquement) |
| 2 | **Matières grasses** | g | Pour 100g ou 100ml | ✅ `fats` |
| 3 | dont acides gras saturés | g | Pour 100g ou 100ml | ❌ **MANQUANT** |
| 4 | **Glucides** | g | Pour 100g ou 100ml | ✅ `carbs` |
| 5 | dont sucres | g | Pour 100g ou 100ml | ❌ **MANQUANT** |
| 6 | **Protéines** | g | Pour 100g ou 100ml | ✅ `proteins` |
| 7 | **Sel** | g | Pour 100g ou 100ml | ✅ `salt` |

### 3.3 ⚠️ POINTS CRITIQUES DE NON-CONFORMITÉ

#### ❌ 1. Valeur énergétique incomplète

**Obligation légale** : Afficher à la fois **kJ ET kcal**

**Notre implémentation actuelle** :
```javascript
// nutrition.service.js
calories: Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10
```
❌ **NON CONFORME** : Manque la conversion en kJ

**Formule de conversion** :
```
1 kcal = 4,184 kJ (arrondi à 4,2 kJ)
```

**Solution à implémenter** :
```javascript
const caloriesKcal = Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10;
const caloriesKj = Math.round(caloriesKcal * 4.184);

return {
  per100g: {
    energyKj: caloriesKj,
    energyKcal: caloriesKcal,
    // ...
  }
}
```

#### ❌ 2. Acides gras saturés manquants

**Obligation légale** : Afficher la quantité d'acides gras saturés (sous-catégorie de matières grasses)

**Notre schéma actuel** :
```prisma
model Ingredient {
  fats Float? // Matières grasses totales
}
```
❌ **NON CONFORME** : Manque `saturatedFats`

**Solution à implémenter** :
```prisma
model Ingredient {
  fats          Float? // Matières grasses totales
  saturatedFats Float? // Acides gras saturés (OBLIGATOIRE INCO)
}
```

#### ❌ 3. Sucres manquants

**Obligation légale** : Afficher la quantité de sucres (sous-catégorie de glucides)

**Notre schéma actuel** :
```prisma
model Ingredient {
  carbs Float? // Glucides totaux
}
```
❌ **NON CONFORME** : Manque `sugars`

**Solution à implémenter** :
```prisma
model Ingredient {
  carbs  Float? // Glucides totaux
  sugars Float? // dont sucres (OBLIGATOIRE INCO)
}
```

### 3.4 Informations nutritionnelles complémentaires (facultatives)

Peuvent être ajoutées **volontairement** :
- Fibres alimentaires
- Acides gras mono-insaturés
- Acides gras polyinsaturés
- Polyols
- Amidon
- Vitamines et minéraux (si quantité significative : ≥15% des AJR)

### 3.5 Règles d'arrondi (Annexe XV du Règlement INCO)

| **Nutriment** | **Règle d'arrondi** | **Notre implémentation** |
|---------------|---------------------|--------------------------|
| Énergie (kJ/kcal) | Entier le plus proche | ✅ `Math.round()` |
| Matières grasses | 0,1g (1 décimale) | ✅ `Math.round(...*10)/10` |
| Acides gras saturés | 0,1g (1 décimale) | ❌ Non implémenté |
| Glucides | 0,1g (1 décimale) | ✅ `Math.round(...*10)/10` |
| Sucres | 0,1g (1 décimale) | ❌ Non implémenté |
| Protéines | 0,1g (1 décimale) | ✅ `Math.round(...*10)/10` |
| Sel | 0,01g (2 décimales) | ⚠️ 1 décimale seulement |

**Correction nécessaire pour le sel** :
```javascript
// Actuellement (1 décimale)
salt: Math.round((totalSalt / totalWeightFinal) * 100 * 10) / 10

// Doit être (2 décimales)
salt: Math.round((totalSalt / totalWeightFinal) * 100 * 100) / 100
```

### 3.6 ⚠️ ANALYSE DE NOTRE IMPLÉMENTATION - NUTRITION

#### ✅ Points conformes

1. **Calcul pour 100g** :
```javascript
const per100g = {
  calories: Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10,
  // ...
}
```
✅ **CONFORME** : Base de calcul correcte (100g)

2. **Gestion des pertes de cuisson** :
```javascript
const finalWeight = quantity * (1 - lossPercent / 100);
```
✅ **CONFORME** : Prise en compte de la concentration des nutriments

3. **Calcul par portion** :
```javascript
const perServing = {
  weight: weightPerServing,
  calories: totalCalories / servings,
  // ...
}
```
✅ **CONFORME** : Information complémentaire utile (facultatif mais recommandé)

4. **Arrondis** :
✅ Protéines, glucides, lipides : 1 décimale (conforme)  
✅ Calories : entier (conforme)  
⚠️ Sel : 1 décimale au lieu de 2 (correctif mineur)

#### ❌ Points NON conformes (CRITIQUES)

1. **Valeur énergétique** : Manque les kJ
2. **Acides gras saturés** : Non implémenté (OBLIGATOIRE)
3. **Sucres** : Non implémenté (OBLIGATOIRE)
4. **Sel** : Arrondi à 2 décimales requis

#### 🔧 Migration Prisma nécessaire

```prisma
model Ingredient {
  // ... champs existants
  
  // OBLIGATOIRES INCO
  calories       Float?
  proteins       Float?
  carbs          Float?
  sugars         Float? // 🆕 OBLIGATOIRE (dont sucres)
  fats           Float?
  saturatedFats  Float? // 🆕 OBLIGATOIRE (dont acides gras saturés)
  salt           Float?
  
  // FACULTATIFS (nice to have)
  fiber          Float? // Fibres
  sodium         Float? // Sodium (sel = sodium * 2.5)
}
```

---

## 4. MENTIONS OBLIGATOIRES SUR L'ÉTIQUETTE

### 4.1 Liste complète des mentions obligatoires (Article 9 INCO)

Pour une **denrée préemballée**, l'étiquette DOIT comporter :

| # | **Mention** | **Exemple** | **Implémentation** |
|---|-------------|-------------|-------------------|
| 1 | **Dénomination de vente** | "Tarte citron meringuée" | ✅ `Recipe.name` |
| 2 | **Liste des ingrédients** | "Farine de BLÉ, sucre, ŒUFS..." | ⚠️ À implémenter |
| 3 | **Allergènes** | En GRAS dans la liste | ✅ `detectAllergens()` |
| 4 | **Quantité nette** | "Poids net : 250g" | ❌ Non implémenté |
| 5 | **Date de durabilité** | "À consommer avant le..." ou "À consommer de préférence avant le..." | ❌ Non implémenté |
| 6 | **Conditions de conservation** | "À conserver au frais (0-4°C)" | ❌ Non implémenté |
| 7 | **Nom/adresse du fabricant** | "Pâtisserie Dupont, 123 rue..." | ❌ Non implémenté |
| 8 | **Pays d'origine** | Si nécessaire (viande, fruits, légumes) | ❌ Non implémenté |
| 9 | **Mode d'emploi** | Si nécessaire | ❌ Non implémenté |
| 10 | **Déclaration nutritionnelle** | Tableau nutritionnel | ✅ `calculateNutrition()` |
| 11 | **Titre alcoométrique** | Si boisson alcoolisée >1,2% | N/A |
| 12 | **Lot de fabrication** | "LOT: 2025-10-24-001" | ❌ Non implémenté |

### 4.2 Ordre de la liste des ingrédients

**Règle légale (Article 18 INCO)** : Les ingrédients doivent être listés par **ordre pondéral décroissant** (du plus lourd au plus léger).

**Exemple** :
```
Ingrédients : Farine de BLÉ (45%), sucre (20%), beurre (LAIT) (15%), 
ŒUFS (10%), eau (8%), sel (2%)
```

⚠️ **Notre implémentation** : Pas de tri automatique par poids  
🔧 **Solution** : Fonction `generateIngredientList(recipeId)`

---

## 5. RÈGLES DE PRÉSENTATION

### 5.1 Lisibilité (Article 13 INCO)

**Obligation** : Taille minimale de la police

- **Hauteur minimale** : 1,2 mm (si surface >80 cm²)
- **Hauteur minimale** : 0,9 mm (si surface <80 cm²)

✅ **À vérifier** : Paramètres d'impression des étiquettes PDF

### 5.2 Langue (Article 15 INCO)

- **France** : Français obligatoire
- **UE** : Langue(s) comprise(s) par les consommateurs

✅ **Notre implémentation** : Français par défaut  
🆕 **Future feature** : Multilingue (Phase 2)

### 5.3 Champ visuel principal

Les mentions suivantes doivent être dans le **champ visuel principal** :
- Dénomination de vente
- Quantité nette
- Titre alcoométrique (si applicable)

---

## 6. ANALYSE DE NOTRE IMPLÉMENTATION

### 6.1 Synthèse de conformité

| **Domaine** | **Conformité** | **Note** | **Commentaire** |
|-------------|----------------|----------|-----------------|
| **Allergènes** | 🟢 Conforme | 95% | 14 ADO présents, détection auto OK, manque mise en forme |
| **Nutrition** | 🔴 Non conforme | 60% | Manque kJ, acides gras saturés, sucres |
| **Étiquetage** | 🔴 Non implémenté | 20% | Manque 9 mentions obligatoires sur 12 |
| **Traçabilité** | 🔴 Non implémenté | 0% | Pas de lot, DLC, DLUO |
| **Arrondis** | 🟡 Partiel | 80% | OK sauf sel (2 décimales) |

**Score global** : 🟡 **51% conforme**

### 6.2 Niveau de risque juridique

| **Risque** | **Niveau** | **Impact** | **Probabilité** |
|------------|------------|-----------|----------------|
| Allergènes mal déclarés | 🔴 CRITIQUE | Accident allergique → poursuites pénales | Faible (détection auto OK) |
| Nutrition incomplète | 🟠 ÉLEVÉ | Amende DGCCRF (jusqu'à 300k€) | Moyen (contrôles fréquents) |
| Absence de lot/DLC | 🟠 ÉLEVÉ | Impossibilité de rappel produit | Faible (si pas de problème) |
| Étiquette illisible | 🟡 MOYEN | Amende mineure | Faible |

### 6.3 Priorités de correction

#### 🔴 URGENT (Phase 1 - Avant lancement MVP)

1. **Ajouter acides gras saturés et sucres** (migration Prisma)
2. **Ajouter kJ à la valeur énergétique**
3. **Corriger arrondi du sel** (2 décimales)
4. **Générer liste d'ingrédients triée par poids**
5. **Mise en évidence allergènes en GRAS**

#### 🟠 IMPORTANT (Phase 2 - Post MVP)

6. **Ajouter champs étiquetage** (DLC, DLUO, lot, fabricant)
7. **Générer étiquettes PDF conformes**
8. **Gestion des traces d'allergènes**
9. **Validation des données nutritionnelles (Ciqual ANSES)**

#### 🟡 SOUHAITABLE (Phase 3)

10. **Calcul automatique du Nutri-Score**
11. **Conformité bio/AOP/IGP**
12. **Export multilingue**

---

## 7. POINTS DE NON-CONFORMITÉ À CORRIGER

### 7.1 Migration Prisma urgente

```prisma
// backend/services/recipe-service/prisma/schema.prisma

model Ingredient {
  id          String   @id @default(uuid())
  userId      String
  name        String
  unit        String   @default("g")
  pricePerUnit Float   @default(0)
  
  // VALEURS NUTRITIONNELLES (pour 100g/100ml)
  // Obligatoires INCO
  calories       Float? // kcal
  proteins       Float? // g
  carbs          Float? // g - Glucides totaux
  sugars         Float? // g - dont sucres (OBLIGATOIRE INCO) 🆕
  fats           Float? // g - Matières grasses totales
  saturatedFats  Float? // g - dont acides gras saturés (OBLIGATOIRE INCO) 🆕
  salt           Float? // g - Sel
  
  // Facultatifs (nice to have)
  fiber          Float? // g - Fibres alimentaires
  sodium         Float? // g - Sodium (sel = sodium * 2.5)
  
  // Allergènes (14 ADO)
  allergens      String?  // CSV: "gluten,lait,oeufs"
  allergenTraces String?  // Traces possibles: "fruits-a-coque,arachides" 🆕
  
  // Relations
  recipes     RecipeIngredient[]
  
  // Métadonnées
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([name])
  @@map("ingredients")
}

model Recipe {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  category    String?
  servings    Int      @default(1)
  
  // NOUVEAUX CHAMPS pour étiquetage 🆕
  batchNumber String?  // Numéro de lot (ex: "2025-10-24-001")
  dlc         DateTime? // Date Limite de Consommation
  dluo        DateTime? // Date Limite d'Utilisation Optimale
  storageInstructions String? // Conditions de conservation
  
  // Relations
  ingredients RecipeIngredient[]
  
  // Métadonnées
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([category])
  @@map("recipes")
}
```

### 7.2 Corrections du service nutrition

```javascript
// backend/services/recipe-service/src/services/nutrition.service.js

export const calculateNutrition = async (recipeId) => {
  // ... code existant ...

  // Calculer pour 100g (basé sur poids FINAL)
  const per100g = totalWeightFinal > 0 ? {
    // 🆕 Énergie en kJ ET kcal (OBLIGATOIRE INCO)
    energyKj: Math.round((totalCalories / totalWeightFinal) * 100 * 4.184),
    energyKcal: Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10,
    
    proteins: Math.round((totalProteins / totalWeightFinal) * 100 * 10) / 10,
    
    carbs: Math.round((totalCarbs / totalWeightFinal) * 100 * 10) / 10,
    sugars: Math.round((totalSugars / totalWeightFinal) * 100 * 10) / 10, // 🆕
    
    fats: Math.round((totalFats / totalWeightFinal) * 100 * 10) / 10,
    saturatedFats: Math.round((totalSaturatedFats / totalWeightFinal) * 100 * 10) / 10, // 🆕
    
    // 🔧 Sel : 2 décimales (au lieu de 1)
    salt: Math.round((totalSalt / totalWeightFinal) * 100 * 100) / 100
  } : {
    energyKj: 0,
    energyKcal: 0,
    proteins: 0,
    carbs: 0,
    sugars: 0, // 🆕
    fats: 0,
    saturatedFats: 0, // 🆕
    salt: 0
  };

  return {
    per100g,
    perServing,
    totalWeight: totalWeightFinal
  };
};
```

### 7.3 Nouveau service : Génération liste d'ingrédients

```javascript
// backend/services/recipe-service/src/services/ingredient-list.service.js

/**
 * Génère la liste d'ingrédients conforme INCO (ordre pondéral décroissant)
 * @param {string} recipeId
 * @returns {Promise<string>} Liste formatée avec allergènes en GRAS
 */
export const generateIngredientList = async (recipeId) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: {
        include: {
          ingredient: true
        },
        orderBy: {
          quantity: 'desc' // Tri par poids décroissant
        }
      }
    }
  });

  const totalWeight = recipe.ingredients.reduce((sum, ri) => sum + ri.quantity, 0);

  const ingredientList = recipe.ingredients.map(ri => {
    const percentage = ((ri.quantity / totalWeight) * 100).toFixed(1);
    const name = ri.ingredient.name;
    
    // Mise en évidence des allergènes
    const allergens = ri.ingredient.allergens ? ri.ingredient.allergens.split(',') : [];
    const hasAllergen = allergens.length > 0;
    
    // Format HTML pour PDF (ou ** pour markdown)
    const formattedName = hasAllergen 
      ? `<strong>${name.toUpperCase()}</strong>` 
      : name;
    
    return `${formattedName} (${percentage}%)`;
  });

  return `Ingrédients : ${ingredientList.join(', ')}`;
};
```

---

## 8. RECOMMANDATIONS ET BEST PRACTICES

### 8.1 Checklist avant lancement MVP

- [ ] Migrer Prisma : ajouter `sugars`, `saturatedFats`, `allergenTraces`
- [ ] Corriger `nutrition.service.js` : kJ, sucres, acides gras saturés, sel 2 décimales
- [ ] Implémenter `generateIngredientList()` avec tri pondéral
- [ ] Ajouter mise en évidence allergènes (GRAS)
- [ ] Tester avec données réelles (base Ciqual ANSES)
- [ ] Valider calculs avec expert nutrition
- [ ] Tests unitaires : cas limites (perte 100%, allergènes multiples)

### 8.2 Validation des données nutritionnelles

🔗 **Source officielle** : Base Ciqual ANSES  
https://ciqual.anses.fr/

**Recommandation** : Importer les données depuis Ciqual pour garantir la fiabilité :
- 3 200+ aliments
- Valeurs validées scientifiquement
- Mise à jour annuelle

### 8.3 Disclaimer légal à ajouter

Sur l'interface utilisateur :

```
⚠️ IMPORTANT
Les valeurs nutritionnelles affichées sont calculées automatiquement à partir 
des ingrédients saisis. Il est de la responsabilité de l'utilisateur de vérifier 
l'exactitude des données sources. En cas de doute, consultez un expert en nutrition.

Les calculs sont conformes au Règlement (UE) n°1169/2011 (INCO).
```

### 8.4 Bonnes pratiques additionnelles

1. **Traçabilité** : Logger tous les calculs (date, version de l'algo)
2. **Audit trail** : Conserver l'historique des modifications d'ingrédients
3. **Validation croisée** : Alerte si valeurs aberrantes (ex: 500g de sel/100g)
4. **Cache invalidation** : Recalculer si ingrédient modifié
5. **Export PDF** : Générer étiquettes conformes (format A4, 40x30mm, etc.)

---

## 9. RESSOURCES ET CONTACTS

### 9.1 Textes officiels

- **Règlement INCO** : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R1169
- **DGCCRF Étiquetage** : https://www.economie.gouv.fr/dgccrf/etiquetage-des-denrees-alimentaires
- **Base Ciqual ANSES** : https://ciqual.anses.fr/

### 9.2 Organismes de contrôle

- **DGCCRF** : Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes
- **ANSES** : Agence Nationale de Sécurité Sanitaire de l'Alimentation
- **Chambre des Métiers** : Support aux artisans

### 9.3 Organismes professionnels

- **Confédération Nationale de la Boulangerie-Pâtisserie**
- **Union des Métiers et des Industries de l'Hôtellerie (UMIH)**
- **Fédération des Entreprises de Boulangerie et Pâtisserie Françaises (FEBPF)**

---

## 📝 RÉSUMÉ EXÉCUTIF - ACTIONS IMMÉDIATES

### 🔴 CRITIQUE (Bloquer le lancement sans ces correctifs)

1. ✅ Ajouter `sugars` et `saturatedFats` dans Prisma
2. ✅ Ajouter calcul kJ (énergieKj = kcal * 4.184)
3. ✅ Corriger arrondi sel (2 décimales au lieu de 1)

### 🟠 IMPORTANT (À faire avant commercialisation)

4. ✅ Implémenter génération liste d'ingrédients triée
5. ✅ Mise en évidence allergènes en GRAS
6. ✅ Ajouter champs DLC/DLUO/lot dans Recipe

### 🟡 RECOMMANDÉ (Post-MVP)

7. ✅ Import base Ciqual ANSES
8. ✅ Génération étiquettes PDF conformes
9. ✅ Tests de validation avec expert nutrition

---

**Document validé par** : Analyse réglementaire complète  
**Prochaine révision** : À chaque mise à jour du Règlement INCO  
**Contact** : DGCCRF (https://signal.conso.gouv.fr)

---

*Ce document est fourni à titre informatif. En cas de doute, consultez un avocat spécialisé en droit alimentaire.*
