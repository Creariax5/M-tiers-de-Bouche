import { z } from 'zod';

// Validation recherche d'ingrédients base
export const searchBaseIngredientsSchema = z.object({
  search: z.string()
    .min(2, 'La recherche doit contenir au moins 2 caractères')
    .max(100, 'La recherche ne peut pas dépasser 100 caractères')
    .transform(val => val?.trim() || '') // Trim après validation pour éviter les problèmes Unicode
});

// Validation ID ingrédient
export const baseIngredientIdSchema = z.object({
  id: z.string().uuid('ID invalide')
});
