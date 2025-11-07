import express from 'express';
import * as baseIngredientController from '../controllers/baseIngredientController.js';
import { validateQuery, validateParams } from '../middleware/validator.js';
import { searchBaseIngredientsSchema, baseIngredientIdSchema } from '../validators/baseIngredientValidator.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/**
 * GET /ingredients/base?search=terme
 * Rechercher des ingrédients de base
 */
router.get(
  '/',
  validateQuery(searchBaseIngredientsSchema),
  baseIngredientController.searchBaseIngredients
);

/**
 * GET /ingredients/base/:id
 * Récupérer les détails d'un ingrédient de base
 */
router.get(
  '/:id',
  validateParams(baseIngredientIdSchema),
  baseIngredientController.getBaseIngredientById
);

export default router;
