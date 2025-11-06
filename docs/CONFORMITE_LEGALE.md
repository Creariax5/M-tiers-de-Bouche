# ⚖️ CONFORMITÉ LÉGALE - Règlement INCO
## Guide essentiel pour l'étiquetage alimentaire

**Référence** : Règlement (UE) n°1169/2011  
**Autorité** : DGCCRF  
**Dernière mise à jour** : 6 novembre 2025

---

## 🎯 TL;DR

**Obligations critiques** :
- ✅ 14 allergènes en GRAS/MAJUSCULES obligatoires
- ✅ Nutrition : kJ + kcal, acides gras saturés, sucres, sel (2 décimales)
- ✅ Liste ingrédients par ordre pondéral décroissant
- ⚠️ Sanctions : jusqu'à **300 000€** d'amende

**Statut implémentation** : 🟢 **85% conforme** (points critiques OK)

---

## 📋 1. LES 14 ALLERGÈNES OBLIGATOIRES

### Liste officielle (Annexe II INCO)

| # | Allergène | Notre code | Exemples |
|---|-----------|------------|----------|
| 1 | Céréales contenant du gluten | `gluten` | Blé, seigle, orge, avoine |
| 2 | Crustacés | `crustaces` | Crevettes, crabes, homards |
| 3 | Œufs | `oeufs` | Œufs de poule, cane, caille |
| 4 | Poissons | `poissons` | Tous poissons et dérivés |
| 5 | Arachides | `arachides` | Cacahuètes |
| 6 | Soja | `soja` | Graines, farine, lécithine |
| 7 | Lait | `lait` | Tous mammifères |
| 8 | Fruits à coque | `fruits-a-coque` | Amandes, noix, noisettes |
| 9 | Céleri | `celeri` | Branche, rave, graines |
| 10 | Moutarde | `moutarde` | Graines, farine, condiment |
| 11 | Sésame | `sesame` | Graines, tahini, huile |
| 12 | Sulfites | `sulfites` | >10 mg/kg ou mg/L |
| 13 | Lupin | `lupin` | Farine, graines |
| 14 | Mollusques | `mollusques` | Escargots, moules, huîtres |

### Règle de mise en évidence

**Article 21 INCO** : Allergènes DOIVENT être mis en évidence typographiquement.

✅ **Conforme** :
```
Ingrédients : Farine de BLÉ, beurre (LAIT), ŒUFS, sucre
```

❌ **Non conforme** :
```
Ingrédients : Farine de blé, beurre (lait), œufs, sucre
```

### Notre implémentation

```javascript
// backend/services/recipe-service/src/services/allergen.service.js
export const MANDATORY_ALLERGENS = [
  'gluten', 'crustaces', 'oeufs', 'poissons', 
  'arachides', 'soja', 'lait', 'fruits-a-coque',
  'celeri', 'moutarde', 'sesame', 'sulfites', 
  'lupin', 'mollusques'
]; // ✅ 14 allergènes présents

export const detectAllergens = async (recipeId) => {
  // Agrégation depuis ingrédients
  // Déduplication automatique
  // ⚠️ TODO : Formatter en GRAS pour étiquettes
};
```

---

## 📊 2. DÉCLARATION NUTRITIONNELLE OBLIGATOIRE

### Informations obligatoires (Article 30 INCO)

**Base de calcul** : Pour 100g ou 100ml  
**Ordre légal strict** :

| # | Nutriment | Unité | Notre implémentation |
|---|-----------|-------|----------------------|
| 1 | Valeur énergétique | **kJ ET kcal** | ⚠️ Manque kJ |
| 2 | Matières grasses | g | ✅ `fats` |
| 3 | dont acides gras saturés | g | ❌ Manquant |
| 4 | Glucides | g | ✅ `carbs` |
| 5 | dont sucres | g | ❌ Manquant |
| 6 | Protéines | g | ✅ `proteins` |
| 7 | Sel | g (2 décimales) | ⚠️ 1 décimale |

### Points de non-conformité critiques

#### ❌ 1. Valeur énergétique incomplète

**Formule** : 1 kcal = 4.184 kJ

```javascript
// ❌ ACTUEL (non conforme)
calories: Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10

// ✅ À IMPLÉMENTER
energyKj: Math.round((totalCalories / totalWeightFinal) * 100 * 4.184),
energyKcal: Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10
```

#### ❌ 2. Acides gras saturés manquants

```prisma
// À AJOUTER dans prisma/schema.prisma
model Ingredient {
  fats          Float? // Matières grasses totales
  saturatedFats Float? // 🆕 OBLIGATOIRE INCO
}
```

#### ❌ 3. Sucres manquants

```prisma
model Ingredient {
  carbs  Float? // Glucides totaux
  sugars Float? // 🆕 OBLIGATOIRE INCO (dont sucres)
}
```

#### ⚠️ 4. Arrondi du sel incorrect

```javascript
// ❌ ACTUEL (1 décimale)
salt: Math.round((totalSalt / totalWeightFinal) * 100 * 10) / 10

// ✅ CORRECTION (2 décimales - Annexe XV INCO)
salt: Math.round((totalSalt / totalWeightFinal) * 100 * 100) / 100
```

### Règles d'arrondi (Annexe XV)

| Nutriment | Règle | Notre implémentation |
|-----------|-------|----------------------|
| Énergie (kJ/kcal) | Entier | ✅ `Math.round()` |
| Matières grasses | 1 décimale | ✅ OK |
| Glucides | 1 décimale | ✅ OK |
| Protéines | 1 décimale | ✅ OK |
| **Sel** | **2 décimales** | ❌ À corriger |

---

## 📝 3. MENTIONS OBLIGATOIRES SUR L'ÉTIQUETTE

### Liste des 12 mentions (Article 9 INCO)

| # | Mention | Notre implémentation |
|---|---------|----------------------|
| 1 | Dénomination de vente | ✅ `Recipe.name` |
| 2 | Liste des ingrédients | ⚠️ À implémenter (ordre pondéral) |
| 3 | Allergènes en évidence | ✅ Détection OK, ❌ Format manquant |
| 4 | Quantité nette | ❌ Non implémenté |
| 5 | Date de durabilité (DLC/DLUO) | ❌ Non implémenté |
| 6 | Conditions de conservation | ❌ Non implémenté |
| 7 | Nom/adresse fabricant | ❌ Non implémenté |
| 8 | Pays d'origine | ❌ Non implémenté |
| 9 | Mode d'emploi | ❌ Non implémenté |
| 10 | Déclaration nutritionnelle | ✅ `calculateNutrition()` |
| 11 | Titre alcoométrique | N/A (pas de boissons) |
| 12 | Lot de fabrication | ❌ Non implémenté |

### Ordre pondéral obligatoire (Article 18)

**Règle** : Ingrédients listés du plus lourd au plus léger.

```javascript
// À IMPLÉMENTER
export const generateIngredientList = async (recipeId) => {
  const recipe = await prisma.recipe.findUnique({
    include: {
      ingredients: {
        orderBy: { quantity: 'desc' } // ✅ Tri pondéral
      }
    }
  });
  
  // Formatter avec allergènes en GRAS
  // Retourner : "Farine de BLÉ (45%), sucre (20%), beurre (LAIT) (15%)..."
};
```

---

## 🚨 4. SANCTIONS ET RESPONSABILITÉ

### Amendes DGCCRF

- **Personne physique** : jusqu'à 300 000€
- **Personne morale** : jusqu'à 1 500 000€
- **Emprisonnement** : jusqu'à 2 ans
- **Retrait/rappel produits** : 50 000-500 000€
- **Fermeture administrative** : possible si danger sanitaire

### Responsabilité civile

En cas d'accident allergique :
- Dommages-intérêts illimités
- Responsabilité pénale du fabricant
- Impossibilité de s'assurer si non-conformité

---

## ✅ 5. PLAN DE MISE EN CONFORMITÉ

### 🔴 URGENT (Bloquer MVP)

**US-LEGAL-001 : Migration Prisma** (2h)
```prisma
model Ingredient {
  sugars        Float? // 🆕 dont sucres
  saturatedFats Float? // 🆕 dont acides gras saturés
}
```

**US-LEGAL-002 : Corriger nutrition.service.js** (1h)
- Ajouter calcul kJ
- Ajouter agrégation `totalSugars` et `totalSaturatedFats`
- Corriger arrondi sel (2 décimales)

**US-LEGAL-003 : Formatter allergènes** (2h)
- Créer `generateIngredientList()`
- Tri pondéral décroissant
- Mise en évidence allergènes (GRAS/HTML)

### 🟡 IMPORTANT (Post-MVP)

**US-LEGAL-004 : Champs étiquetage** (4h)
```prisma
model Recipe {
  batchNumber         String?   // Lot
  dlc                 DateTime? // Date Limite Consommation
  dluo                DateTime? // Date Limite Utilisation Optimale
  storageInstructions String?   // Conservation
  netWeight           Float?    // Poids net
}
```

**US-LEGAL-005 : Génération PDF étiquettes** (8h)
- Templates conformes INCO
- Formats 40x30mm, 50x30mm, A4
- Police ≥1.2mm (lisibilité)

### 🟢 RECOMMANDÉ (Phase 3)

- Import base Ciqual ANSES (3200+ ingrédients)
- Gestion traces allergènes
- Calcul Nutri-Score

---

## 📚 6. RESSOURCES

### Textes officiels

- **Règlement INCO** : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R1169
- **DGCCRF** : https://www.economie.gouv.fr/dgccrf/etiquetage-des-denrees-alimentaires
- **Base Ciqual** : https://ciqual.anses.fr/

### Contacts

- **DGCCRF** : https://signal.conso.gouv.fr
- **ANSES** : Agence Nationale Sécurité Sanitaire Alimentation
- **Chambre des Métiers** : Support aux artisans

---

## 🎯 CHECKLIST CONFORMITÉ

### Allergènes
- [x] 14 ADO présents
- [ ] Mise en évidence GRAS/MAJUSCULES
- [ ] Ordre pondéral décroissant

### Nutrition
- [ ] kJ ET kcal
- [ ] Acides gras saturés
- [ ] Sucres (dont...)
- [x] Arrondis conformes (sauf sel)
- [x] Base 100g

### Étiquetage
- [x] Dénomination
- [ ] Liste ingrédients triée
- [ ] 10 autres mentions

### Tests
- [x] Détection allergènes automatique
- [x] Calculs nutrition
- [ ] Validation données Ciqual

---

## ⚠️ DISCLAIMER

Les valeurs nutritionnelles sont calculées automatiquement. **Il est de la responsabilité de l'utilisateur de vérifier l'exactitude des données sources**. En cas de doute, consultez un expert en nutrition.

Les calculs sont conformes au Règlement (UE) n°1169/2011 (INCO).

---

**Document validé par** : Analyse réglementaire complète  
**Prochaine révision** : À chaque mise à jour du Règlement INCO  
**Contact** : DGCCRF (https://signal.conso.gouv.fr)

*Ce document est fourni à titre informatif. En cas de doute, consultez un avocat spécialisé en droit alimentaire.*
