import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { ArrowLeft } from 'lucide-react';

/**
 * Container de page pour le contenu principal
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu de la page
 * @param {string} props.title - Titre de la page
 * @param {boolean} props.showBackButton - Afficher bouton retour
 * @param {string} props.backTo - URL du bouton retour
 * @param {string} props.maxWidth - max-w-* class (défaut: 7xl)
 * @param {string} props.className - Classes additionnelles
 */
export function PageContainer({ 
  children, 
  title,
  showBackButton = false,
  backTo = '/recipes',
  maxWidth = '7xl',
  className = ''
}) {
  const navigate = useNavigate();

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
    <div className={`${maxWidthClasses[maxWidth] || 'max-w-7xl'} mx-auto ${className}`}>
      {/* En-tête de page */}
      {(title || showBackButton) && (
        <div className="mb-8 flex items-center gap-4">
          {showBackButton && (
            <Button 
              onClick={() => navigate(backTo)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          {title && (
            <h1 className="text-3xl font-primary text-primary font-bold">
              {title}
            </h1>
          )}
        </div>
      )}

      {/* Contenu */}
      {children}
    </div>
  );
}

export default PageContainer;
