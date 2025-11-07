import prisma from '../lib/prisma.js';

/**
 * Rechercher des ingrédients de base avec full-text search
 * @param {string} searchQuery - Terme de recherche (min 2 caractères)
 * @returns {Promise<Array>} Liste d'ingrédients (max 20)
 */
export const searchBaseIngredients = async (searchQuery) => {
  // Nettoyer la requête pour PostgreSQL full-text search
  // Remplacer les caractères spéciaux qui posent problème
  const cleanQuery = searchQuery
    .trim()
    .toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ') // Remplacer caractères spéciaux par espaces
    .trim();
  
  // Si la requête est vide après nettoyage, retourner tableau vide
  if (!cleanQuery) {
    return [];
  }
  
  // Utiliser PostgreSQL full-text search avec ts_rank pour pertinence
  const results = await prisma.$queryRaw`
    SELECT 
      id, name, category, 
      calories, proteins, carbs, fats, salt,
      sugars, "saturatedFats", fiber,
      allergens, "ciqualCode",
      ts_rank(to_tsvector('french', name), to_tsquery('french', ${cleanQuery})) as relevance
    FROM base_ingredients
    WHERE to_tsvector('french', name) @@ to_tsquery('french', ${cleanQuery})
    ORDER BY relevance DESC, name ASC
    LIMIT 20
  `;
  
  return results;
};

/**
 * Récupérer un ingrédient de base par son ID
 * @param {string} id - UUID de l'ingrédient
 * @returns {Promise<Object|null>} Ingrédient ou null
 */
export const getBaseIngredientById = async (id) => {
  return prisma.baseIngredient.findUnique({
    where: { id }
  });
};
