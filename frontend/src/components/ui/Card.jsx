import React from 'react';
import { Card as DSCard } from '@regal/design-system';

/**
 * Composant Card réutilisable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu de la card
 * @param {string} props.title - Titre optionnel
 * @param {React.ReactNode} props.actions - Boutons/actions en haut à droite
 * @param {string} props.className - Classes additionnelles
 * @param {boolean} props.noPadding - Désactiver le padding interne
 */
export function Card({ 
  children, 
  title,
  actions,
  className = '',
  noPadding = false
}) {
  // DS Card gère le padding via prop 'padding' (string class)
  // Legacy Card gère via boolean noPadding
  const paddingClass = noPadding ? 'p-0' : 'p-6';

  return (
    <DSCard className={className} padding={paddingClass}>
      {(title || actions) && (
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-light">
          {title && (
            <h3 className="text-lg font-bold text-primary font-primary">{title}</h3>
          )}
          {actions && (
            <div className="flex items-center space-x-2">{actions}</div>
          )}
        </div>
      )}
      <div className={noPadding ? '' : ''}>
        {children}
      </div>
    </DSCard>
  );
}

export default Card;
