import prisma from '../lib/prisma.js';

export const addIngredientToRecipe = async (userId, recipeId, data) => {
  // Vérifier que la recette appartient à l'utilisateur
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId
    }
  });

  if (!recipe) {
    return { error: 'Recette non trouvée', status: 404 };
  }

  // Vérifier que l'ingrédient existe
  const ingredient = await prisma.ingredient.findUnique({
    where: { id: data.ingredientId }
  });

  if (!ingredient) {
    return { error: 'Ingrédient non trouvé', status: 404 };
  }

  // Ajouter l'ingrédient à la recette
  const recipeIngredient = await prisma.recipeIngredient.create({
    data: {
      recipeId,
      ingredientId: data.ingredientId,
      quantity: data.quantity,
      unit: data.unit,
      lossPercent: data.lossPercent || 0
    },
    include: {
      ingredient: true
    }
  });

  return { data: recipeIngredient };
};

export const getRecipeIngredients = async (userId, recipeId) => {
  // Vérifier que la recette appartient à l'utilisateur
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId
    }
  });

  if (!recipe) {
    return { error: 'Recette non trouvée', status: 404 };
  }

  const ingredients = await prisma.recipeIngredient.findMany({
    where: { recipeId },
    include: {
      ingredient: true
    },
    orderBy: { createdAt: 'asc' }
  });

  return { data: ingredients };
};

export const updateRecipeIngredient = async (userId, recipeId, ingredientId, data) => {
  // Vérifier que la recette appartient à l'utilisateur
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId
    }
  });

  if (!recipe) {
    return { error: 'Recette non trouvée', status: 404 };
  }

  // Vérifier que l'ingrédient existe dans la recette
  const recipeIngredient = await prisma.recipeIngredient.findFirst({
    where: {
      id: ingredientId,
      recipeId
    }
  });

  if (!recipeIngredient) {
    return { error: 'Ingrédient non trouvé dans cette recette', status: 404 };
  }

  // Mettre à jour
  const updated = await prisma.recipeIngredient.update({
    where: { id: ingredientId },
    data: {
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.unit && { unit: data.unit }),
      ...(data.lossPercent !== undefined && { lossPercent: data.lossPercent })
    },
    include: {
      ingredient: true
    }
  });

  return { data: updated };
};

export const deleteRecipeIngredient = async (userId, recipeId, ingredientId) => {
  // Vérifier que la recette appartient à l'utilisateur
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId
    }
  });

  if (!recipe) {
    return { error: 'Recette non trouvée', status: 404 };
  }

  // Vérifier que l'ingrédient existe dans la recette
  const recipeIngredient = await prisma.recipeIngredient.findFirst({
    where: {
      id: ingredientId,
      recipeId
    }
  });

  if (!recipeIngredient) {
    return { error: 'Ingrédient non trouvé dans cette recette', status: 404 };
  }

  // Supprimer
  await prisma.recipeIngredient.delete({
    where: { id: ingredientId }
  });

  return { success: true };
};
