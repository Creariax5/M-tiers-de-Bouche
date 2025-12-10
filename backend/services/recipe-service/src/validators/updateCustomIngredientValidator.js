/**
 * Validation Zod pour modification ingrédient personnalisé
 * US-025 : PUT /ingredients/custom/:id
 */

import { z } from 'zod';

// Enum des catégories d'ingrédients (sync avec Prisma)
const IngredientCategoryEnum = z.enum([
  'FARINES',
  'SUCRES',
  'MATIERES_GRASSES',
  'PRODUITS_LAITIERS',
  'OEUFS',
  'CHOCOLAT_CACAO',
  'FRUITS',
  'FRUITS_SECS',
  'EPICES',
  'LEVURES',
  'ADDITIFS',
  'AUTRE'
]);

// Enum des unités (sync avec Prisma)
const UnitEnum = z.enum(['G', 'KG', 'L', 'ML', 'PIECE']);

// Enum des allergènes (liste INCO)
const AllergenEnum = z.enum([
  'GLUTEN',
  'CRUSTACES',
  'OEUFS',
  'POISSONS',
  'ARACHIDES',
  'SOJA',
  'LAIT',
  'FRUITS_A_COQUE',
  'CELERI',
  'MOUTARDE',
  'SESAME',
  'SULFITES',
  'LUPIN',
  'MOLLUSQUES'
]);

// Schema pour modification ingrédient personnalisé (tous champs optionnels)
const updateCustomIngredientSchema = z.object({
  // Tous les champs sont optionnels pour permettre les mises à jour partielles
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must not exceed 200 characters')
    .optional(),
  
  category: IngredientCategoryEnum.optional().nullable(),
  
  price: z.number()
    .min(0, 'Price must be positive or zero')
    .optional()
    .nullable(),
  
  priceUnit: UnitEnum.optional().nullable(),
  
  // Champs optionnels - Fournisseur et traçabilité
  supplier: z.string()
    .max(200, 'Supplier name must not exceed 200 characters')
    .optional()
    .nullable(),
  
  lotNumber: z.string()
    .max(100, 'Lot number must not exceed 100 characters')
    .optional()
    .nullable(),
  
  expiryDate: z.string()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(val),
      'Invalid expiry date format (expected YYYY-MM-DD or ISO 8601)'
    )
    .transform((val) => {
      if (!val) return null;
      // Convert YYYY-MM-DD to ISO 8601 if needed
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        return `${val}T00:00:00.000Z`;
      }
      return val;
    })
    .optional()
    .nullable(),
  
  // Champs optionnels - Valeurs nutritionnelles (pour 100g)
  calories: z.number()
    .min(0, 'Calories must be positive or zero')
    .optional()
    .nullable(),
  
  proteins: z.number()
    .min(0, 'Proteins must be positive or zero')
    .optional()
    .nullable(),
  
  carbs: z.number()
    .min(0, 'Carbs must be positive or zero')
    .optional()
    .nullable(),
  
  sugars: z.number()
    .min(0, 'Sugars must be positive or zero')
    .optional()
    .nullable(),
  
  fats: z.number()
    .min(0, 'Fats must be positive or zero')
    .optional()
    .nullable(),
  
  saturatedFats: z.number()
    .min(0, 'Saturated fats must be positive or zero')
    .optional()
    .nullable(),
  
  salt: z.number()
    .min(0, 'Salt must be positive or zero')
    .optional()
    .nullable(),
  
  // Allergènes (array optionnel)
  allergens: z.array(AllergenEnum).optional().nullable()
});

/**
 * Middleware de validation pour modification ingrédient personnalisé
 */
export function validateUpdateCustomIngredient(req, res, next) {
  console.log('📝 [UPDATE-VALIDATOR] Validating custom ingredient update');
  console.log('📝 [UPDATE-VALIDATOR] Body received:', JSON.stringify(req.body, null, 2));
  
  try {
    const validatedData = updateCustomIngredientSchema.parse(req.body);
    console.log('📝 [UPDATE-VALIDATOR] ✅ Validation passed');
    req.validatedData = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('📝 [UPDATE-VALIDATOR] ❌ Validation error:');
      error.errors.forEach(e => {
        console.log(`   - ${e.path.join('.')}: ${e.message}`);
      });
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    console.log('📝 [UPDATE-VALIDATOR] ❌ Unknown error:', error.message);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}
