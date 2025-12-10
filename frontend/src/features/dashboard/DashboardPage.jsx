import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { PageContainer } from '../../components/layout';
import { Card, Alert, Loading, Button } from '../../components/ui';
import api from '../../lib/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalRecipes: 0 });
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger stats, recettes et ingrédients en parallèle
        const [statsRes, recipesRes, ingredientsRes] = await Promise.all([
          api.get('/recipes/stats'),
          api.get('/recipes?limit=5'),
          api.get('/ingredients/custom')
        ]);
        
        setStats(statsRes.data);
        setRecipes(recipesRes.data.recipes || []);
        setIngredients(ingredientsRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* En-tête avec message de bienvenue */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">
            Bonjour {user?.firstName} 👋
          </h2>
          <p className="text-blue-100">
            {user?.company || 'Bienvenue sur Métiers de Bouche'}
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        {loading ? (
          <Loading fullPage text="Chargement..." />
        ) : (
          <>
            {/* Statistiques en grille */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="text-center">
                <div className="text-4xl mb-2">📋</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalRecipes}</div>
                <div className="text-sm text-gray-500">Recettes</div>
              </Card>
              <Card className="text-center">
                <div className="text-4xl mb-2">🥄</div>
                <div className="text-3xl font-bold text-gray-900">{ingredients.length}</div>
                <div className="text-sm text-gray-500">Ingrédients personnalisés</div>
              </Card>
            </div>

            {/* Grille deux colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dernières recettes */}
              <Card title="Dernières recettes" noPadding>
                {recipes.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p className="mb-4">Aucune recette pour l'instant</p>
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/recipes/new')}
                    >
                      Créer ma première recette
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {recipes.map((recipe) => (
                      <li 
                        key={recipe.id} 
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{recipe.name}</p>
                          <p className="text-sm text-gray-500">
                            {recipe.category || 'Sans catégorie'} • {recipe.servings || 1} portion(s)
                          </p>
                        </div>
                        <span className="text-gray-400">→</span>
                      </li>
                    ))}
                  </ul>
                )}
                {recipes.length > 0 && (
                  <div className="px-4 py-3 border-t bg-gray-50">
                    <button 
                      onClick={() => navigate('/recipes')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Voir toutes les recettes →
                    </button>
                  </div>
                )}
              </Card>

              {/* Ingrédients personnalisés */}
              <Card title="Mes ingrédients" noPadding>
                {ingredients.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p className="mb-4">Aucun ingrédient personnalisé</p>
                    <Button 
                      variant="success"
                      onClick={() => navigate('/ingredients/custom')}
                    >
                      Ajouter un ingrédient
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {ingredients.slice(0, 5).map((ingredient) => (
                      <li 
                        key={ingredient.id} 
                        className="px-4 py-3 hover:bg-gray-50 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{ingredient.name}</p>
                          <p className="text-sm text-gray-500">
                            {ingredient.price ? `${ingredient.price.toFixed(2)} €/${ingredient.priceUnit}` : 'Prix non défini'}
                            {ingredient.supplier && ` • ${ingredient.supplier}`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {ingredients.length > 0 && (
                  <div className="px-4 py-3 border-t bg-gray-50">
                    <button 
                      onClick={() => navigate('/ingredients/custom')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Voir tous les ingrédients →
                    </button>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
