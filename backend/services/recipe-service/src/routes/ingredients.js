import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateSearchQuery } from '../validators/searchIngredientsValidator.js';
import { searchIngredientsController } from '../controllers/ingredientSearchController.js';

const router = express.Router();

/**
 * GET /ingredients?search=terme
 * Recherche unifiée dans les ingrédients de base et personnalisés
 */
router.get('/', authenticateToken, validateSearchQuery, searchIngredientsController);

export default router;
