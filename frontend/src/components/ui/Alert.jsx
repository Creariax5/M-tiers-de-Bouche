import React from 'react';
import { Alert as DSAlert } from '@regal/design-system';

/**
 * Composant Alert réutilisable pour messages d'erreur/succès/info
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu du message
 * @param {string} props.variant - Type d'alerte (error, success, warning, info)
 * @param {string} props.title - Titre optionnel
 * @param {boolean} props.dismissible - Peut être fermé
 * @param {Function} props.onDismiss - Callback de fermeture
 * @param {string} props.className - Classes additionnelles
 */
export function Alert({ 
  children, 
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className = '' 
}) {
  // DS Alert supporte variant, title, children, className
  // On ajoute le bouton dismiss manuellement en wrapper ou absolute
  
  if (dismissible && onDismiss) {
    return (
      <div className="relative">
        <DSAlert variant={variant} title={title} className={className}>
          <div className="pr-8">
            {children}
          </div>
        </DSAlert>
        <button 
          onClick={onDismiss}
          className="absolute top-4 right-4 text-secondary hover:text-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <DSAlert variant={variant} title={title} className={className}>
      {children}
    </DSAlert>
  );
}          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
