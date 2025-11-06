import { calculateNutrition } from '../services/nutrition.service.js';
import prisma from '../lib/prisma.js';

/**
 * GET /recipes/:id/nutrition
 * Récupère les valeurs nutritionnelles d'une recette
 */
export const getRecipeNutrition = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Vérifier que la recette existe et appartient à l'utilisateur
    const recipe = await prisma.recipe.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    // Calculer les valeurs nutritionnelles
    const nutrition = await calculateNutrition(id);

    res.json({ nutrition });
  } catch (error) {
    console.error('Error getting recipe nutrition:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export default {
  getRecipeNutrition
};
