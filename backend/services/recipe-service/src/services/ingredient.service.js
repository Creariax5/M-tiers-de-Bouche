import prisma from '../lib/prisma.js';
import { canAddSubRecipe } from './circular-dependency.service.js';

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

  // Cas 1 : Ingrédient normal
  if (data.ingredientId || data.baseIngredientId || data.customIngredientId) {
    // TODO: Mettre à jour pour supporter BaseIngredient + CustomIngredient
    // Pour l'instant ce code est obsolète car prisma.ingredient n'existe plus
    /* 
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: data.ingredientId }
    });

    if (!ingredient) {
      return { error: 'Ingrédient non trouvé', status: 404 };
    }
    */

    // Ajouter l'ingrédient à la recette
    const recipeIngredient = await prisma.recipeIngredient.create({
      data: {
        recipeId,
        baseIngredientId: data.baseIngredientId || data.ingredientId,
        customIngredientId: data.customIngredientId,
        quantity: data.quantity,
        unit: data.unit,
        lossPercent: data.lossPercent || 0
      },
      include: {
        baseIngredient: true,
        customIngredient: true
      }
    });

    return { data: recipeIngredient };
  }

  // Cas 2 : Sous-recette 🆕
  if (data.subRecipeId) {
    // Vérifier que la sous-recette existe et appartient au même user
    const subRecipe = await prisma.recipe.findFirst({
      where: {
        id: data.subRecipeId,
        userId
      }
    });

    if (!subRecipe) {
      return { error: 'Sous-recette non trouvée', status: 404 };
    }

    // ✅ Vérifier qu'il n'y a pas de dépendance circulaire
    const isValid = await canAddSubRecipe(recipeId, data.subRecipeId);
    if (!isValid) {
      return {
        error: 'Dépendance circulaire détectée : cette sous-recette ne peut pas être ajoutée',
        status: 400
      };
    }

    // Ajouter la sous-recette comme ingrédient
    const recipeIngredient = await prisma.recipeIngredient.create({
      data: {
        recipeId,
        subRecipeId: data.subRecipeId,
        quantity: data.quantity,
        unit: data.unit,
        lossPercent: data.lossPercent || 0
      },
      include: {
        subRecipe: true
      }
    });

    return { data: recipeIngredient };
  }

  // Ne devrait jamais arriver (validation Zod)
  return { error: 'ingredientId ou subRecipeId requis', status: 400 };
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
      baseIngredient: true,
      customIngredient: true,
      subRecipe: true // 🆕 Inclure les sous-recettes
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
      baseIngredient: true,
      customIngredient: true
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
