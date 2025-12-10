import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { Button, Card, Alert, Loading, EmptyState } from '../components/ui';
import api from '../lib/api';

const CATEGORIES = [
  'Viennoiserie',
  'Pâtisserie',
  'Boulangerie',
  'Confiserie',
  'Traiteur',
  'Autre',
];

export default function RecipesListPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;
  
  useEffect(() => {
    fetchRecipes();
  }, [page, category]);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchRecipes();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);
  
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await api.get(`/recipes?${params.toString()}`);
      setRecipes(response.data.recipes || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Erreur de chargement des recettes');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (recipeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      return;
    }
    
    try {
      await api.delete(`/recipes/${recipeId}`);
      fetchRecipes(); // Refresh list
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert('Erreur lors de la suppression');
    }
  };
  
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Mes recettes ({total})
          </h2>
          <Button
            onClick={() => navigate('/recipes/new')}
            variant="primary"
          >
            + Nouvelle recette
          </Button>
        </div>

        {/* Filtres */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Erreur */}
        {error && <Alert variant="error">{error}</Alert>}

        {/* Chargement */}
        {loading ? (
          <Loading fullPage text="Chargement des recettes..." />
        ) : recipes.length === 0 ? (
          <Card>
            <EmptyState
              icon="📋"
              title="Aucune recette trouvée"
              description="Créez votre première recette pour commencer"
              action={
                <Button onClick={() => navigate('/recipes/new')} variant="primary">
                  Créer ma première recette
                </Button>
              }
            />
          </Card>
        ) : (
          <>
            {/* Tableau */}
            <Card noPadding>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Portions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date création
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recipes.map((recipe) => (
                      <tr key={recipe.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {recipe.name}
                          </div>
                          {recipe.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {recipe.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {recipe.category || 'Non définie'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {recipe.servings} portion{recipe.servings > 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => navigate(`/recipes/${recipe.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Voir
                          </button>
                          <button
                            onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(recipe.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      variant="secondary"
                    >
                      Précédent
                    </Button>
                    <Button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      variant="secondary"
                    >
                      Suivant
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{page}</span> sur{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        variant="secondary"
                        size="sm"
                      >
                        Précédent
                      </Button>
                      <Button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        variant="secondary"
                        size="sm"
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
