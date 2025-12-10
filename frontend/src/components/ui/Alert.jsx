import React from 'react';

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
  const variantStyles = {
    error: 'bg-red-50 border-red-500 text-red-700',
    success: 'bg-green-50 border-green-500 text-green-700',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
    info: 'bg-blue-50 border-blue-500 text-blue-700',
  };

  const iconMap = {
    error: '⚠️',
    success: '✅',
    warning: '⚡',
    info: 'ℹ️',
  };

  return (
    <div className={`border-l-4 px-6 py-4 rounded ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-lg">{iconMap[variant]}</span>
          <div>
            {title && (
              <p className="font-semibold mb-1">{title}</p>
            )}
            <div>{children}</div>
          </div>
        </div>
        {dismissible && onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 ml-4"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
