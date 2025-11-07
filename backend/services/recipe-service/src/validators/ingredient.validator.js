import { z } from 'zod';

const validUnits = ['G', 'KG', 'L', 'ML', 'PIECE'];

export const addIngredientSchema = z.object({
  baseIngredientId: z.string().uuid('ID ingrédient de base invalide').optional(),
  customIngredientId: z.string().uuid('ID ingrédient personnalisé invalide').optional(),
  ingredientId: z.string().uuid('ID ingrédient invalide').optional(), // Rétrocompatibilité
  subRecipeId: z.string().uuid('ID sous-recette invalide').optional(),
  quantity: z.number().positive('La quantité doit être positive'),
  unit: z.enum(validUnits, { errorMap: () => ({ message: 'Unité invalide' }) }),
  lossPercent: z.number().min(0).max(100, 'Le pourcentage de perte doit être entre 0 et 100').default(0)
}).passthrough().refine(
  (data) => {
    // ✅ Exactement l'un des champs doit être présent
    const hasBaseIngredient = !!data.baseIngredientId;
    const hasCustomIngredient = !!data.customIngredientId;
    const hasLegacyIngredient = !!data.ingredientId;
    const hasSubRecipe = !!data.subRecipeId;
    
    const count = [hasBaseIngredient, hasCustomIngredient, hasLegacyIngredient, hasSubRecipe].filter(Boolean).length;
    return count === 1;
  },
  {
    message: 'Vous devez fournir soit baseIngredientId, customIngredientId ou subRecipeId (un seul)'
  }
);

export const updateIngredientSchema = z.object({
  quantity: z.number().positive('La quantité doit être positive').optional(),
  unit: z.enum(validUnits).optional(),
  lossPercent: z.number().min(0).max(100).optional()
}).passthrough();

export const validateAddIngredient = (req, res, next) => {
  try {
    req.body = addIngredientSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

export const validateUpdateIngredient = (req, res, next) => {
  try {
    req.body = updateIngredientSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};
