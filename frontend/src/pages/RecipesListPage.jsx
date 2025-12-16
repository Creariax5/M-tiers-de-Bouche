import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { Button, Card, Alert, Loading, EmptyState, Input } from '../components/ui';
import api from '../lib/api';
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

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
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold font-primary text-primary">
              Mes recettes
            </h2>
            <p className="text-secondary mt-1 font-secondary">
              {total} recette{total > 1 ? 's' : ''} enregistrée{total > 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={() => navigate('/recipes/new')}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Nouvelle recette
          </Button>
        </div>

        {/* Filtres */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-dark mb-2 uppercase tracking-wider">
                Rechercher
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher par nom..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-dark mb-2 uppercase tracking-wider">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-neutral-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white font-secondary"
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
            <Card noPadding className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-medium">
                  <thead className="bg-neutral-light">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark uppercase tracking-wider font-secondary">
                        Nom
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark uppercase tracking-wider font-secondary">
                        Catégorie
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark uppercase tracking-wider font-secondary">
                        Portions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark uppercase tracking-wider font-secondary">
                        Date création
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-neutral-dark uppercase tracking-wider font-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-medium">
                    {recipes.map((recipe) => (
                      <tr key={recipe.id} className="hover:bg-neutral-light/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-primary font-primary">
                            {recipe.name}
                          </div>
                          {recipe.description && (
                            <div className="text-sm text-secondary truncate max-w-xs font-secondary">
                              {recipe.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent-light/20 text-accent-dark border border-accent-light/30">
                            {recipe.category || 'Non définie'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary font-secondary">
                          {recipe.servings} portion{recipe.servings > 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary font-secondary">
                          {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => navigate(`/recipes/${recipe.id}`)}
                            className="text-secondary hover:text-primary transition-colors p-1"
                            title="Voir"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                            className="text-secondary hover:text-primary transition-colors p-1"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(recipe.id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
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
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-neutral-medium shadow-sm">
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
                    <p className="text-sm text-secondary font-secondary">
                      Page <span className="font-bold text-primary">{page}</span> sur{' '}
                      <span className="font-bold text-primary">{totalPages}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft size={16} /> Précédent
                    </Button>
                    <Button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      Suivant <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
