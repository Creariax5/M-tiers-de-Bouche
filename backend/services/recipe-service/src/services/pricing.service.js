import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calcule le coût de revient d'une recette (RÉCURSIF)
 * @param {string} recipeId - ID de la recette
 * @param {number} coefficient - Coefficient multiplicateur pour le prix suggéré (défaut: 3)
 * @param {Set<string>} visited - Set des recettes visitées (protection boucle)
 * @returns {Promise<Object>} Pricing data
 */
export async function calculatePricing(recipeId, coefficient = 3, visited = new Set()) {
  // Protection anti-boucle
  if (visited.has(recipeId)) {
    return { totalCost: 0, costPerServing: 0, suggestedPrice: 0, marginPercent: 0 };
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
              pricePerUnit: true,
            },
          },
          subRecipe: true, // 🆕 Sous-recettes
        },
      },
    },
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Calculer le coût total
  let totalCost = 0;

  for (const recipeIngredient of recipe.ingredients) {
    const { quantity, lossPercent } = recipeIngredient;

    // Cas 1 : Ingrédient normal
    if (recipeIngredient.ingredient) {
      const { pricePerUnit } = recipeIngredient.ingredient;

      // Coût = quantité * prix * (1 + perte%)
      const costWithLoss = quantity * pricePerUnit * (1 + lossPercent / 100);
      totalCost += costWithLoss;
    }

    // Cas 2 : Sous-recette 🆕 (récursif)
    if (recipeIngredient.subRecipe) {
      // Calculer coût de la sous-recette
      const subPricing = await calculatePricing(
        recipeIngredient.subRecipe.id,
        coefficient,
        new Set(visited)
      );

      // Facteur : quantité utilisée / totalCost sous-recette (proportionnel)
      // Note: ici on utilise directement le coût total de la sous-recette
      const costWithLoss = subPricing.totalCost * (1 + lossPercent / 100);
      totalCost += costWithLoss;
    }
  }

  // Calculer coût par portion
  const costPerServing = recipe.servings > 0 ? totalCost / recipe.servings : 0;

  // Calculer prix suggéré avec coefficient
  const suggestedPrice = totalCost * coefficient;

  // Calculer marge en %
  // Marge = ((Prix vente - Coût) / Prix vente) * 100
  const marginPercent = suggestedPrice > 0 
    ? ((suggestedPrice - totalCost) / suggestedPrice) * 100 
    : 0;

  return {
    totalCost: Math.round(totalCost * 100) / 100, // Arrondi 2 décimales
    costPerServing: Math.round(costPerServing * 100) / 100,
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    marginPercent: Math.round(marginPercent * 100) / 100,
  };
}
