import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Liste tous les ingrédients personnalisés d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des ingrédients personnalisés triés par nom
 */
export const listCustomIngredientsService = async (userId) => {
  return await prisma.customIngredient.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: 'asc',
    },
  });
};
