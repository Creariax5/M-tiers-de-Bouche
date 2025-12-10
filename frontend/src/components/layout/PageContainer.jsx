import React from 'react';
import { Header } from './Header';

/**
 * Container de page avec Header intégré
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu de la page
 * @param {string} props.title - Titre pour le mode minimal
 * @param {boolean} props.minimal - Header minimal (formulaires)
 * @param {boolean} props.showBackButton - Afficher bouton retour
 * @param {string} props.backTo - URL du bouton retour
 * @param {string} props.maxWidth - max-w-* class (défaut: 7xl)
 * @param {string} props.className - Classes additionnelles
 */
export function PageContainer({ 
  children, 
  title,
  minimal = false,
  showBackButton = false,
  backTo = '/recipes',
  maxWidth = '7xl',
  className = ''
}) {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={title}
        minimal={minimal}
        showBackButton={showBackButton}
        backTo={backTo}
      />
      <main className={`${maxWidthClasses[maxWidth] || 'max-w-7xl'} mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </main>
    </div>
  );
}

export default PageContainer;
