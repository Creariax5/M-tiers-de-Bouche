import React from 'react';

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
  const sizeStyles = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeStyles[size]}`}
      />
      {text && (
        <p className={`text-gray-500 mt-4 ${textSizes[size]}`}>{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="text-center py-16">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default Loading;
