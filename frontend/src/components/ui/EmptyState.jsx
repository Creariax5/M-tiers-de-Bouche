import React from 'react';

/**
 * Composant Empty State réutilisable
 * Utilise les variables du DS (primary, secondary) pour les couleurs
 */
export function EmptyState({ 
  icon = '📭',
  title = 'Aucun élément',
  description,
  action,
  className = '' 
}) {
  return (
    <div className={`text-center py-16 flex flex-col items-center ${className}`}>
      <span className="text-6xl mb-4 block">{icon}</span>
      <h3 className="text-lg font-bold text-primary font-primary mb-2">{title}</h3>
      {description && (
        <p className="text-secondary font-secondary mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <div className="flex justify-center">{action}</div>
      )}
    </div>
  );
}

export default EmptyState;
