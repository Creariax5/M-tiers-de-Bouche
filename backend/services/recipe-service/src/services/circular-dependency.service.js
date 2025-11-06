import prisma from '../lib/prisma.js';

/**
 * Détecte les dépendances circulaires dans les sous-recettes
 * Utilise un algorithme de parcours en profondeur (DFS) avec mémorisation
 * 
 * @param {string} targetRecipeId - ID de la recette à ajouter comme sous-recette
 * @param {string} currentRecipeId - ID de la recette actuelle
 * @param {Set<string>} visited - Set des IDs déjà visités (pour détecter les boucles)
 * @returns {Promise<boolean>} true si boucle détectée, false sinon
 */
export const detectCircularDependency = async (targetRecipeId, currentRecipeId, visited = new Set()) => {
  // Cas de base : si on revient sur une recette déjà visitée → boucle !
  if (visited.has(currentRecipeId)) {
    return true;
  }

  // Cas de base : si target = current → boucle directe
  if (targetRecipeId === currentRecipeId) {
    return true;
  }

  // Ajouter current au Set
  visited.add(currentRecipeId);

  // Récupérer toutes les sous-recettes utilisées par currentRecipe
  const ingredients = await prisma.recipeIngredient.findMany({
    where: {
      recipeId: currentRecipeId,
      subRecipeId: { not: null }
    },
    select: {
      subRecipeId: true
    }
  });

  // Parcourir récursivement chaque sous-recette
  for (const ingredient of ingredients) {
    if (ingredient.subRecipeId) {
      // Si la sous-recette = target → boucle indirecte
      if (ingredient.subRecipeId === targetRecipeId) {
        return true;
      }

      // Continuer récursivement avec une copie du Set
      const hasLoop = await detectCircularDependency(
        targetRecipeId,
        ingredient.subRecipeId,
        new Set(visited)
      );

      if (hasLoop) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Vérifie si on peut ajouter une sous-recette sans créer de boucle
 * @param {string} recipeId - ID de la recette parente
 * @param {string} subRecipeId - ID de la sous-recette à ajouter
 * @returns {Promise<boolean>} true si OK (pas de boucle), false sinon
 */
export const canAddSubRecipe = async (recipeId, subRecipeId) => {
  const hasLoop = await detectCircularDependency(recipeId, subRecipeId);
  return !hasLoop;
};

export default {
  detectCircularDependency,
  canAddSubRecipe
};
