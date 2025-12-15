import React from 'react';
import { Loader as DSLoader } from '@regal/design-system';

/**
 * Composant Spinner/Loading réutilisable
 * @param {Object} props
 * @param {string} props.size - Taille (sm, md, lg)
 * @param {string} props.text - Texte optionnel
 * @param {boolean} props.fullPage - Centrer sur toute la page
 * @param {string} props.className - Classes additionnelles
 */
export function Loading({ 
  size = 'md',
  text = 'Chargement...',
  fullPage = false,
  className = '' 
}) {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <DSLoader size={size} />
      {text && (
        <p className={`text-secondary mt-4 font-secondary ${textSizes[size]}`}>{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="text-center py-16 flex justify-center items-center h-full">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default Loading;
