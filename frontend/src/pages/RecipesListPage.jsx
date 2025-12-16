import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { 
  Button, 
  Card, 
  Alert, 
  Loading, 
  EmptyState, 
  Input, 
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../components/ui';
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
  
  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
  ];
  
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
              <Select
                label="Catégorie"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                options={categoryOptions}
              />
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
            <Card padding="p-0" className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Portions</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell>
                        <div className="text-sm font-bold text-primary font-primary">
                          {recipe.name}
                        </div>
                        {recipe.description && (
                          <div className="text-sm text-secondary truncate max-w-xs font-secondary">
                            {recipe.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent-light/20 text-accent-dark border border-accent-light/30">
                          {recipe.category || 'Non définie'}
                        </span>
                      </TableCell>
                      <TableCell className="text-secondary font-secondary">
                        {recipe.servings} portion{recipe.servings > 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="text-secondary font-secondary">
                        {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/recipes/${recipe.id}`)}
                          title="Voir"
                          className="!p-2"
                        >
                          <Eye size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                          title="Modifier"
                          className="!p-2"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(recipe.id)}
                          title="Supprimer"
                          className="!p-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
