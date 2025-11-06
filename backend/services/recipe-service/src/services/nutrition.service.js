import prisma from '../lib/prisma.js';

/**
 * Calcule les valeurs nutritionnelles d'une recette (RÉCURSIF)
 * @param {string} recipeId - ID de la recette
 * @param {Set<string>} visited - Set des recettes visitées (protection boucle)
 * @returns {Promise<Object>} Valeurs nutritionnelles (per100g, perServing, totalWeight)
 */
export const calculateNutrition = async (recipeId, visited = new Set()) => {
  // Protection anti-boucle
  if (visited.has(recipeId)) {
    return null;
  }
  visited.add(recipeId);

  // Récupérer la recette avec ses ingrédients
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: {
        include: {
          ingredient: {
            select: {
              calories: true,
              proteins: true,
              carbs: true,
              sugars: true,        // 🆕 INCO
              fats: true,
              saturatedFats: true, // 🆕 INCO
              salt: true
            }
          },
          subRecipe: true // 🆕 Sous-recettes
        }
      }
    }
  });

  if (!recipe) {
    return null;
  }

  // Initialiser les totaux
  let totalCalories = 0;
  let totalProteins = 0;
  let totalCarbs = 0;
  let totalSugars = 0;        // 🆕 INCO obligatoire
  let totalFats = 0;
  let totalSaturatedFats = 0; // 🆕 INCO obligatoire
  let totalSalt = 0;
  let totalWeightInitial = 0;
  let totalWeightFinal = 0;

  // Parcourir chaque ingrédient
  for (const ri of recipe.ingredients) {
    const quantity = ri.quantity;
    const lossPercent = ri.lossPercent || 0;

    // Cas 1 : Ingrédient normal
    if (ri.ingredient) {
      const ing = ri.ingredient;

      // Poids initial (avant cuisson)
      totalWeightInitial += quantity;

      // Poids final (après perte)
      const finalWeight = quantity * (1 - lossPercent / 100);
      totalWeightFinal += finalWeight;

      // Les nutriments sont calculés sur le poids INITIAL
      // (la cuisson concentre les nutriments mais ne les détruit pas)
      const factor = quantity / 100; // conversion pour 100g

      totalCalories += (ing.calories || 0) * factor;
      totalProteins += (ing.proteins || 0) * factor;
      totalCarbs += (ing.carbs || 0) * factor;
      totalSugars += (ing.sugars || 0) * factor;               // 🆕 INCO
      totalFats += (ing.fats || 0) * factor;
      totalSaturatedFats += (ing.saturatedFats || 0) * factor; // 🆕 INCO
      totalSalt += (ing.salt || 0) * factor;
    }

    // Cas 2 : Sous-recette 🆕 (récursif)
    if (ri.subRecipe) {
      // Calculer nutrition de la sous-recette
      const subNutrition = await calculateNutrition(ri.subRecipe.id, new Set(visited));

      if (subNutrition && subNutrition.totalWeight > 0) {
        // Poids de la sous-recette
        totalWeightInitial += quantity;
        const finalWeight = quantity * (1 - lossPercent / 100);
        totalWeightFinal += finalWeight;

        // Facteur de conversion : quantité utilisée / 100g
        const factor = quantity / 100;

        // Additionner les nutriments (valeurs per100g × facteur)
        totalCalories += subNutrition.per100g.energyKcal * factor;
        totalProteins += subNutrition.per100g.proteins * factor;
        totalCarbs += subNutrition.per100g.carbs * factor;
        totalSugars += subNutrition.per100g.sugars * factor;
        totalFats += subNutrition.per100g.fats * factor;
        totalSaturatedFats += subNutrition.per100g.saturatedFats * factor;
        totalSalt += subNutrition.per100g.salt * factor;
      }
    }
  }

  // Arrondir le poids final
  totalWeightFinal = Math.round(totalWeightFinal);

  // Calculer pour 100g (basé sur poids FINAL)
  const per100g = totalWeightFinal > 0 ? {
    // 🆕 Énergie en kJ ET kcal (Article 30 INCO - OBLIGATOIRE)
    energyKj: Math.round((totalCalories / totalWeightFinal) * 100 * 4.184),
    energyKcal: Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10,
    
    // Protéines
    proteins: Math.round((totalProteins / totalWeightFinal) * 100 * 10) / 10,
    
    // Glucides + dont sucres (INCO)
    carbs: Math.round((totalCarbs / totalWeightFinal) * 100 * 10) / 10,
    sugars: Math.round((totalSugars / totalWeightFinal) * 100 * 10) / 10, // 🆕 OBLIGATOIRE
    
    // Matières grasses + dont acides gras saturés (INCO)
    fats: Math.round((totalFats / totalWeightFinal) * 100 * 10) / 10,
    saturatedFats: Math.round((totalSaturatedFats / totalWeightFinal) * 100 * 10) / 10, // 🆕 OBLIGATOIRE
    
    // Sel : 2 décimales (Annexe XV INCO)
    salt: Math.round((totalSalt / totalWeightFinal) * 100 * 100) / 100 // 🔧 Corrigé : 2 décimales
  } : {
    energyKj: 0,
    energyKcal: 0,
    proteins: 0,
    carbs: 0,
    sugars: 0,
    fats: 0,
    saturatedFats: 0,
    salt: 0
  };

  // Calculer par portion
  const servings = recipe.servings || 1;
  const weightPerServing = totalWeightFinal > 0 ? Math.round(totalWeightFinal / servings) : 0;
  
  const perServing = {
    weight: weightPerServing,
    energyKj: Math.round((totalCalories / servings) * 4.184), // 🆕 kJ
    energyKcal: Math.round((totalCalories / servings) * 10) / 10,
    proteins: Math.round((totalProteins / servings) * 10) / 10,
    carbs: Math.round((totalCarbs / servings) * 10) / 10,
    sugars: Math.round((totalSugars / servings) * 10) / 10, // 🆕
    fats: Math.round((totalFats / servings) * 10) / 10,
    saturatedFats: Math.round((totalSaturatedFats / servings) * 10) / 10, // 🆕
    salt: Math.round((totalSalt / servings) * 100) / 100 // 🔧 2 décimales
  };

  return {
    per100g,
    perServing,
    totalWeight: totalWeightFinal
  };
};

/**
 * Formate les valeurs nutritionnelles selon la réglementation INCO
 * @param {Object} nutrition - Valeurs nutritionnelles brutes
 * @returns {Object} Valeurs formatées avec unités
 */
export const formatNutritionLabel = (nutrition) => {
  return {
    per100g: {
      energy: `${nutrition.per100g.energyKj} kJ / ${nutrition.per100g.energyKcal} kcal`, // 🔧 INCO
      proteins: `${nutrition.per100g.proteins} g`,
      carbs: `${nutrition.per100g.carbs} g`,
      sugars: `${nutrition.per100g.sugars} g`, // 🆕 dont sucres
      fats: `${nutrition.per100g.fats} g`,
      saturatedFats: `${nutrition.per100g.saturatedFats} g`, // 🆕 dont acides gras saturés
      salt: `${nutrition.per100g.salt} g`
    },
    perServing: {
      weight: `${nutrition.perServing.weight} g`,
      energy: `${nutrition.perServing.energyKj} kJ / ${nutrition.perServing.energyKcal} kcal`,
      proteins: `${nutrition.perServing.proteins} g`,
      carbs: `${nutrition.perServing.carbs} g`,
      sugars: `${nutrition.perServing.sugars} g`,
      fats: `${nutrition.perServing.fats} g`,
      saturatedFats: `${nutrition.perServing.saturatedFats} g`,
      salt: `${nutrition.perServing.salt} g`
    }
  };
};

export default {
  calculateNutrition,
  formatNutritionLabel
};
