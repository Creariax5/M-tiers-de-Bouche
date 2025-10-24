import express from 'express';
import * as recipeController from '../controllers/recipe.controller.js';
import * as ingredientController from '../controllers/ingredient.controller.js';
import * as allergenController from '../controllers/allergen.controller.js';
import * as nutritionController from '../controllers/nutrition.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateCreateRecipe, validateUpdateRecipe } from '../validators/recipe.validator.js';
import { validateAddIngredient, validateUpdateIngredient } from '../validators/ingredient.validator.js';

const router = express.Router();

// Recipe routes
router.post('/recipes', authenticateToken, validateCreateRecipe, recipeController.create);
router.get('/recipes', authenticateToken, recipeController.list);
router.get('/recipes/:id', authenticateToken, recipeController.getById);
router.put('/recipes/:id', authenticateToken, validateUpdateRecipe, recipeController.update);
router.delete('/recipes/:id', authenticateToken, recipeController.remove);

// Ingredient routes
router.post('/recipes/:id/ingredients', authenticateToken, validateAddIngredient, ingredientController.addIngredient);
router.get('/recipes/:id/ingredients', authenticateToken, ingredientController.listIngredients);
router.put('/recipes/:id/ingredients/:ingredientId', authenticateToken, validateUpdateIngredient, ingredientController.updateIngredient);
router.delete('/recipes/:id/ingredients/:ingredientId', authenticateToken, ingredientController.removeIngredient);

// Allergen routes
router.get('/recipes/:id/allergens', authenticateToken, allergenController.getRecipeAllergens);

// Nutrition routes
router.get('/recipes/:id/nutrition', authenticateToken, nutritionController.getRecipeNutrition);

export default router;
