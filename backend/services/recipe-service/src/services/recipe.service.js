import prisma from '../lib/prisma.js';
import { detectAllergens } from './allergen.service.js';
import { calculateNutrition } from './nutrition.service.js';

export const createRecipe = async (userId, data) => {
  return await prisma.recipe.create({
    data: {
      userId,
      name: data.name,
      description: data.description || null,
      category: data.category || null,
      servings: data.servings || 1
    }
  });
};

export const getRecipes = async (userId, { page = 1, limit = 20, category } = {}) => {
  const skip = (page - 1) * limit;
  
  const where = {
    userId
  };

  if (category) {
    where.category = category;
  }

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.recipe.count({ where })
  ]);

  return {
    recipes,
    total,
    page,
    limit
  };
};

export const getRecipeById = async (userId, recipeId) => {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId
    },
    include: {
      ingredients: {
        include: {
          baseIngredient: true,
          customIngredient: true,
          subRecipe: true // 🆕 Inclure sous-recettes
        }
      }
    }
  });

  if (!recipe) {
    return null;
  }

  // Ajouter les allergènes détectés (récursif)
  const allergens = await detectAllergens(recipeId);
  
  // Ajouter les valeurs nutritionnelles (récursif)
  const nutrition = await calculateNutrition(recipeId);
  
  return {
    ...recipe,
    allergens,
    nutrition
  };
};

export const updateRecipe = async (userId, recipeId, data) => {
  const recipe = await getRecipeById(userId, recipeId);
  
  if (!recipe) {
    return null;
  }

  return await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.servings && { servings: data.servings })
    }
  });
};

export const deleteRecipe = async (userId, recipeId) => {
  const recipe = await getRecipeById(userId, recipeId);
  
  if (!recipe) {
    return null;
  }

  await prisma.recipe.delete({
    where: { id: recipeId }
  });

  return true;
};
