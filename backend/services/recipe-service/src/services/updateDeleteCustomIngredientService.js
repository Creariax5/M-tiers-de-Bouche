/**
 * Service pour modification/suppression d'ingrédient personnalisé
 * US-025 : PUT/DELETE /ingredients/custom/:id
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Met à jour un ingrédient personnalisé (partial update)
 * @param {string} id - ID de l'ingrédient
 * @param {Object} updateData - Données validées à mettre à jour
 * @param {string} userId - ID de l'utilisateur authentifié
 * @returns {Promise<Object|null>} Ingrédient mis à jour ou null si non trouvé/non autorisé
 */
export async function updateCustomIngredient(id, updateData, userId) {
  // Vérifier que l'ingrédient existe
  const existingIngredient = await prisma.customIngredient.findUnique({
    where: { id }
  });

  if (!existingIngredient) {
    return null; // Not found
  }

  // Vérifier l'isolation utilisateur
  if (existingIngredient.userId !== userId) {
    return { error: 'forbidden' }; // Not authorized
  }

  // Préparer les données pour Prisma (conversion des types)
  const data = {};
  
  if (updateData.name !== undefined) data.name = updateData.name;
  if (updateData.category !== undefined) data.category = updateData.category;
  if (updateData.price !== undefined) data.price = updateData.price;
  if (updateData.priceUnit !== undefined) data.priceUnit = updateData.priceUnit;
  if (updateData.supplier !== undefined) data.supplier = updateData.supplier;
  if (updateData.lotNumber !== undefined) data.lotNumber = updateData.lotNumber;
  if (updateData.expiryDate !== undefined) {
    data.expiryDate = new Date(updateData.expiryDate);
  }
  
  // Valeurs nutritionnelles
  if (updateData.calories !== undefined) data.calories = updateData.calories;
  if (updateData.proteins !== undefined) data.proteins = updateData.proteins;
  if (updateData.carbs !== undefined) data.carbs = updateData.carbs;
  if (updateData.sugars !== undefined) data.sugars = updateData.sugars;
  if (updateData.fats !== undefined) data.fats = updateData.fats;
  if (updateData.saturatedFats !== undefined) data.saturatedFats = updateData.saturatedFats;
  if (updateData.salt !== undefined) data.salt = updateData.salt;
  
  // Allergènes
  if (updateData.allergens !== undefined) data.allergens = updateData.allergens;

  // Mettre à jour l'ingrédient
  const updatedIngredient = await prisma.customIngredient.update({
    where: { id },
    data
  });

  return updatedIngredient;
}

/**
 * Supprime un ingrédient personnalisé
 * @param {string} id - ID de l'ingrédient
 * @param {string} userId - ID de l'utilisateur authentifié
 * @returns {Promise<Object|null>} { success: true } ou null si non trouvé, { error: 'forbidden' } si non autorisé
 */
export async function deleteCustomIngredient(id, userId) {
  // Vérifier que l'ingrédient existe
  const existingIngredient = await prisma.customIngredient.findUnique({
    where: { id }
  });

  if (!existingIngredient) {
    return null; // Not found
  }

  // Vérifier l'isolation utilisateur
  if (existingIngredient.userId !== userId) {
    return { error: 'forbidden' }; // Not authorized
  }

  // Supprimer l'ingrédient
  await prisma.customIngredient.delete({
    where: { id }
  });

  return { success: true };
}
