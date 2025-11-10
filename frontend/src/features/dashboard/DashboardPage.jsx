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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation moderne et professionnelle */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Titre */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🧁</span>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Métiers de Bouche
                </h1>
              </div>
              
              {/* Navigation principale - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="primary"
                  size="md"
                  className="gap-2"
                >
                  <span>📊</span>
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigate('/recipes')}
                  variant="success"
                  size="md"
                  className="gap-2"
                >
                  <span>📖</span>
                  Mes Recettes
                </Button>
                <Button
                  onClick={() => navigate('/recipes/new')}
                  variant="purple"
                  size="md"
                  className="gap-2"
                >
                  <span>➕</span>
                  Nouvelle Recette
                </Button>
              </div>
            </div>
            
            {/* User Info + Déconnexion */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.company || 'Votre entreprise'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
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
              className="w-full justify-start gap-2"
            >
              <span>📊</span>
              Dashboard
            </Button>
            <Button
              onClick={() => navigate('/recipes')}
              variant="success"
              className="w-full justify-start gap-2"
            >
              <span>📖</span>
              Mes Recettes
            </Button>
            <Button
              onClick={() => navigate('/recipes/new')}
              variant="purple"
              className="w-full justify-start gap-2"
            >
              <span>➕</span>
              Nouvelle Recette
            </Button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 space-y-6">
          {/* En-tête avec gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Bienvenue {user?.firstName} ! 👋
            </h2>
            <p className="text-blue-100 text-lg">
              {user?.company || 'Votre entreprise'}
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-4">Chargement des statistiques...</p>
            </div>
          ) : (
            <>
              {/* Statistiques - Card moderne */}
              <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h3>
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">Recettes créées</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stats.totalRecipes}
                  </p>
                </div>
              </div>

              {/* Top recettes rentables */}
              {stats.topProfitable && stats.topProfitable.length > 0 && (
                <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Top 5 - Recettes les plus rentables
                    </h3>
                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Recette
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Coût
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Prix suggéré
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Marge
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stats.topProfitable.map((recipe, index) => (
                          <tr key={recipe.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{recipe.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                              {recipe.totalCost.toFixed(2)} €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                              {recipe.suggestedPrice ? `${recipe.suggestedPrice.toFixed(2)} €` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                recipe.margin >= 60 ? 'bg-green-100 text-green-700' : 
                                recipe.margin >= 40 ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'
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
