import { z } from 'zod';

export const createRecipeSchema = z.object({
  name: z.string().min(1, 'Le nom est obligatoire'),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  servings: z.number().int().positive('Les portions doivent être un nombre positif').default(1)
}).passthrough();

export const updateRecipeSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  servings: z.number().int().positive('Les portions doivent être un nombre positif').optional()
}).passthrough();

export const validateCreateRecipe = (req, res, next) => {
  try {
    req.body = createRecipeSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

export const validateUpdateRecipe = (req, res, next) => {
  try {
    req.body = updateRecipeSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};
