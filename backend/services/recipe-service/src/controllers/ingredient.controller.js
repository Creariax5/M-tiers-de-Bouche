import * as ingredientService from '../services/ingredient.service.js';

export const addIngredient = async (req, res) => {
  try {
    console.log('🍳 [ADD-INGREDIENT] Entrée dans addIngredient');
    console.log('🍳 [ADD-INGREDIENT] req.body:', JSON.stringify(req.body));
    console.log('🍳 [ADD-INGREDIENT] req.params:', JSON.stringify(req.params));
    
    const userId = req.user.userId;
    const recipeId = req.params.id;

    const result = await ingredientService.addIngredientToRecipe(userId, recipeId, req.body);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(201).json(result.data);
  } catch (error) {
    console.error('Error adding ingredient:', error);
    return res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'ingrédient' });
  }
};

export const listIngredients = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;

    const result = await ingredientService.getRecipeIngredients(userId, recipeId);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error listing ingredients:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des ingrédients' });
  }
};

export const updateIngredient = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;
    const ingredientId = req.params.ingredientId;

    const result = await ingredientService.updateRecipeIngredient(userId, recipeId, ingredientId, req.body);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'ingrédient' });
  }
};

export const removeIngredient = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;
    const ingredientId = req.params.ingredientId;

    const result = await ingredientService.deleteRecipeIngredient(userId, recipeId, ingredientId);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json({ message: 'Ingrédient supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression de l\'ingrédient' });
  }
};
