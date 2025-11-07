import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateSearchQuery } from '../validators/searchIngredientsValidator.js';
import { validateIngredientId } from '../validators/ingredientIdValidator.js';
import { validateCreateCustomIngredient } from '../validators/createCustomIngredientValidator.js';
import { searchIngredientsController } from '../controllers/ingredientSearchController.js';
import { getIngredientDetailController } from '../controllers/ingredientDetailController.js';
import { createCustomIngredientController } from '../controllers/createCustomIngredientController.js';

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

/**
 * POST /ingredients/custom
 * Création d'un ingrédient personnalisé
 */
router.post('/custom', authenticateToken, validateCreateCustomIngredient, createCustomIngredientController);

export default router;
