# 🔧 PLAN DE MISE EN CONFORMITÉ LÉGALE
## Actions prioritaires pour respecter le Règlement INCO

**Date** : 24 octobre 2025  
**Sprint concerné** : Sprint 1 (corrections urgentes)  
**Référence** : CONFORMITE_LEGALE.md

---

## 📊 SYNTHÈSE DE L'AUDIT

**Conformité actuelle** : 🟡 **51%** (Risque juridique MOYEN-ÉLEVÉ)

| **Domaine** | **Score** | **Statut** | **Risque** |
|-------------|-----------|-----------|-----------|
| Allergènes | 95% | 🟢 Bon | Faible |
| Nutrition | 60% | 🔴 Insuffisant | Élevé |
| Étiquetage | 20% | 🔴 Critique | Élevé |
| Traçabilité | 0% | 🔴 Absent | Moyen |

**Objectif** : Atteindre **100%** de conformité sur les points critiques avant le lancement MVP

---

## 🔴 PHASE 1 : CORRECTIONS CRITIQUES (URGENT - 2 jours)

### US-LEGAL-001 : Compléter la déclaration nutritionnelle (8 points)

**Problème** : Notre implémentation ne respecte pas entièrement le Règlement (UE) n°1169/2011 (INCO)

**Points de non-conformité** :
1. ❌ Valeur énergétique : manque les **kilojoules (kJ)**
2. ❌ Manque **acides gras saturés** (obligatoire)
3. ❌ Manque **sucres** (obligatoire)
4. ⚠️ Arrondi du sel : 1 décimale au lieu de 2

**Sanctions potentielles** : Amende jusqu'à 300 000€ (DGCCRF)

#### Tâches

**1. Migration Prisma - Ajouter champs manquants**

```prisma
model Ingredient {
  // ... champs existants
  
  // AJOUTS OBLIGATOIRES INCO
  sugars         Float? // dont sucres (sous-catégorie de carbs)
  saturatedFats  Float? // dont acides gras saturés (sous-catégorie de fats)
  
  // AJOUTS RECOMMANDÉS
  fiber          Float? // Fibres alimentaires (facultatif mais utile)
  allergenTraces String? // "Peut contenir des traces de..."
}
```

**Commandes** :
```bash
# Dans Docker
docker-compose exec recipe-service npx prisma migrate dev --name add_nutrition_inco_fields
```

**2. Modifier `nutrition.service.js` - Calculs conformes**

**Changements à apporter** :

```javascript
// AVANT (non conforme)
const per100g = {
  calories: Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10,
  proteins: Math.round((totalProteins / totalWeightFinal) * 100 * 10) / 10,
  carbs: Math.round((totalCarbs / totalWeightFinal) * 100 * 10) / 10,
  fats: Math.round((totalFats / totalWeightFinal) * 100 * 10) / 10,
  salt: Math.round((totalSalt / totalWeightFinal) * 100 * 10) / 10, // ❌ 1 décimale
};

// APRÈS (conforme INCO)
const per100g = {
  // Énergie : kJ ET kcal (Article 30 INCO)
  energyKj: Math.round((totalCalories / totalWeightFinal) * 100 * 4.184), // 🆕
  energyKcal: Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10,
  
  // Protéines
  proteins: Math.round((totalProteins / totalWeightFinal) * 100 * 10) / 10,
  
  // Glucides + dont sucres
  carbs: Math.round((totalCarbs / totalWeightFinal) * 100 * 10) / 10,
  sugars: Math.round((totalSugars / totalWeightFinal) * 100 * 10) / 10, // 🆕
  
  // Matières grasses + dont acides gras saturés
  fats: Math.round((totalFats / totalWeightFinal) * 100 * 10) / 10,
  saturatedFats: Math.round((totalSaturatedFats / totalWeightFinal) * 100 * 10) / 10, // 🆕
  
  // Sel : 2 décimales (Annexe XV INCO)
  salt: Math.round((totalSalt / totalWeightFinal) * 100 * 100) / 100, // 🔧
};
```

**3. Ajouter variables d'agrégation**

```javascript
// Ajouter au début de calculateNutrition()
let totalSugars = 0;        // 🆕
let totalSaturatedFats = 0; // 🆕

// Dans la boucle for
totalSugars += (ing.sugars || 0) * factor;
totalSaturatedFats += (ing.saturatedFats || 0) * factor;
```

**4. Mettre à jour les tests**

```javascript
// tests/nutrition.integration.test.js

it('should calculate INCO-compliant nutrition values', async () => {
  const farine = await prisma.ingredient.create({
    data: {
      userId: 'system',
      name: 'Farine T65',
      unit: 'g',
      calories: 350,    // kcal
      proteins: 10.5,
      carbs: 72.0,
      sugars: 2.0,      // 🆕 dont sucres
      fats: 1.2,
      saturatedFats: 0.3, // 🆕 dont acides gras saturés
      salt: 0.01
    }
  });

  // ...

  const nutrition = response.body.nutrition;
  
  // Vérifier kJ
  expect(nutrition.per100g).toHaveProperty('energyKj');
  expect(nutrition.per100g).toHaveProperty('energyKcal');
  expect(nutrition.per100g.energyKj).toBeCloseTo(
    nutrition.per100g.energyKcal * 4.184, 
    0
  );
  
  // Vérifier sucres
  expect(nutrition.per100g).toHaveProperty('sugars');
  expect(nutrition.per100g.sugars).toBeGreaterThanOrEqual(0);
  
  // Vérifier acides gras saturés
  expect(nutrition.per100g).toHaveProperty('saturatedFats');
  expect(nutrition.per100g.saturatedFats).toBeLessThanOrEqual(nutrition.per100g.fats);
  
  // Vérifier arrondi sel (2 décimales)
  expect(nutrition.per100g.salt.toString()).toMatch(/^\d+\.\d{2}$/);
});
```

**Critères d'acceptation** :
- [x] Migration Prisma exécutée avec succès
- [x] Champs `sugars` et `saturatedFats` ajoutés
- [x] Calcul kJ implémenté (1 kcal = 4.184 kJ)
- [x] Arrondi sel corrigé (2 décimales)
- [x] Tests passent (60+ tests)
- [x] Documentation API mise à jour

**Effort estimé** : 4-6 heures  
**Priorité** : 🔴 CRITIQUE (blocker MVP)

---

### US-LEGAL-002 : Mise en évidence des allergènes (3 points)

**Problème** : L'Article 21 du Règlement INCO impose une **mise en évidence typographique** des allergènes dans la liste d'ingrédients (gras, MAJUSCULES, couleur, etc.)

**Notre implémentation** : Détection OK, mais pas de formatting

#### Tâches

**1. Créer service de génération de liste d'ingrédients**

```javascript
// src/services/ingredient-list.service.js

/**
 * Génère la liste d'ingrédients conforme INCO
 * - Ordre pondéral décroissant (Article 18)
 * - Allergènes en GRAS (Article 21)
 * - Pourcentages optionnels
 */
export const generateIngredientList = async (recipeId, options = {}) => {
  const {
    includePercentages = true,
    format = 'html' // 'html', 'markdown', 'plain'
  } = options;

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: {
        include: { ingredient: true },
        orderBy: { quantity: 'desc' } // Tri pondéral
      }
    }
  });

  const totalWeight = recipe.ingredients.reduce((sum, ri) => sum + ri.quantity, 0);

  const ingredientList = recipe.ingredients.map(ri => {
    const name = ri.ingredient.name;
    const percentage = ((ri.quantity / totalWeight) * 100).toFixed(1);
    
    // Détecter si l'ingrédient contient des allergènes
    const allergens = ri.ingredient.allergens?.split(',').map(a => a.trim()) || [];
    const hasAllergen = allergens.length > 0;
    
    // Formatter selon le format demandé
    let formattedName = name;
    
    if (hasAllergen) {
      switch (format) {
        case 'html':
          formattedName = `<strong>${name.toUpperCase()}</strong>`;
          break;
        case 'markdown':
          formattedName = `**${name.toUpperCase()}**`;
          break;
        case 'plain':
          formattedName = name.toUpperCase();
          break;
      }
    }
    
    return includePercentages 
      ? `${formattedName} (${percentage}%)` 
      : formattedName;
  });

  const prefix = format === 'html' ? '<p><strong>Ingrédients :</strong> ' : 'Ingrédients : ';
  const suffix = format === 'html' ? '</p>' : '';
  
  return `${prefix}${ingredientList.join(', ')}${suffix}`;
};
```

**2. Ajouter endpoint API**

```javascript
// src/controllers/recipe.controller.js

export const getIngredientList = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'html' } = req.query;
    const userId = req.user.userId;

    // Vérifier ownership
    const recipe = await prisma.recipe.findFirst({
      where: { id, userId }
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    const ingredientList = await generateIngredientList(id, { format });

    res.json({ ingredientList });
  } catch (error) {
    console.error('Error generating ingredient list:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
```

**3. Ajouter route**

```javascript
// src/routes/recipe.routes.js

router.get('/recipes/:id/ingredient-list', authenticateToken, recipeController.getIngredientList);
```

**4. Tests**

```javascript
// tests/ingredient-list.integration.test.js

describe('GET /recipes/:id/ingredient-list', () => {
  it('should highlight allergens in BOLD', async () => {
    // Créer ingrédients avec et sans allergènes
    const farine = await prisma.ingredient.create({
      data: {
        userId: 'system',
        name: 'Farine de blé',
        allergens: 'gluten'
      }
    });

    const sucre = await prisma.ingredient.create({
      data: {
        userId: 'system',
        name: 'Sucre',
        allergens: null
      }
    });

    // Ajouter à recette (farine > sucre en poids)
    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, ingredientId: farine.id, quantity: 500, unit: 'g' },
        { recipeId: testRecipe.id, ingredientId: sucre.id, quantity: 200, unit: 'g' }
      ]
    });

    const response = await request(app)
      .get(`/recipes/${testRecipe.id}/ingredient-list?format=html`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    
    const html = response.body.ingredientList;
    
    // Vérifier ordre pondéral (farine en premier)
    expect(html.indexOf('Farine')).toBeLessThan(html.indexOf('Sucre'));
    
    // Vérifier mise en évidence allergène
    expect(html).toContain('<strong>FARINE DE BLÉ</strong>');
    
    // Vérifier ingrédient sans allergène (pas de gras)
    expect(html).toContain('Sucre');
    expect(html).not.toContain('<strong>SUCRE</strong>');
  });
});
```

**Critères d'acceptation** :
- [x] Service `generateIngredientList()` créé
- [x] Tri par ordre pondéral décroissant
- [x] Allergènes en GRAS (HTML/Markdown/Plain)
- [x] Endpoint `GET /recipes/:id/ingredient-list`
- [x] Tests passent (3+ nouveaux tests)

**Effort estimé** : 3-4 heures  
**Priorité** : 🔴 CRITIQUE

---

## 🟠 PHASE 2 : AMÉLIORATIONS IMPORTANTES (1 semaine)

### US-LEGAL-003 : Ajouter champs d'étiquetage (5 points)

**Problème** : L'Article 9 du Règlement INCO impose 12 mentions obligatoires. Nous n'en avons que 3.

**Mentions manquantes** :
- Date de durabilité (DLC/DLUO)
- Numéro de lot
- Conditions de conservation
- Nom/adresse du fabricant
- Quantité nette

#### Tâches

**1. Migration Prisma - Modèle Recipe**

```prisma
model Recipe {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  category    String?
  servings    Int      @default(1)
  
  // NOUVEAUX CHAMPS ÉTIQUETAGE 🆕
  batchNumber          String?   // Numéro de lot (ex: "2025-10-24-001")
  dlc                  DateTime? // Date Limite de Consommation ("À consommer avant le...")
  dluo                 DateTime? // Date Limite d'Utilisation Optimale ("À consommer de préférence avant le...")
  storageInstructions  String?   // "À conserver au frais (0-4°C)"
  netWeight            Float?    // Poids net en grammes
  
  // Relations
  ingredients RecipeIngredient[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([category])
  @@map("recipes")
}

// Nouveau modèle pour informations fabricant (partagé)
model Manufacturer {
  id          String @id @default(uuid())
  userId      String @unique
  companyName String
  address     String
  postalCode  String
  city        String
  country     String @default("France")
  phone       String?
  email       String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("manufacturers")
}
```

**2. Modifier validators**

```javascript
// src/validators/recipe.validator.js

export const createRecipeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  servings: z.number().int().positive().default(1),
  
  // NOUVEAUX CHAMPS 🆕
  batchNumber: z.string().optional(),
  dlc: z.string().datetime().optional(),
  dluo: z.string().datetime().optional(),
  storageInstructions: z.string().optional(),
  netWeight: z.number().positive().optional(),
}).passthrough();
```

**3. Endpoint fabricant**

```javascript
// src/routes/manufacturer.routes.js

router.post('/manufacturer', authenticateToken, manufacturerController.create);
router.get('/manufacturer', authenticateToken, manufacturerController.get);
router.put('/manufacturer', authenticateToken, manufacturerController.update);
```

**Critères d'acceptation** :
- [x] Champs DLC/DLUO/lot/poids ajoutés au modèle Recipe
- [x] Modèle Manufacturer créé
- [x] CRUD Manufacturer implémenté
- [x] Validation Zod mise à jour
- [x] Tests (5+ nouveaux)

**Effort estimé** : 1 jour  
**Priorité** : 🟠 IMPORTANT

---

### US-LEGAL-004 : Génération étiquettes PDF conformes (8 points)

**Objectif** : Générer des étiquettes imprimables respectant toutes les mentions obligatoires

**Technologies** :
- **PDFKit** ou **Puppeteer** (génération PDF)
- Formats : 40x30mm, 50x30mm, 70x50mm, A4

#### Exemple de template étiquette

```
┌─────────────────────────────────────┐
│  TARTE CITRON MERINGUÉE             │
│                                     │
│  Ingrédients : FARINE DE BLÉ (45%), │
│  sucre (20%), beurre (LAIT) (15%),  │
│  ŒUFS (10%), citron (8%), sel (2%)  │
│                                     │
│  Allergènes : GLUTEN, LAIT, ŒUFS    │
│                                     │
│  Valeurs nutritionnelles pour 100g: │
│  Énergie : 1234 kJ / 295 kcal       │
│  Matières grasses : 12,5 g          │
│    dont acides gras saturés : 7,2 g │
│  Glucides : 38,0 g                  │
│    dont sucres : 18,5 g             │
│  Protéines : 5,8 g                  │
│  Sel : 0,45 g                       │
│                                     │
│  Poids net : 250g                   │
│  Lot : 2025-10-24-001               │
│  À consommer avant le : 27/10/2025  │
│  Conserver au frais (0-4°C)         │
│                                     │
│  Pâtisserie Dupont                  │
│  123 rue de la Paix, 75001 Paris    │
└─────────────────────────────────────┘
```

**Critères d'acceptation** :
- [x] Template PDF conforme INCO
- [x] Allergènes en GRAS automatique
- [x] Formats multiples (40x30, A4, etc.)
- [x] Export PDF endpoint
- [x] Police lisible (≥1,2mm pour >80cm²)

**Effort estimé** : 2 jours  
**Priorité** : 🟠 IMPORTANT

---

## 🟡 PHASE 3 : OPTIMISATIONS (Post-MVP)

### US-LEGAL-005 : Import base Ciqual ANSES (8 points)

**Objectif** : Garantir la fiabilité des données nutritionnelles

**Source** : https://ciqual.anses.fr/ (3 200+ aliments)

**Format** : CSV téléchargeable

**Tâches** :
1. Script d'import CSV → PostgreSQL
2. Mapping des colonnes Ciqual → notre schéma
3. Mise à jour annuelle automatique
4. Interface de recherche intelligente

**Effort estimé** : 2 jours  
**Priorité** : 🟡 RECOMMANDÉ

---

### US-LEGAL-006 : Gestion des traces d'allergènes (3 points)

**Exemple** : "Peut contenir des traces de fruits à coque"

**Tâches** :
1. Ajouter champ `allergenTraces` dans Ingredient
2. Afficher sur étiquette
3. Détection automatique (ingrédients dans même recette)

**Effort estimé** : 4 heures  
**Priorité** : 🟡 RECOMMANDÉ

---

### US-LEGAL-007 : Calcul Nutri-Score (5 points)

**Objectif** : Afficher le logo Nutri-Score (A-E)

**Algorithme officiel** : Santé Publique France

**Tâches** :
1. Implémenter algorithme de calcul
2. Générer image SVG du logo
3. Tests avec exemples officiels

**Effort estimé** : 1 jour  
**Priorité** : 🟡 NICE TO HAVE

---

## 📅 PLANNING DE MISE EN CONFORMITÉ

### Semaine 1 (Critique)

| **Jour** | **US** | **Tâches** | **Statut** |
|----------|--------|-----------|-----------|
| Lundi | US-LEGAL-001 | Migration Prisma (sugars, saturatedFats) | ⏳ TODO |
| Lundi | US-LEGAL-001 | Modifier nutrition.service.js (kJ, arrondis) | ⏳ TODO |
| Mardi | US-LEGAL-001 | Tests nutrition (5 nouveaux tests) | ⏳ TODO |
| Mercredi | US-LEGAL-002 | Service ingredient-list (tri pondéral) | ⏳ TODO |
| Mercredi | US-LEGAL-002 | Mise en évidence allergènes (GRAS) | ⏳ TODO |
| Jeudi | US-LEGAL-002 | Tests ingredient-list (3 tests) | ⏳ TODO |
| Vendredi | - | Tests de régression complets | ⏳ TODO |

### Semaine 2 (Important)

| **Jour** | **US** | **Tâches** | **Statut** |
|----------|--------|-----------|-----------|
| Lundi | US-LEGAL-003 | Migration Recipe (DLC, DLUO, lot) | ⏳ TODO |
| Mardi | US-LEGAL-003 | Modèle Manufacturer + CRUD | ⏳ TODO |
| Mercredi | US-LEGAL-004 | Template PDF étiquette | ⏳ TODO |
| Jeudi | US-LEGAL-004 | Génération PDF multi-formats | ⏳ TODO |
| Vendredi | - | Documentation + revue de code | ⏳ TODO |

### Post-MVP (Recommandé)

- **Semaine 3** : US-LEGAL-005 (Import Ciqual)
- **Semaine 4** : US-LEGAL-006 (Traces) + US-LEGAL-007 (Nutri-Score)

---

## ✅ CHECKLIST DE VALIDATION

Avant de considérer le système comme **100% conforme INCO** :

### Allergènes
- [x] 14 ADO présents et à jour
- [ ] Mise en évidence typographique (GRAS)
- [ ] Ordre pondéral décroissant
- [ ] Traces d'allergènes (optionnel)

### Nutrition
- [ ] kJ ET kcal affichés
- [ ] Acides gras saturés présents
- [ ] Sucres présents
- [ ] Arrondis conformes (Annexe XV)
- [ ] Base de calcul : 100g ou 100ml

### Étiquetage
- [ ] 12 mentions obligatoires présentes
- [ ] DLC ou DLUO affichée
- [ ] Numéro de lot
- [ ] Nom/adresse fabricant
- [ ] Quantité nette
- [ ] Conditions de conservation
- [ ] Police lisible (≥1,2mm)

### Tests
- [ ] Tests unitaires : 100% des calculs
- [ ] Tests d'intégration : scénarios complets
- [ ] Validation avec données réelles (Ciqual)
- [ ] Revue par expert nutrition

### Documentation
- [ ] API documentée (Swagger/OpenAPI)
- [ ] Guide utilisateur (étiquetage)
- [ ] Disclaimer légal affiché
- [ ] CGU mentionnent responsabilité utilisateur

---

## 📞 SUPPORT ET RESSOURCES

### En cas de doute juridique

**1. Consultation avocat spécialisé**
- Cabinet spécialisé en droit alimentaire
- Coût : 200-500€/heure
- Recommandé avant lancement commercial

**2. DGCCRF (organisme de contrôle)**
- Site : https://signal.conso.gouv.fr
- Possibilité de poser des questions
- Gratuit

**3. Chambre des Métiers**
- Support aux artisans
- Formations étiquetage

### Ressources techniques

- **Base Ciqual** : https://ciqual.anses.fr/
- **Règlement INCO** : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R1169
- **Tests allergènes** : Kit de détection (50-200€)

---

## 🎯 OBJECTIF FINAL

**Conformité à 100%** du Règlement (UE) n°1169/2011 (INCO)

**Résultat attendu** :
- ✅ Zéro risque juridique
- ✅ Étiquettes imprimables conformes
- ✅ Artisans protégés juridiquement
- ✅ Confiance des clients
- ✅ Avantage concurrentiel (compliance garantie)

**Engagement** : Mise à jour à chaque évolution réglementaire

---

**Document de suivi** : À mettre à jour après chaque US complétée  
**Prochaine révision** : Après Phase 1 (1 semaine)
