import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import LabelGenerationModal from '../components/LabelGenerationModal';

export default function RecipeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuthStore();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLabelModal, setShowLabelModal] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/recipes/${id}`)
        .then((response) => {
          setRecipe(response.data);
        })
        .catch((err) => {
          console.error('Error loading recipe:', err);
          setError('Erreur lors du chargement de la recette');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Recette non trouvée'}</p>
          <Button onClick={() => navigate('/recipes')}>Retour aux recettes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/dashboard')} variant="secondary">
                Dashboard
              </Button>
              <Button onClick={() => navigate('/recipes')} variant="secondary">
                Mes Recettes
              </Button>
              <Button onClick={() => navigate('/recipes/new')} variant="secondary">
                Nouvelle Recette
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <Button onClick={logout} variant="secondary">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{recipe.name}</h1>
              {recipe.category && (
                <span className="inline-block mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {recipe.category}
                </span>
              )}
              {recipe.description && (
                <p className="mt-4 text-gray-600">{recipe.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowLabelModal(true)} variant="secondary">
                🏷️ Générer étiquette
              </Button>
              <Button onClick={() => navigate(`/recipes/${id}/edit`)} variant="primary">
                Modifier
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-gray-500">Portions</p>
              <p className="text-2xl font-semibold">{recipe.servings || 1}</p>
            </div>
            {recipe.preparationTime > 0 && (
              <div className="border-l-4 border-green-600 pl-4">
                <p className="text-sm text-gray-500">Préparation</p>
                <p className="text-2xl font-semibold">{recipe.preparationTime} min</p>
              </div>
            )}
            {recipe.cookingTime > 0 && (
              <div className="border-l-4 border-orange-600 pl-4">
                <p className="text-sm text-gray-500">Cuisson</p>
                <p className="text-2xl font-semibold">{recipe.cookingTime} min</p>
              </div>
            )}
            {recipe.restingTime > 0 && (
              <div className="border-l-4 border-purple-600 pl-4">
                <p className="text-sm text-gray-500">Repos</p>
                <p className="text-2xl font-semibold">{recipe.restingTime} min</p>
              </div>
            )}
          </div>
        </div>

        {/* Ingrédients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Ingrédients ({recipe.ingredients.length})</h2>
            <div className="space-y-2">
              {recipe.ingredients.map((ing, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{ing.baseIngredient?.name || ing.customIngredient?.name || ing.subRecipe?.name}</span>
                    {ing.baseIngredient && (
                      <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">base</span>
                    )}
                    {ing.customIngredient && (
                      <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded">custom</span>
                    )}
                    {ing.subRecipe && (
                      <span className="ml-2 text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">recette</span>
                    )}
                  </div>
                  <div className="text-gray-600">
                    {ing.quantity} {ing.unit}
                    {ing.lossPercent > 0 && <span className="ml-2 text-sm text-gray-500">(perte {ing.lossPercent}%)</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Allergènes */}
        {recipe.allergens && recipe.allergens.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Allergènes</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.allergens.map((allergen, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Informations nutritionnelles */}
        {recipe.nutrition && recipe.nutrition.per100g && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Informations nutritionnelles (pour 100g)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Énergie</p>
                <p className="text-xl font-semibold">{recipe.nutrition.per100g.energyKcal} kcal</p>
                <p className="text-xs text-gray-400">{recipe.nutrition.per100g.energyKj} kJ</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Protéines</p>
                <p className="text-xl font-semibold">{recipe.nutrition.per100g.proteins} g</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Glucides</p>
                <p className="text-xl font-semibold">{recipe.nutrition.per100g.carbs} g</p>
                {recipe.nutrition.per100g.sugars > 0 && (
                  <p className="text-xs text-gray-400">dont sucres: {recipe.nutrition.per100g.sugars} g</p>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Lipides</p>
                <p className="text-xl font-semibold">{recipe.nutrition.per100g.fats} g</p>
                {recipe.nutrition.per100g.saturatedFats > 0 && (
                  <p className="text-xs text-gray-400">dont saturés: {recipe.nutrition.per100g.saturatedFats} g</p>
                )}
              </div>
            </div>
            {recipe.nutrition.per100g.salt > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg inline-block">
                <p className="text-sm text-gray-500">Sel</p>
                <p className="text-xl font-semibold">{recipe.nutrition.per100g.salt} g</p>
              </div>
            )}
            {recipe.nutrition.totalWeight > 0 && (
              <p className="mt-4 text-sm text-gray-500">Poids total: {recipe.nutrition.totalWeight} g</p>
            )}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-between">
          <Button onClick={() => navigate('/recipes')} variant="secondary">
            Retour aux recettes
          </Button>
          <Button onClick={() => navigate(`/recipes/${id}/edit`)} variant="primary">
            Modifier cette recette
          </Button>
        </div>
      </div>

      {/* Modal de génération d'étiquette */}
      <LabelGenerationModal
        recipe={recipe}
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
      />
    </div>
  );
}
