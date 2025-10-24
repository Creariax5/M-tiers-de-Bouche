import * as recipeService from '../services/recipe.service.js';

export const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipe = await recipeService.createRecipe(userId, req.body);
    
    return res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de la recette' });
  }
};

export const list = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;

    const result = await recipeService.getRecipes(userId, { page, limit, category });
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error listing recipes:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des recettes' });
  }
};

export const getById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;

    const recipe = await recipeService.getRecipeById(userId, recipeId);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error('Error getting recipe:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération de la recette' });
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;

    const recipe = await recipeService.updateRecipe(userId, recipeId, req.body);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour de la recette' });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;

    const deleted = await recipeService.deleteRecipe(userId, recipeId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    return res.status(200).json({ message: 'Recette supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression de la recette' });
  }
};
