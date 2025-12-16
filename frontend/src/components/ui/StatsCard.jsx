import React from 'react';

/**
 * Card de statistique réutilisable - Style Régal
 * Utilise les variables du Design System (primary, secondary, accent)
 * pour que les couleurs changent automatiquement si on modifie le DS
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
    default: 'bg-neutral-smoke',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    danger: 'bg-error/10',
    primary: 'bg-primary/10',
    secondary: 'bg-secondary/10',
  };

  const valueColors = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-error',
    primary: 'text-primary',
    secondary: 'text-secondary',
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-secondary',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div className={`${variantStyles[variant]} rounded-3xl p-6 border border-neutral-light ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary mb-2 font-secondary uppercase tracking-wider">{label}</p>
          <p className={`text-4xl font-bold font-primary ${valueColors[variant]}`}>
            {value}
          </p>
          {trend && trendValue && (
            <p className={`text-sm mt-2 font-secondary ${trendColors[trend]}`}>
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
