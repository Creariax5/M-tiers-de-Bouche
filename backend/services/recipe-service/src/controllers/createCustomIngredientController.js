/**
 * Controller pour création d'ingrédient personnalisé
 * US-024 : POST /ingredients/custom
 */

import { createCustomIngredient } from '../services/createCustomIngredientService.js';

/**
 * Crée un nouvel ingrédient personnalisé
 * @route POST /ingredients/custom
 */
export async function createCustomIngredientController(req, res) {
  try {
    const userId = req.user.userId;
    const ingredientData = req.validatedData;

    const createdIngredient = await createCustomIngredient(ingredientData, userId);

    res.status(201).json(createdIngredient);
  } catch (error) {
    console.error('Error creating custom ingredient:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
