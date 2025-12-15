import React from 'react';
import designConfig from '../../config/designConfig';

const ProductLabel = ({ 
  title, 
  subtitle, 
  nutrition, 
  allergens = [], 
  conservation, 
  weight, 
  isHomemade = true, 
  isFresh = true,
  logoSrc
}) => {
  const { energyKcal, fat, carbs, proteins } = nutrition || {};

  return (
    <div className="w-full max-w-sm bg-white border-4 border-primary rounded-2xl overflow-hidden flex flex-col shadow-lg">
      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="w-16 h-16">
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-primary text-primary font-bold">
                RG
              </div>
            )}
          </div>
          <div className="text-right">
            {isHomemade && (
              <div className="text-primary font-primary text-lg">Fait maison</div>
            )}
            {isFresh && (
              <div className="text-secondary font-secondary text-sm uppercase tracking-wider">Du jour</div>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="font-primary text-3xl text-primary mb-1 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="font-secondary text-secondary text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Nutrition Box */}
        <div className="bg-neutral-light/50 rounded-xl p-4 space-y-2 mt-2">
          <div className="flex justify-between items-baseline text-secondary font-secondary">
            <span className="text-sm">Énergie (100g)</span>
            <span className="font-bold text-primary">{Math.round(energyKcal)} kcal</span>
          </div>
          <div className="flex justify-between items-baseline text-secondary font-secondary">
            <span className="text-sm">Lipides</span>
            <span className="font-bold text-primary">{fat}g</span>
          </div>
          <div className="flex justify-between items-baseline text-secondary font-secondary">
            <span className="text-sm">Glucides</span>
            <span className="font-bold text-primary">{carbs}g</span>
          </div>
          <div className="flex justify-between items-baseline text-secondary font-secondary">
            <span className="text-sm">Protéines</span>
            <span className="font-bold text-primary">{proteins}g</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="space-y-1 mt-2">
          {allergens.length > 0 && (
            <p className="font-secondary text-sm text-secondary">
              <span className="font-bold text-primary">Allergènes:</span> {allergens.join(', ')}
            </p>
          )}
          {conservation && (
            <p className="font-secondary text-sm text-secondary">
              <span className="text-secondary/80">Conservation:</span> {conservation}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary text-white py-3 px-6 flex justify-between items-center font-secondary text-sm">
        <span>{weight}</span>
        <span className="opacity-80">Généré par REGAL</span>
      </div>
    </div>
  );
};

export default ProductLabel;
