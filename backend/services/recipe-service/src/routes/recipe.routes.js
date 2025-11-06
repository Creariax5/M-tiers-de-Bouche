import express from 'express';
import * as recipeController from '../controllers/recipe.controller.js';
import * as ingredientController from '../controllers/ingredient.controller.js';
import * as allergenController from '../controllers/allergen.controller.js';
import * as nutritionController from '../controllers/nutrition.controller.js';
import * as pricingController from '../controllers/pricing.controller.js';
import * as statsController from '../controllers/stats.controller.js';
import * as imageController from '../controllers/image.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateCreateRecipe, validateUpdateRecipe } from '../validators/recipe.validator.js';
import { validateAddIngredient, validateUpdateIngredient } from '../validators/ingredient.validator.js';

const router = express.Router();

// Stats routes (doit être avant /:id pour éviter conflit)
router.get('/stats', authenticateToken, statsController.getStats);

// Recipe routes
router.post('/', authenticateToken, validateCreateRecipe, recipeController.create);
router.get('/', authenticateToken, recipeController.list);
router.get('/:id', authenticateToken, recipeController.getById);
router.put('/:id', authenticateToken, validateUpdateRecipe, recipeController.update);
router.delete('/:id', authenticateToken, recipeController.remove);

// Ingredient routes
router.post('/:id/ingredients', authenticateToken, validateAddIngredient, ingredientController.addIngredient);
router.get('/:id/ingredients', authenticateToken, ingredientController.listIngredients);
router.put('/:id/ingredients/:ingredientId', authenticateToken, validateUpdateIngredient, ingredientController.updateIngredient);
router.delete('/:id/ingredients/:ingredientId', authenticateToken, ingredientController.removeIngredient);

// Allergen routes
router.get('/:id/allergens', authenticateToken, allergenController.getRecipeAllergens);

// Nutrition routes
router.get('/:id/nutrition', authenticateToken, nutritionController.getRecipeNutrition);

// Pricing routes
router.get('/:id/pricing', authenticateToken, pricingController.getPricing);

// Image upload routes
router.post('/:id/image', authenticateToken, imageController.uploadMiddleware, imageController.uploadImage);

export default router;
