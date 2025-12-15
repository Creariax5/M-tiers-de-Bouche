import React from 'react';

const NutritionLabel = ({ values, portions = 1 }) => {
  // Valeurs par défaut si non fournies
  const {
    energyKj = 0,
    energyKcal = 0,
    fat = 0,
    saturatedFat = 0,
    carbs = 0,
    sugars = 0,
    proteins = 0,
    salt = 0
  } = values || {};

  return (
    <div className="border-2 border-black p-4 max-w-xs bg-white font-sans text-black">
      <h3 className="font-black text-xl border-b-8 border-black pb-1 mb-2">Déclaration Nutritionnelle</h3>
      
      <div className="text-sm font-bold border-b border-black pb-1 mb-1">
        Pour 100 g
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between items-baseline border-b border-gray-300 py-1">
          <span className="font-bold">Énergie</span>
          <div className="text-right">
            <div>{Math.round(energyKj)} kJ</div>
            <div>{Math.round(energyKcal)} kcal</div>
          </div>
        </div>

        <div className="flex justify-between items-baseline border-b border-gray-300 py-1">
          <span className="font-bold">Matières grasses</span>
          <span>{fat.toFixed(1)} g</span>
        </div>
        
        <div className="flex justify-between items-baseline border-b border-gray-300 py-1 pl-4">
          <span>dont acides gras saturés</span>
          <span>{saturatedFat.toFixed(1)} g</span>
        </div>

        <div className="flex justify-between items-baseline border-b border-gray-300 py-1">
          <span className="font-bold">Glucides</span>
          <span>{carbs.toFixed(1)} g</span>
        </div>

        <div className="flex justify-between items-baseline border-b border-gray-300 py-1 pl-4">
          <span>dont sucres</span>
          <span>{sugars.toFixed(1)} g</span>
        </div>

        <div className="flex justify-between items-baseline border-b border-gray-300 py-1">
          <span className="font-bold">Protéines</span>
          <span>{proteins.toFixed(1)} g</span>
        </div>

        <div className="flex justify-between items-baseline border-b-4 border-black py-1">
          <span className="font-bold">Sel</span>
          <span>{salt.toFixed(2)} g</span>
        </div>
      </div>
      
      <div className="text-[10px] mt-2 text-gray-600">
        * Apports de référence pour un adulte-type (8400 kJ / 2000 kcal)
      </div>
    </div>
  );
};

export default NutritionLabel;
