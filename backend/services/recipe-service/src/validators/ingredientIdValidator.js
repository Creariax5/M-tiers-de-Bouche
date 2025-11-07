import { z } from 'zod';

const ingredientIdSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID')
});

export const validateIngredientId = (req, res, next) => {
  try {
    ingredientIdSchema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
