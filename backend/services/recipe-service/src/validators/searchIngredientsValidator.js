import { z } from 'zod';

const searchQuerySchema = z.object({
  search: z
    .string()
    .min(2, 'La requête de recherche doit contenir au moins 2 caractères')
    .max(100, 'La requête de recherche ne doit pas dépasser 100 caractères')
    .trim()
});

export const validateSearchQuery = (req, res, next) => {
  try {
    searchQuerySchema.parse(req.query);
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
