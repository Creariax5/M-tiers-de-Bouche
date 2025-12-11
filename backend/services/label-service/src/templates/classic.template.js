import { formatIngredients } from './utils.js';

export const classicTemplate = (data) => {
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
        body { font-family: "Times New Roman", Times, serif; font-size: 11pt; margin: 0; padding: 10px; width: 100mm; }
        .label-container { border: 3px double #000; padding: 10px; text-align: center; }
        h1 { font-size: 16pt; margin: 0 0 10px 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 5px; }
        .ingredients { font-size: 9pt; margin-bottom: 10px; text-align: justify; font-style: italic; }
        .nutrition-table { width: 100%; border-collapse: collapse; font-size: 8pt; margin-bottom: 10px; }
        .nutrition-table td, .nutrition-table th { border: 1px solid #000; padding: 3px; text-align: left; }
        .mentions { font-size: 8pt; margin-top: 10px; border-top: 1px solid #000; padding-top: 5px; }
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
            <th colspan="2" style="text-align: center; background-color: #f0f0f0;">Valeurs nutritionnelles pour 100g</th>
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
            <td style="padding-left: 15px;">dont acides gras saturés</td>
            <td>${nutrition?.saturatedFat || 0} g</td>
          </tr>
          <tr>
            <td>Glucides</td>
            <td>${nutrition?.carbs || 0} g</td>
          </tr>
          <tr>
            <td style="padding-left: 15px;">dont sucres</td>
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
          <div><strong>Poids net :</strong> ${mentions?.netWeight || 'N/A'}</div>
          <div><strong>DLC :</strong> ${mentions?.dlc || 'N/A'}</div>
          <div><strong>Conservation :</strong> ${mentions?.storage || 'Frais'}</div>
          <div style="margin-top: 5px;">${mentions?.manufacturer || 'Mon Entreprise'}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};
