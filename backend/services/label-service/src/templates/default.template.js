export const defaultTemplate = (data) => {
  const {
    productName,
    ingredients, // Array of { name, quantity, unit, allergens: [] }
    nutrition,   // { energy, energyKcal, fat, saturatedFat, carbs, sugars, proteins, salt }
    mentions     // { manufacturer, dlc, netWeight, storage }
  } = data;

  // Helper pour mettre en gras les allergènes
  const formatIngredients = (ingredients) => {
    if (!ingredients || ingredients.length === 0) return '';
    
    // Trier par quantité décroissante (si quantity est fourni)
    const sorted = [...ingredients].sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    
    return sorted.map(ing => {
      let name = ing.name;
      // Si l'ingrédient contient des allergènes ou est un allergène, on le met en gras
      // Note: Ceci est une simplification. Idéalement, on devrait détecter les allergènes dans le texte.
      // Ici on suppose que si ing.isAllergen est vrai ou s'il a des allergènes, on met tout le nom en gras.
      // Pour une conformité stricte, il faudrait mettre en gras SEULEMENT le mot clé de l'allergène.
      if (ing.isAllergen || (ing.allergens && ing.allergens.length > 0)) {
        return `<strong>${name}</strong>`;
      }
      return name;
    }).join(', ');
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; font-size: 10pt; margin: 0; padding: 10px; width: 100mm; }
        .label-container { border: 1px solid #000; padding: 5px; }
        h1 { font-size: 14pt; margin: 0 0 5px 0; text-transform: uppercase; }
        .ingredients { font-size: 8pt; margin-bottom: 5px; }
        .nutrition-table { width: 100%; border-collapse: collapse; font-size: 7pt; margin-bottom: 5px; }
        .nutrition-table td, .nutrition-table th { border: 1px solid #000; padding: 2px; }
        .mentions { font-size: 7pt; }
        .bold { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="label-container">
        <h1>${productName}</h1>
        
        <div class="ingredients">
          <strong>Ingrédients :</strong> ${formatIngredients(ingredients)}.
        </div>

        <table class="nutrition-table">
          <tr>
            <th colspan="2">Valeurs nutritionnelles pour 100g</th>
          </tr>
          <tr>
            <td>Énergie</td>
            <td>${nutrition?.energy || 0} kJ / ${nutrition?.energyKcal || 0} kcal</td>
          </tr>
          <tr>
            <td>Matières grasses</td>
            <td>${nutrition?.fat || 0} g</td>
          </tr>
          <tr>
            <td style="padding-left: 10px;">dont acides gras saturés</td>
            <td>${nutrition?.saturatedFat || 0} g</td>
          </tr>
          <tr>
            <td>Glucides</td>
            <td>${nutrition?.carbs || 0} g</td>
          </tr>
          <tr>
            <td style="padding-left: 10px;">dont sucres</td>
            <td>${nutrition?.sugars || 0} g</td>
          </tr>
          <tr>
            <td>Protéines</td>
            <td>${nutrition?.proteins || 0} g</td>
          </tr>
          <tr>
            <td>Sel</td>
            <td>${nutrition?.salt || 0} g</td>
          </tr>
        </table>

        <div class="mentions">
          <div>Poids net : ${mentions?.netWeight || 'N/A'}</div>
          <div>À consommer jusqu'au : ${mentions?.dlc || 'N/A'}</div>
          <div>Conservation : ${mentions?.storage || 'Frais'}</div>
          <div>Fabriqué par : ${mentions?.manufacturer || 'Mon Entreprise'}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};
