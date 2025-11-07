import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Recherche dans les ingrédients de base Ciqual avec full-text search PostgreSQL
 */
export async function searchBaseIngredients(searchQuery) {
  const results = await prisma.$queryRaw`
    SELECT 
      id,
      "ciqualCode",
      name,
      category::text,
      calories,
      proteins,
      carbs,
      fats,
      salt,
      allergens,
      ts_rank(
        to_tsvector('french', name || ' ' || COALESCE(category::text, '')),
        plainto_tsquery('french', ${searchQuery})
      ) AS rank
    FROM base_ingredients
    WHERE 
      to_tsvector('french', name || ' ' || COALESCE(category::text, '')) 
      @@ plainto_tsquery('french', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `;

  return results.map(ingredient => ({
    id: ingredient.id,
    ciqualCode: ingredient.ciqualCode,
    name: ingredient.name,
    category: ingredient.category,
    calories: parseFloat(ingredient.calories),
    proteins: parseFloat(ingredient.proteins),
    carbs: parseFloat(ingredient.carbs),
    fats: parseFloat(ingredient.fats),
    salt: parseFloat(ingredient.salt),
    allergens: ingredient.allergens || [],
    type: 'base',
    // supplier et price ne sont PAS envoyés pour les base ingredients (undefined)
    rank: parseFloat(ingredient.rank)
  }));
}

/**
 * Recherche dans les ingrédients personnalisés de l'utilisateur avec full-text search
 */
export async function searchCustomIngredients(userId, searchQuery) {
  const results = await prisma.$queryRaw`
    SELECT 
      id,
      name,
      category::text,
      price,
      "priceUnit",
      supplier,
      "lotNumber",
      "expiryDate",
      calories,
      proteins,
      carbs,
      fats,
      salt,
      allergens,
      ts_rank(
        to_tsvector('french', name || ' ' || COALESCE(category::text, '') || ' ' || COALESCE(supplier, '')),
        plainto_tsquery('french', ${searchQuery})
      ) AS rank
    FROM custom_ingredients
    WHERE 
      "userId" = ${userId}
      AND to_tsvector('french', name || ' ' || COALESCE(category::text, '') || ' ' || COALESCE(supplier, '')) 
      @@ plainto_tsquery('french', ${searchQuery})
    ORDER BY rank DESC
    LIMIT 20
  `;

  return results.map(ingredient => ({
    id: ingredient.id,
    name: ingredient.name,
    category: ingredient.category,
    price: parseFloat(ingredient.price),
    priceUnit: ingredient.priceUnit,
    supplier: ingredient.supplier,
    lotNumber: ingredient.lotNumber,
    expiryDate: ingredient.expiryDate,
    calories: ingredient.calories ? parseFloat(ingredient.calories) : null,
    proteins: ingredient.proteins ? parseFloat(ingredient.proteins) : null,
    carbs: ingredient.carbs ? parseFloat(ingredient.carbs) : null,
    fats: ingredient.fats ? parseFloat(ingredient.fats) : null,
    salt: ingredient.salt ? parseFloat(ingredient.salt) : null,
    allergens: ingredient.allergens || [],
    type: 'custom',
    rank: parseFloat(ingredient.rank)
  }));
}

/**
 * Fusionne et trie les résultats de base et personnalisés par pertinence
 */
export function mergeAndSort(baseResults, customResults) {
  const merged = [...baseResults, ...customResults];
  
  // Tri par rang de pertinence (ts_rank) décroissant
  merged.sort((a, b) => b.rank - a.rank);
  
  // Limite à 20 résultats
  const limited = merged.slice(0, 20);
  
  // Supprime le champ rank avant de retourner
  return limited.map(({ rank, ...ingredient }) => ingredient);
}

/**
 * Recherche unifiée dans les ingrédients de base et personnalisés
 */
export async function searchIngredients(userId, searchQuery) {
  const [baseResults, customResults] = await Promise.all([
    searchBaseIngredients(searchQuery),
    searchCustomIngredients(userId, searchQuery)
  ]);

  return mergeAndSort(baseResults, customResults);
}
