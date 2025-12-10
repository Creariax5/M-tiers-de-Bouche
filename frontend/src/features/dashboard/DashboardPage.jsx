import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { PageContainer } from '../../components/layout';
import { Card, Alert, Loading, StatsCard } from '../../components/ui';
import api from '../../lib/api';

export default function DashboardPage() {
  const { user } = useAuthStore();
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
  
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* En-tête simple */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Bienvenue {user?.firstName}
          </h2>
          <p className="text-gray-600">
            {user?.company || 'Votre entreprise'}
          </p>
        </Card>

        {/* Erreur */}
        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        {loading ? (
          <Loading fullPage text="Chargement..." />
        ) : (
          <>
            {/* Statistiques */}
            <Card title="Vue d'ensemble">
              <StatsCard 
                label="Recettes créées"
                value={stats.totalRecipes}
                icon="📋"
              />
            </Card>

            {/* Top recettes rentables */}
            {stats.topProfitable && stats.topProfitable.length > 0 && (
              <Card title="Top 5 - Recettes les plus rentables" noPadding>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
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
              </Card>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
