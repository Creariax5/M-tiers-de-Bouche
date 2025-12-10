import React from 'react';

/**
 * Card de statistique réutilisable
 * @param {Object} props
 * @param {string} props.label - Label de la statistique
 * @param {string|number} props.value - Valeur à afficher
 * @param {string} props.icon - Emoji ou icône (optionnel)
 * @param {string} props.trend - Tendance (up, down, neutral)
 * @param {string} props.trendValue - Valeur de la tendance (ex: "+12%")
 * @param {string} props.variant - Style variant (default, success, warning, danger)
 * @param {string} props.className - Classes additionnelles
 */
export function StatsCard({ 
  label, 
  value, 
  icon,
  trend,
  trendValue,
  variant = 'default',
  className = '' 
}) {
  const variantStyles = {
    default: 'bg-gray-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
    primary: 'bg-blue-50',
  };

  const valueColors = {
    default: 'text-gray-900',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
    primary: 'text-blue-700',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div className={`${variantStyles[variant]} rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className={`text-4xl font-bold ${valueColors[variant]}`}>
            {value}
          </p>
          {trend && trendValue && (
            <p className={`text-sm mt-2 ${trendColors[trend]}`}>
              {trendIcons[trend]} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <span className="text-3xl">{icon}</span>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
