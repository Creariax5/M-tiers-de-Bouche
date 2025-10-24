import prisma from '../lib/prisma.js';

/**
 * Les 14 allergènes à déclaration obligatoire (ADO) en France
 */
export const MANDATORY_ALLERGENS = [
  'gluten',
  'crustaces',
  'oeufs',
  'poissons',
  'arachides',
  'soja',
  'lait',
  'fruits-a-coque',
  'celeri',
  'moutarde',
  'sesame',
  'sulfites',
  'lupin',
  'mollusques'
];

/**
 * Détecte les allergènes d'une recette en fonction de ses ingrédients
 * @param {string} recipeId - ID de la recette
 * @returns {Promise<string[]>} Liste unique des allergènes détectés
 */
export const detectAllergens = async (recipeId) => {
  // Récupérer tous les ingrédients de la recette
  const recipeIngredients = await prisma.recipeIngredient.findMany({
    where: { recipeId },
    include: {
      ingredient: {
        select: {
          allergens: true
        }
      }
    }
  });

  // Set pour garantir l'unicité
  const allergensSet = new Set();

  // Parcourir chaque ingrédient
  for (const ri of recipeIngredients) {
    const allergensString = ri.ingredient.allergens;
    
    // Si l'ingrédient a des allergènes
    if (allergensString && allergensString.trim() !== '') {
      // Parser le CSV (format: "gluten,lait,oeufs")
      const allergens = allergensString
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);
      
      // Ajouter au Set
      allergens.forEach(allergen => allergensSet.add(allergen));
    }
  }

  // Convertir en tableau trié
  return Array.from(allergensSet).sort();
};

/**
 * Vérifie si un allergène est dans la liste des ADO
 * @param {string} allergen - Nom de l'allergène
 * @returns {boolean}
 */
export const isMandatoryAllergen = (allergen) => {
  return MANDATORY_ALLERGENS.includes(allergen.toLowerCase());
};

export default {
  detectAllergens,
  isMandatoryAllergen,
  MANDATORY_ALLERGENS
};
