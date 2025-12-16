import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button, Logo } from '../ui';
import { Home, UtensilsCrossed, ChefHat, LogOut } from 'lucide-react';

/**
 * Header réutilisable avec navigation - Style Régal
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
    if (path === '/recipes') return location.pathname.startsWith('/recipes');
    if (path === '/ingredients') return location.pathname.includes('/ingredients');
    return false;
  };

  // Mode minimal (pour formulaires)
  if (minimal) {
    return (
      <header className="bg-white border-b border-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <>
                  <Button 
                    onClick={() => navigate(backTo)}
                    variant="outline"
                    size="md"
                  >
                    ← Retour
                  </Button>
                  <div className="h-6 w-px bg-neutral-light"></div>
                </>
              )}
              {title && (
                <h1 className="text-xl font-bold text-primary font-primary">
                  {title}
                </h1>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-secondary font-secondary">{user?.email}</span>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                size="md"
              >
                <LogOut size={16} /> Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Mode complet avec navigation
  return (
    <nav className="bg-white border-b border-neutral-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Navigation */}
          <div className="flex items-center space-x-8">
            <Logo size="sm" variant="secondary" className="cursor-pointer" onClick={() => navigate('/dashboard')} />
            
            {/* Navigation principale - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                onClick={() => navigate('/dashboard')}
                variant={isActive('/dashboard') ? 'primary' : 'ghost'}
                size="md"
              >
                <Home size={16} /> Dashboard
              </Button>
              <Button
                onClick={() => navigate('/recipes')}
                variant={isActive('/recipes') ? 'primary' : 'ghost'}
                size="md"
              >
                <UtensilsCrossed size={16} /> Mes Recettes
              </Button>
              <Button
                onClick={() => navigate('/ingredients/custom')}
                variant={isActive('/ingredients') ? 'primary' : 'ghost'}
                size="md"
              >
                <ChefHat size={16} /> Mes Ingrédients
              </Button>
            </div>
          </div>
          
          {/* User Info + Déconnexion */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-primary font-secondary">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-secondary font-secondary">{user?.company || 'Votre entreprise'}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="md"
            >
              <LogOut size={16} /> Déconnexion
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
            <Home size={16} /> Dashboard
          </Button>
          <Button
            onClick={() => navigate('/recipes')}
            variant={isActive('/recipes') ? 'primary' : 'ghost'}
            className="w-full justify-start"
          >
            <UtensilsCrossed size={16} /> Mes Recettes
          </Button>
          <Button
            onClick={() => navigate('/ingredients/custom')}
            variant={isActive('/ingredients') ? 'primary' : 'ghost'}
            className="w-full justify-start"
          >
            <ChefHat size={16} /> Mes Ingrédients
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
