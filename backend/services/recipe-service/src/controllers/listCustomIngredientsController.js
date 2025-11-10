import { listCustomIngredientsService } from '../services/listCustomIngredientsService.js';

/**
 * Récupère la liste des ingrédients personnalisés d'un utilisateur
 * @route GET /ingredients/custom
 * @access Private (JWT required)
 */
export const listCustomIngredientsController = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const ingredients = await listCustomIngredientsService(userId);

    res.json(ingredients);
  } catch (error) {
    next(error);
  }
};
