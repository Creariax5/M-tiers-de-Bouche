import express from 'express';
import * as recipeController from '../controllers/recipe.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateCreateRecipe, validateUpdateRecipe } from '../validators/recipe.validator.js';

const router = express.Router();

router.post('/recipes', authenticateToken, validateCreateRecipe, recipeController.create);
router.get('/recipes', authenticateToken, recipeController.list);
router.get('/recipes/:id', authenticateToken, recipeController.getById);
router.put('/recipes/:id', authenticateToken, validateUpdateRecipe, recipeController.update);
router.delete('/recipes/:id', authenticateToken, recipeController.remove);

export default router;
