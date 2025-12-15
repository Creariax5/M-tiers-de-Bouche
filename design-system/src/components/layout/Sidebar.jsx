import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-secondary hover:bg-neutral-light';
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-neutral-light fixed left-0 top-0 overflow-y-auto font-secondary">
      <div className="p-6 border-b border-neutral-light">
        <Link to="/" className="block">
          <h1 className="font-primary text-2xl text-primary">REGAL</h1>
          <p className="text-xs text-secondary mt-1 tracking-widest uppercase">Design System</p>
        </Link>
      </div>

      <nav className="p-4">
        <div className="mb-8">
          <h2 className="text-xs font-bold text-neutral-dark uppercase tracking-wider mb-4 px-4">Fondamentaux</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/fundamentals/configuration" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/fundamentals/configuration')}`}>
                Configuration
              </Link>
            </li>
            <li>
              <Link to="/fundamentals/brand" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/fundamentals/brand')}`}>
                Brand Sheet
              </Link>
            </li>
            <li>
              <Link to="/fundamentals/typography" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/fundamentals/typography')}`}>
                Typography
              </Link>
            </li>
            <li>
              <Link to="/fundamentals/colors" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/fundamentals/colors')}`}>
                Colors
              </Link>
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Composants</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/components/buttons" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/components/buttons')}`}>
                Buttons
              </Link>
            </li>
            <li>
              <Link to="/components/cards" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/components/cards')}`}>
                Cards
              </Link>
            </li>
            <li>
              <Link to="/components/inputs" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/components/inputs')}`}>
                Inputs
              </Link>
            </li>
            <li>
              <Link to="/components/badges" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/components/badges')}`}>
                Badges
              </Link>
            </li>
            <li>
              <Link to="/components/tables" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/components/tables')}`}>
                Tables
              </Link>
            </li>
            <li>
              <Link to="/components/tabs" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/components/tabs')}`}>
                Tabs
              </Link>
            </li>
            <li>
              <Link to="/components/alerts" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/components/alerts')}`}>
                Alerts
              </Link>
            </li>
            <li>
              <Link to="/components/modals" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/components/modals')}`}>
                Modals
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Exemples</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/examples/recipe-detail" className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/examples/recipe-detail')}`}>
                Fiche Recette
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
