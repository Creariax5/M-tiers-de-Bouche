import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';

/**
 * Header réutilisable avec navigation
 * @param {Object} props
 * @param {string} props.title - Titre optionnel à afficher (remplace la navigation)
 * @param {boolean} props.showBackButton - Afficher un bouton retour
 * @param {string} props.backTo - URL du bouton retour (défaut: /recipes)
 * @param {boolean} props.minimal - Mode minimal (juste retour + titre)
 */
export function Header({ title, showBackButton = false, backTo = '/recipes', minimal = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Déterminer la page active
  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/recipes') return location.pathname === '/recipes';
    if (path === '/recipes/new') return location.pathname.includes('/recipes/new') || location.pathname.includes('/edit');
    return false;
  };

  // Mode minimal (pour formulaires)
  if (minimal) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <>
                  <Button 
                    onClick={() => navigate(backTo)}
                    variant="secondary"
                    size="md"
                  >
                    ← Retour
                  </Button>
                  <div className="h-6 w-px bg-gray-300"></div>
                </>
              )}
              {title && (
                <h1 className="text-xl font-semibold text-gray-900">
                  {title}
                </h1>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">{user?.email}</span>
              <Button 
                onClick={handleLogout}
                variant="secondary"
                size="md"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Mode complet avec navigation
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Navigation */}
          <div className="flex items-center space-x-8">
            <h1 className="text-lg font-semibold text-gray-900">
              Métiers de Bouche
            </h1>
            
            {/* Navigation principale - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                onClick={() => navigate('/dashboard')}
                variant={isActive('/dashboard') ? 'primary' : 'ghost'}
                size="md"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => navigate('/recipes')}
                variant={isActive('/recipes') ? 'success' : 'ghost'}
                size="md"
              >
                Mes Recettes
              </Button>
              <Button
                onClick={() => navigate('/ingredients/custom')}
                variant={location.pathname === '/ingredients/custom' ? 'purple' : 'ghost'}
                size="md"
              >
                Mes Ingrédients
              </Button>
            </div>
          </div>
          
          {/* User Info + Déconnexion */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.company || 'Votre entreprise'}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="md"
            >
              Déconnexion
            </Button>
          </div>
        </div>
        
        {/* Navigation mobile */}
        <div className="md:hidden pb-3 pt-2 space-y-2">
          <Button
            onClick={() => navigate('/dashboard')}
            variant={isActive('/dashboard') ? 'primary' : 'ghost'}
            className="w-full justify-start"
          >
            Dashboard
          </Button>
          <Button
            onClick={() => navigate('/recipes')}
            variant={isActive('/recipes') ? 'success' : 'ghost'}
            className="w-full justify-start"
          >
            Mes Recettes
          </Button>
          <Button
            onClick={() => navigate('/ingredients/custom')}
            variant={location.pathname === '/ingredients/custom' ? 'purple' : 'ghost'}
            className="w-full justify-start"
          >
            Mes Ingrédients
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
