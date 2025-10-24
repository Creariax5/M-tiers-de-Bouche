import prisma from '../lib/prisma.js';

/**
 * Calcule les valeurs nutritionnelles d'une recette
 * @param {string} recipeId - ID de la recette
 * @returns {Promise<Object>} Valeurs nutritionnelles (per100g, perServing, totalWeight)
 */
export const calculateNutrition = async (recipeId) => {
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
              fats: true,
              salt: true
            }
          }
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
  let totalFats = 0;
  let totalSalt = 0;
  let totalWeightInitial = 0;
  let totalWeightFinal = 0;

  // Parcourir chaque ingrédient
  for (const ri of recipe.ingredients) {
    const quantity = ri.quantity;
    const lossPercent = ri.lossPercent || 0;
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
    totalFats += (ing.fats || 0) * factor;
    totalSalt += (ing.salt || 0) * factor;
  }

  // Arrondir le poids final
  totalWeightFinal = Math.round(totalWeightFinal);

  // Calculer pour 100g (basé sur poids FINAL)
  const per100g = totalWeightFinal > 0 ? {
    calories: Math.round((totalCalories / totalWeightFinal) * 100 * 10) / 10,
    proteins: Math.round((totalProteins / totalWeightFinal) * 100 * 10) / 10,
    carbs: Math.round((totalCarbs / totalWeightFinal) * 100 * 10) / 10,
    fats: Math.round((totalFats / totalWeightFinal) * 100 * 10) / 10,
    salt: Math.round((totalSalt / totalWeightFinal) * 100 * 10) / 10
  } : {
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
    salt: 0
  };

  // Calculer par portion
  const servings = recipe.servings || 1;
  const weightPerServing = totalWeightFinal > 0 ? Math.round(totalWeightFinal / servings) : 0;
  
  const perServing = {
    weight: weightPerServing,
    calories: Math.round((totalCalories / servings) * 10) / 10,
    proteins: Math.round((totalProteins / servings) * 10) / 10,
    carbs: Math.round((totalCarbs / servings) * 10) / 10,
    fats: Math.round((totalFats / servings) * 10) / 10,
    salt: Math.round((totalSalt / servings) * 10) / 10
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
      energy: `${nutrition.per100g.calories} kcal`,
      proteins: `${nutrition.per100g.proteins} g`,
      carbs: `${nutrition.per100g.carbs} g`,
      fats: `${nutrition.per100g.fats} g`,
      salt: `${nutrition.per100g.salt} g`
    },
    perServing: {
      weight: `${nutrition.perServing.weight} g`,
      energy: `${nutrition.perServing.calories} kcal`,
      proteins: `${nutrition.perServing.proteins} g`,
      carbs: `${nutrition.perServing.carbs} g`,
      fats: `${nutrition.perServing.fats} g`,
      salt: `${nutrition.perServing.salt} g`
    }
  };
};

export default {
  calculateNutrition,
  formatNutritionLabel
};
