import { calculatePricing } from '../services/pricing.service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /recipes/:id/pricing
 * Récupère le pricing d'une recette
 */
export async function getPricing(req, res) {
  try {
    const { id } = req.params;
    const { coefficient } = req.query;
    const userId = req.user.userId;

    // Vérifier que la recette appartient à l'utilisateur
    const recipe = await prisma.recipe.findFirst({
      where: { id, userId },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Calculer le pricing
    const coeff = coefficient ? parseFloat(coefficient) : 3;
    const pricing = await calculatePricing(id, coeff);

    res.json({ pricing });
  } catch (error) {
    console.error('Error calculating pricing:', error);
    res.status(500).json({ error: 'Failed to calculate pricing' });
  }
}
