import { formatIngredients } from './utils.js';

export const minimalistTemplate = (data) => {
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
        body { font-family: "Courier New", Courier, monospace; font-size: 9pt; margin: 0; padding: 5px; width: 100mm; }
        .label-container { border: none; padding: 0; }
        h1 { font-size: 12pt; margin: 0 0 10px 0; text-transform: uppercase; border-bottom: 1px dashed #000; padding-bottom: 5px; }
        .ingredients { font-size: 8pt; margin-bottom: 10px; }
        .nutrition-compact { font-size: 7pt; margin-bottom: 10px; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; }
        .nutrition-row { display: flex; justify-content: space-between; }
        .mentions { font-size: 7pt; margin-top: 5px; }
        .bold { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="label-container">
        <h1>${productName}</h1>
        
        <div class="ingredients">
          ${formatIngredients(ingredients)}.
        </div>

        <div class="nutrition-compact">
          <div class="nutrition-row">
            <span>Énergie: ${nutrition?.energyKcal || 0} kcal</span>
            <span>Mat. Gr.: ${nutrition?.fat || 0}g</span>
            <span>(Sat: ${nutrition?.saturatedFat || 0}g)</span>
          </div>
          <div class="nutrition-row">
            <span>Glucides: ${nutrition?.carbs || 0}g</span>
            <span>(Sucres: ${nutrition?.sugars || 0}g)</span>
          </div>
          <div class="nutrition-row">
            <span>Protéines: ${nutrition?.proteins || 0}g</span>
            <span>Sel: ${nutrition?.salt || 0}g</span>
          </div>
        </div>

        <div class="mentions">
          Poids: ${mentions?.netWeight || 'N/A'} | DLC: ${mentions?.dlc || 'N/A'} <br/>
          ${mentions?.manufacturer || 'Mon Entreprise'}
        </div>
      </div>
    </body>
    </html>
  `;
};
