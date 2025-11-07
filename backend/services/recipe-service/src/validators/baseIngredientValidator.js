import { z } from 'zod';

// Validation recherche d'ingrédients base
export const searchBaseIngredientsSchema = z.object({
  search: z.string()
    .transform(val => val?.trim() || '') // Trim avant validation
    .refine(val => val.length >= 2, {
      message: 'La recherche doit contenir au moins 2 caractères'
    })
    .refine(val => val.length <= 100, {
      message: 'La recherche ne peut pas dépasser 100 caractères'
    })
});

// Validation ID ingrédient
export const baseIngredientIdSchema = z.object({
  id: z.string().uuid('ID invalide')
});
