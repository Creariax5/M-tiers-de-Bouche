import { z } from 'zod';

const validUnits = ['g', 'kg', 'L', 'ml', 'pièce', 'cl', 'mg'];

export const addIngredientSchema = z.object({
  ingredientId: z.string().uuid('ID ingrédient invalide'),
  quantity: z.number().positive('La quantité doit être positive'),
  unit: z.enum(validUnits, { errorMap: () => ({ message: 'Unité invalide' }) }),
  lossPercent: z.number().min(0).max(100, 'Le pourcentage de perte doit être entre 0 et 100').default(0)
}).passthrough();

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
