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

  // Cas 1 : BaseIngredient (ingrédient système Ciqual)
  if (data.baseIngredientId || data.ingredientId) {
    const ingredientId = data.baseIngredientId || data.ingredientId;
    
    // Vérifier que le BaseIngredient existe
    const baseIngredient = await prisma.baseIngredient.findUnique({
      where: { id: ingredientId }
    });

    if (!baseIngredient) {
      return { error: 'Ingrédient de base non trouvé', status: 404 };
    }

    // Ajouter à la recette
    const recipeIngredient = await prisma.recipeIngredient.create({
      data: {
        recipeId,
        baseIngredientId: ingredientId,
        quantity: data.quantity,
        unit: data.unit,
        lossPercent: data.lossPercent || 0
      },
      include: {
        baseIngredient: true
      }
    });

    return { data: recipeIngredient };
  }

  // Cas 2 : CustomIngredient (ingrédient personnalisé utilisateur)
  if (data.customIngredientId) {
    // Vérifier que le CustomIngredient existe ET appartient à l'utilisateur
    const customIngredient = await prisma.customIngredient.findFirst({
      where: {
        id: data.customIngredientId,
        userId
      }
    });

    if (!customIngredient) {
      return { error: 'Ingrédient personnalisé non trouvé', status: 404 };
    }

    // Ajouter à la recette
    const recipeIngredient = await prisma.recipeIngredient.create({
      data: {
        recipeId,
        customIngredientId: data.customIngredientId,
        quantity: data.quantity,
        unit: data.unit,
        lossPercent: data.lossPercent || 0
      },
      include: {
        customIngredient: true
      }
    });

    return { data: recipeIngredient };
  }

  // Cas 3 : Sous-recette 🆕
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
  return { error: 'baseIngredientId, customIngredientId ou subRecipeId requis', status: 400 };
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
