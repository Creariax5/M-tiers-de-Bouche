import { searchIngredients } from '../services/ingredientSearchService.js';

/**
 * Recherche unifiée d'ingrédients (base + custom)
 */
export async function searchIngredientsController(req, res) {
  try {
    const { search } = req.query;
    const userId = req.user.userId;

    const results = await searchIngredients(userId, search);

    res.json(results);
  } catch (error) {
    console.error('Error searching ingredients:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
