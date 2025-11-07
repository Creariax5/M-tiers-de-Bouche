import { getIngredientById } from '../services/ingredientDetailService.js';

/**
 * Récupère les détails d'un ingrédient par ID
 */
export async function getIngredientDetailController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const ingredient = await getIngredientById(id, userId);

    if (!ingredient) {
      return res.status(404).json({ 
        error: 'Ingredient not found' 
      });
    }

    res.json(ingredient);
  } catch (error) {
    console.error('Error fetching ingredient details:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
