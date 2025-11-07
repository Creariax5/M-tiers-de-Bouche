/**
 * Controllers pour modification/suppression d'ingrédient personnalisé
 * US-025 : PUT/DELETE /ingredients/custom/:id
 */

import { updateCustomIngredient, deleteCustomIngredient } from '../services/updateDeleteCustomIngredientService.js';

/**
 * Met à jour un ingrédient personnalisé
 * @route PUT /ingredients/custom/:id
 */
export async function updateCustomIngredientController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updateData = req.validatedData;

    const result = await updateCustomIngredient(id, updateData, userId);

    if (!result) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    if (result.error === 'forbidden') {
      return res.status(403).json({ error: 'You are not authorized to update this ingredient' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating custom ingredient:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Supprime un ingrédient personnalisé
 * @route DELETE /ingredients/custom/:id
 */
export async function deleteCustomIngredientController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await deleteCustomIngredient(id, userId);

    if (!result) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    if (result.error === 'forbidden') {
      return res.status(403).json({ error: 'You are not authorized to delete this ingredient' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting custom ingredient:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
