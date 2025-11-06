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
          {/* En-tête */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenue {user?.firstName} !
            </h2>
            <p className="text-gray-600">
              {user?.company || 'Votre entreprise'}
            </p>
          </div>

          {/* Statistiques */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des statistiques...</p>
            </div>
          ) : (
            <>
              {/* Total recettes */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Vue d'ensemble
                </h3>
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Recettes créées</p>
                    <p className="text-4xl font-bold text-blue-600">{stats.totalRecipes}</p>
                  </div>
                  {stats.totalRecipes === 0 && (
                    <div className="flex-1 text-center">
                      <p className="text-gray-500 mb-4">
                        Vous n'avez pas encore de recettes
                      </p>
                      <Button
                        onClick={() => navigate('/recipes/new')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Créer ma première recette
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Top recettes rentables */}
              {stats.topProfitable && stats.topProfitable.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Top 5 - Recettes les plus rentables
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Recette
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Coût
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prix suggéré
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Marge
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.topProfitable.map((recipe) => (
                          <tr key={recipe.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {recipe.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {recipe.totalCost.toFixed(2)} €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {recipe.suggestedPrice ? `${recipe.suggestedPrice.toFixed(2)} €` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`font-semibold ${
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
