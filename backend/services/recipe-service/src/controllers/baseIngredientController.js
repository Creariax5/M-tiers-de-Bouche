import * as baseIngredientService from '../services/baseIngredientService.js';

/**
 * GET /ingredients/base?search=terme
 * Rechercher des ingrédients de base
 */
export const searchBaseIngredients = async (req, res, next) => {
  try {
    const { search } = req.query;
    
    const ingredients = await baseIngredientService.searchBaseIngredients(search);
    
    res.status(200).json(ingredients);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /ingredients/base/:id
 * Récupérer les détails d'un ingrédient de base
 */
export const getBaseIngredientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const ingredient = await baseIngredientService.getBaseIngredientById(id);
    
    if (!ingredient) {
      return res.status(404).json({ 
        error: 'Ingrédient non trouvé' 
      });
    }
    
    res.status(200).json(ingredient);
  } catch (error) {
    next(error);
  }
};
