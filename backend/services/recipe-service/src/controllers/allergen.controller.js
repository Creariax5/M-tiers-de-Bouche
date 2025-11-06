import { detectAllergens } from '../services/allergen.service.js';
import prisma from '../lib/prisma.js';

/**
 * GET /recipes/:id/allergens
 * Récupère la liste des allergènes d'une recette
 */
export const getRecipeAllergens = async (req, res) => {
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

    // Détecter les allergènes
    const allergens = await detectAllergens(id);

    res.json({ allergens });
  } catch (error) {
    console.error('Error getting recipe allergens:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export default {
  getRecipeAllergens
};
