import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../lib/api';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalRecipes: 0,
    topProfitable: [],
    createdByMonth: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/recipes/stats');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
      <p className="text-gray-600 mb-8">Bienvenue {user?.firstName} !</p>

      {/* Statistique principale */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="text-center">
          <p className="text-5xl font-bold text-blue-600 mb-2">{stats.totalRecipes}</p>
          <p className="text-gray-600">Recettes créées</p>
        </div>
      </div>

      {stats.totalRecipes === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">Aucune recette créée pour le moment.</p>
          <p className="text-gray-600 text-sm mt-2">Commencez par créer votre première recette !</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Top 5 recettes rentables */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recettes les plus rentables</h2>
            {stats.topProfitable.length > 0 ? (
              <div className="space-y-3">
                {stats.topProfitable.map((recipe, index) => (
                  <div key={recipe.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-medium">#{index + 1}</span>
                      <span className="text-gray-900">{recipe.name}</span>
                    </div>
                    <span className="text-green-600 font-bold">{recipe.margin}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune donnée disponible</p>
            )}
          </div>

          {/* Graphique par mois */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recettes créées par mois</h2>
            {stats.createdByMonth.length > 0 ? (
              <div className="space-y-2">
                {stats.createdByMonth.map((item) => (
                  <div key={item.month} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{formatMonth(item.month)}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="bg-blue-500 h-6 rounded"
                        style={{ width: `${item.count * 20}px`, minWidth: '40px' }}
                      />
                      <span className="text-gray-900 font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune donnée disponible</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
