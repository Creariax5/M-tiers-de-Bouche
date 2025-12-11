import { formatIngredients } from './utils.js';

export const modernTemplate = (data) => {
  const {
    productName,
    ingredients,
    nutrition,
    mentions
  } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 10pt; margin: 0; padding: 10px; width: 100mm; }
        .label-container { border: 2px solid #333; padding: 15px; border-radius: 8px; }
        h1 { font-size: 18pt; margin: 0 0 15px 0; font-weight: 800; letter-spacing: -0.5px; }
        .section-title { font-size: 8pt; text-transform: uppercase; color: #666; margin-bottom: 2px; font-weight: bold; }
        .ingredients { font-size: 9pt; margin-bottom: 15px; line-height: 1.4; }
        .nutrition-table { width: 100%; border-collapse: collapse; font-size: 8pt; margin-bottom: 15px; }
        .nutrition-table td { border-bottom: 1px solid #eee; padding: 4px 0; }
        .nutrition-table tr:last-child td { border-bottom: none; }
        .mentions { font-size: 8pt; display: flex; flex-wrap: wrap; gap: 10px; background: #f9f9f9; padding: 10px; border-radius: 4px; }
        .mentions div { flex: 1 1 40%; }
        .bold { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="label-container">
        <h1>${productName}</h1>
        
        <div class="section-title">Ingrédients</div>
        <div class="ingredients">
          ${formatIngredients(ingredients)}.
        </div>

        <div class="section-title">Valeurs nutritionnelles (100g)</div>
        <table class="nutrition-table">
          <tr>
            <td>Énergie</td>
            <td style="text-align: right; font-weight: bold;">${nutrition?.energy || 0} kJ / ${nutrition?.energyKcal || 0} kcal</td>
          </tr>
          <tr>
            <td>Matières grasses</td>
            <td style="text-align: right;">${nutrition?.fat || 0} g</td>
          </tr>
          <tr>
            <td style="padding-left: 10px; color: #666;">dont saturés</td>
            <td style="text-align: right; color: #666;">${nutrition?.saturatedFat || 0} g</td>
          </tr>
          <tr>
            <td>Glucides</td>
            <td style="text-align: right;">${nutrition?.carbs || 0} g</td>
          </tr>
          <tr>
            <td style="padding-left: 10px; color: #666;">dont sucres</td>
            <td style="text-align: right; color: #666;">${nutrition?.sugars || 0} g</td>
          </tr>
          <tr>
            <td>Protéines</td>
            <td style="text-align: right;">${nutrition?.proteins || 0} g</td>
          </tr>
          <tr>
            <td>Sel</td>
            <td style="text-align: right;">${nutrition?.salt || 0} g</td>
          </tr>
        </table>

        <div class="mentions">
          <div><strong>Poids:</strong> ${mentions?.netWeight || 'N/A'}</div>
          <div><strong>DLC:</strong> ${mentions?.dlc || 'N/A'}</div>
          <div><strong>Stockage:</strong> ${mentions?.storage || 'Frais'}</div>
          <div style="flex-basis: 100%;"><strong>Fabriquant:</strong> ${mentions?.manufacturer || 'Mon Entreprise'}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};
