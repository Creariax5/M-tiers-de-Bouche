import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Récupère les détails d'un ingrédient (base ou custom)
 * Si custom, vérifie que userId correspond
 */
export async function getIngredientById(id, userId) {
  // Chercher d'abord dans base_ingredients
  const baseIngredient = await prisma.baseIngredient.findUnique({
    where: { id }
  });

  if (baseIngredient) {
    return {
      id: baseIngredient.id,
      ciqualCode: baseIngredient.ciqualCode,
      name: baseIngredient.name,
      category: baseIngredient.category,
      calories: baseIngredient.calories,
      proteins: baseIngredient.proteins,
      carbs: baseIngredient.carbs,
      fats: baseIngredient.fats,
      salt: baseIngredient.salt,
      sugars: baseIngredient.sugars,
      saturatedFats: baseIngredient.saturatedFats,
      fiber: baseIngredient.fiber,
      allergens: baseIngredient.allergens || [],
      type: 'base'
    };
  }

  // Sinon chercher dans custom_ingredients
  const customIngredient = await prisma.customIngredient.findUnique({
    where: { id }
  });

  if (customIngredient) {
    // Vérifier que c'est bien l'utilisateur propriétaire
    if (customIngredient.userId !== userId) {
      return null; // 404 pour les ingredients d'autres users
    }

    return {
      id: customIngredient.id,
      name: customIngredient.name,
      category: customIngredient.category,
      price: customIngredient.price,
      priceUnit: customIngredient.priceUnit,
      supplier: customIngredient.supplier,
      lotNumber: customIngredient.lotNumber,
      expiryDate: customIngredient.expiryDate,
      calories: customIngredient.calories,
      proteins: customIngredient.proteins,
      carbs: customIngredient.carbs,
      fats: customIngredient.fats,
      salt: customIngredient.salt,
      sugars: customIngredient.sugars,
      saturatedFats: customIngredient.saturatedFats,
      allergens: customIngredient.allergens || [],
      type: 'custom'
    };
  }

  // Ingrédient non trouvé
  return null;
}
