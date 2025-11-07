import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateSearchQuery } from '../validators/searchIngredientsValidator.js';
import { validateIngredientId } from '../validators/ingredientIdValidator.js';
import { searchIngredientsController } from '../controllers/ingredientSearchController.js';
import { getIngredientDetailController } from '../controllers/ingredientDetailController.js';

const router = express.Router();

/**
 * GET /ingredients?search=terme
 * Recherche unifiée dans les ingrédients de base et personnalisés
 */
router.get('/', authenticateToken, validateSearchQuery, searchIngredientsController);

/**
 * GET /ingredients/:id
 * Détails d'un ingrédient (base ou custom)
 */
router.get('/:id', authenticateToken, validateIngredientId, getIngredientDetailController);

export default router;
