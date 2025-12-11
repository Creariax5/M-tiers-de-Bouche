export const formatIngredients = (ingredients) => {
  if (!ingredients || ingredients.length === 0) return '';
  
  // Trier par quantité décroissante (si quantity est fourni)
  const sorted = [...ingredients].sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
  
  return sorted.map(ing => {
    let name = ing.name;
    // Si l'ingrédient contient des allergènes ou est un allergène, on le met en gras
    if (ing.isAllergen || (ing.allergens && ing.allergens.length > 0)) {
      return `<strong>${name}</strong>`;
    }
    return name;
  }).join(', ');
};
