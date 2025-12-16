import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Tag, ChefHat, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuthStore();

  const isActive = (path) => {
    return location.pathname.startsWith(path) 
      ? 'bg-primary text-white' 
      : 'text-secondary hover:bg-neutral-light';
  };

  const navItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/recipes', label: 'Recettes', icon: UtensilsCrossed },
    { path: '/ingredients', label: 'Ingrédients', icon: ChefHat }, // Using ChefHat as placeholder for ingredients
    { path: '/labels', label: 'Étiquettes', icon: Tag },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-neutral-light fixed left-0 top-0 overflow-y-auto font-secondary flex flex-col">
      <div className="p-6 border-b border-neutral-light">
        <Link to="/dashboard" className="block">
          <h1 className="font-primary text-2xl text-primary">RÉGAL</h1>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-8">
          <h2 className="text-xs font-bold text-neutral-dark uppercase tracking-wider mb-4 px-4">Menu Principal</h2>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive(item.path)}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-neutral-light">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
