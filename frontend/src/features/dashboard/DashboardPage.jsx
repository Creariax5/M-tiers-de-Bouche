import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                🧁 Métiers de Bouche
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <Button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bienvenue {user?.firstName} !
            </h2>
            <p className="text-gray-600 mb-4">
              Vous êtes connecté à votre compte Métiers de Bouche.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ✓ Authentification réussie - US-017 Frontend Auth Pages complétée
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Entreprise : {user?.company || 'Non renseignée'}
              </p>
              <p className="text-xs text-blue-600">
                Email : {user?.email}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
