import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import api from '../../lib/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({ totalRecipes: 0, topProfitable: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/recipes/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Erreur de chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation épurée */}
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
                  variant="primary"
                  size="md"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigate('/recipes')}
                  variant="success"
                  size="md"
                >
                  Mes Recettes
                </Button>
                <Button
                  onClick={() => navigate('/recipes/new')}
                  variant="purple"
                  size="md"
                >
                  Nouvelle Recette
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
              variant="primary"
              className="w-full justify-start"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => navigate('/recipes')}
              variant="success"
              className="w-full justify-start"
            >
              Mes Recettes
            </Button>
            <Button
              onClick={() => navigate('/recipes/new')}
              variant="purple"
              className="w-full justify-start"
            >
              Nouvelle Recette
            </Button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 space-y-6">
          {/* En-tête simple */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Bienvenue {user?.firstName}
            </h2>
            <p className="text-gray-600">
              {user?.company || 'Votre entreprise'}
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-4">Chargement...</p>
            </div>
          ) : (
            <>
              {/* Statistiques */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Vue d'ensemble
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-2">Recettes créées</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.totalRecipes}
                  </p>
                </div>
              </div>

              {/* Top recettes rentables */}
              {stats.topProfitable && stats.topProfitable.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Top 5 - Recettes les plus rentables
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Recette
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Coût
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Prix suggéré
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Marge
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stats.topProfitable.map((recipe, index) => (
                          <tr key={recipe.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500 font-medium">
                                  {index + 1}.
                                </span>
                                <span className="text-sm font-medium text-gray-900">{recipe.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {recipe.totalCost.toFixed(2)} €
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {recipe.suggestedPrice ? `${recipe.suggestedPrice.toFixed(2)} €` : '-'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-semibold ${
                                recipe.margin >= 60 ? 'text-green-600' : 
                                recipe.margin >= 40 ? 'text-yellow-600' : 
                                'text-red-600'
                              }`}>
                                {recipe.margin.toFixed(1)} %
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
