import React from 'react';

/**
 * Composant Empty State réutilisable
 * @param {Object} props
 * @param {string} props.icon - Emoji ou icône
 * @param {string} props.title - Titre principal
 * @param {string} props.description - Description
 * @param {React.ReactNode} props.action - Bouton d'action
 * @param {string} props.className - Classes additionnelles
 */
export function EmptyState({ 
  icon = '📭',
  title = 'Aucun élément',
  description,
  action,
  className = '' 
}) {
  return (
    <div className={`text-center py-16 ${className}`}>
      <span className="text-6xl mb-4 block">{icon}</span>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}

export default EmptyState;
