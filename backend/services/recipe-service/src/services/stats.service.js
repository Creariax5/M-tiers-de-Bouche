import prisma from '../lib/prisma.js';
import { calculatePricing } from './pricing.service.js';

export const getUserStats = async (userId) => {
  const totalRecipes = await prisma.recipe.count({
    where: { userId }
  });

  const recipes = await prisma.recipe.findMany({
    where: { userId },
    include: {
      ingredients: {
        include: {
          baseIngredient: true,
          customIngredient: true,
          subRecipe: true
        }
      }
    }
  });

  const recipesWithPricing = await Promise.all(
    recipes.map(async (recipe) => {
      const pricing = await calculatePricing(recipe.id);
      return {
        id: recipe.id,
        name: recipe.name,
        totalCost: pricing.totalCost,
        suggestedPrice: pricing.suggestedPrice,
        margin: pricing.marginPercent
      };
    })
  );

  const topProfitable = recipesWithPricing
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  return {
    totalRecipes,
    topProfitable
  };
};
