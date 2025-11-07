/**
 * Service pour création d'ingrédient personnalisé
 * US-024 : POST /ingredients/custom
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Crée un nouvel ingrédient personnalisé
 * @param {Object} ingredientData - Données validées de l'ingrédient
 * @param {string} userId - ID de l'utilisateur authentifié
 * @returns {Promise<Object>} Ingrédient créé avec tous ses champs
 */
export async function createCustomIngredient(ingredientData, userId) {
  // Préparer les données pour Prisma
  const data = {
    userId,
    name: ingredientData.name,
    category: ingredientData.category,
    price: ingredientData.price,
    priceUnit: ingredientData.priceUnit,
    
    // Champs optionnels - Fournisseur et traçabilité
    supplier: ingredientData.supplier || null,
    lotNumber: ingredientData.lotNumber || null,
    expiryDate: ingredientData.expiryDate ? new Date(ingredientData.expiryDate) : null,
    
    // Valeurs nutritionnelles optionnelles
    calories: ingredientData.calories ?? null,
    proteins: ingredientData.proteins ?? null,
    carbs: ingredientData.carbs ?? null,
    sugars: ingredientData.sugars ?? null,
    fats: ingredientData.fats ?? null,
    saturatedFats: ingredientData.saturatedFats ?? null,
    salt: ingredientData.salt ?? null,
    
    // Allergènes (array ou vide)
    allergens: ingredientData.allergens || []
  };

  // Créer l'ingrédient en DB
  const createdIngredient = await prisma.customIngredient.create({
    data
  });

  return createdIngredient;
}
