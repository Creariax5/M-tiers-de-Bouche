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

/**
 * Génère la liste des ingrédients conforme INCO avec:
 * - Tri pondéral décroissant (Article 18 INCO)
 * - Allergènes en GRAS (Article 21 INCO)
 * @param {string} recipeId - ID de la recette
 * @param {string} format - 'text' (MAJUSCULES) ou 'html' (<strong>)
 * @returns {Promise<string>} Liste formatée des ingrédients
 */
export const generateIngredientList = async (recipeId, format = 'text') => {
  // Récupérer recette avec ingrédients triés par quantité décroissante
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: {
        include: {
          ingredient: {
            select: {
              name: true,
              allergens: true
            }
          }
        },
        orderBy: {
          quantity: 'desc' // ✅ Tri pondéral INCO Article 18
        }
      }
    }
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Calculer poids total pour pourcentages
  const totalWeight = recipe.ingredients.reduce((sum, ri) => sum + ri.quantity, 0);

  // Formatter chaque ingrédient
  const formattedIngredients = recipe.ingredients.map((ri) => {
    const ingredient = ri.ingredient;
    let ingredientName = ingredient.name;
    
    // Calculer pourcentage (optionnel, afficher si > 5%)
    const percentage = totalWeight > 0 ? (ri.quantity / totalWeight) * 100 : 0;
    const percentageStr = percentage >= 5 ? ` (${Math.round(percentage)}%)` : '';
    
    // Identifier allergènes dans cet ingrédient
    const allergens = ingredient.allergens 
      ? ingredient.allergens.split(',').map(a => a.trim()).filter(a => a.length > 0)
      : [];
    
    // Vérifier si l'ingrédient contient des allergènes
    const hasAllergens = allergens.length > 0;
    
    if (hasAllergens) {
      // Format HTML : <strong>NOM</strong>
      if (format === 'html') {
        ingredientName = `<strong>${ingredientName.toUpperCase()}</strong>`;
      } 
      // Format texte : NOM EN MAJUSCULES
      else {
        ingredientName = ingredientName.toUpperCase();
      }
    }
    
    return `${ingredientName}${percentageStr}`;
  });

  // Joindre avec virgules
  return formattedIngredients.join(', ');
};

/**
 * Génère une liste d'allergènes formatée pour l'étiquette
 * @param {string} recipeId - ID de la recette
 * @returns {Promise<Object>} { allergens: string[], formatted: string }
 */
export const formatAllergenList = async (recipeId) => {
  const allergens = await detectAllergens(recipeId);
  
  // Mapper vers noms français
  const allergenNames = {
    'gluten': 'Céréales contenant du gluten',
    'crustaces': 'Crustacés',
    'oeufs': 'Œufs',
    'poissons': 'Poissons',
    'arachides': 'Arachides',
    'soja': 'Soja',
    'lait': 'Lait',
    'fruits-a-coque': 'Fruits à coque',
    'celeri': 'Céleri',
    'moutarde': 'Moutarde',
    'sesame': 'Sésame',
    'sulfites': 'Sulfites',
    'lupin': 'Lupin',
    'mollusques': 'Mollusques'
  };
  
  const frenchNames = allergens
    .filter(a => allergenNames[a]) // Seulement les ADO
    .map(a => allergenNames[a]);
  
  return {
    allergens, // Codes originaux ['gluten', 'lait']
    formatted: frenchNames.join(', ') // "Céréales contenant du gluten, Lait"
  };
};

export default {
  detectAllergens,
  isMandatoryAllergen,
  generateIngredientList,
  formatAllergenList,
  MANDATORY_ALLERGENS
};
