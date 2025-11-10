import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../lib/api';
import { Button } from '../components/ui/Button';

const CATEGORIES = [
  'Viennoiserie',
  'Pâtisserie',
  'Chocolaterie',
  'Boulangerie',
  'Confiserie',
  'Traiteur',
];

export default function RecipeFormPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // State pour le stepper
  const [currentStep, setCurrentStep] = useState(1);

  // State pour la recette
  const [recipeId, setRecipeId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    portions: 1,
    portionSize: '',
    preparationTime: 0,
    cookingTime: 0,
    restingTime: 0,
  });

  // State pour les ingrédients
  const [ingredients, setIngredients] = useState([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientLoss, setIngredientLoss] = useState(0);

  // State pour la révision
  const [allergens, setAllergens] = useState([]);
  const [nutrition, setNutrition] = useState(null);
  const [pricing, setPricing] = useState(null);

  // State UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  // Restaurer brouillon au montage
  useEffect(() => {
    const draft = localStorage.getItem('recipe_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(parsed);
      } catch (e) {
        console.error('Error parsing draft:', e);
      }
    }
  }, []);

  // Sauvegarder brouillon (debounce 500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name || formData.description) {
        localStorage.setItem('recipe_draft', JSON.stringify(formData));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData]);

  // Validation Step 1
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Le nom est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler Step 1 → Step 2
  const handleStep1Next = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    setError('');

    try {
      // Créer la recette
      const response = await api.post('/recipes', {
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category || undefined,
        portions: parseInt(formData.portions, 10) || 1,
        portionSize: formData.portionSize || undefined,
        preparationTime: parseInt(formData.preparationTime, 10) || undefined,
        cookingTime: parseInt(formData.cookingTime, 10) || undefined,
        restingTime: parseInt(formData.restingTime, 10) || undefined,
      });

      setRecipeId(response.data.id);
      setCurrentStep(2);
    } catch (err) {
      console.error('Error creating recipe:', err);
      setError('Erreur lors de la création de la recette');
    } finally {
      setLoading(false);
    }
  };

  // Recherche ingrédients (debounce)
  useEffect(() => {
    if (ingredientSearch.length < 2) {
      setIngredientSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await api.get(`/ingredients?search=${ingredientSearch}`);
        setIngredientSuggestions(response.data || []);
      } catch (err) {
        console.error('Error searching ingredients:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [ingredientSearch]);

  // Ajouter ingrédient
  const handleAddIngredient = async () => {
    if (!selectedIngredient || !ingredientQuantity) return;

    setLoading(true);
    try {
      await api.post(`/recipes/${recipeId}/ingredients`, {
        ingredientId: selectedIngredient.id,
        quantity: parseFloat(ingredientQuantity),
        lossPercent: parseFloat(ingredientLoss) || 0,
      });

      // Ajouter à la liste locale
      setIngredients([
        ...ingredients,
        {
          ...selectedIngredient,
          quantity: parseFloat(ingredientQuantity),
          lossPercent: parseFloat(ingredientLoss) || 0,
        },
      ]);

      // Reset form
      setSelectedIngredient(null);
      setIngredientQuantity('');
      setIngredientLoss(0);
      setIngredientSearch('');
      setIngredientSuggestions([]);
    } catch (err) {
      console.error('Error adding ingredient:', err);
      setError('Erreur lors de l\'ajout de l\'ingrédient');
    } finally {
      setLoading(false);
    }
  };

  // Handler Step 2 → Step 3
  const handleStep2Next = async () => {
    setLoading(true);
    setError('');

    try {
      // Charger allergènes, nutrition, pricing
      const [allergensRes, nutritionRes, pricingRes] = await Promise.all([
        api.get(`/recipes/${recipeId}/allergens`),
        api.get(`/recipes/${recipeId}/nutrition`),
        api.get(`/recipes/${recipeId}/pricing`),
      ]);

      setAllergens(allergensRes.data.allergens || []);
      setNutrition(nutritionRes.data.nutrition || null);
      setPricing(pricingRes.data.pricing || null);

      setCurrentStep(3);
    } catch (err) {
      console.error('Error loading calculations:', err);
      setError('Erreur lors du chargement des calculs');
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder et terminer
  const handleSave = () => {
    // Nettoyer localStorage
    localStorage.removeItem('recipe_draft');
    // Rediriger vers liste
    navigate('/recipes');
  };

  // Retour step précédent
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header professionnel avec navigation */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/recipes')}
                variant="secondary"
                size="md"
                className="gap-2"
              >
                <span>←</span>
                Retour aux recettes
              </Button>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nouvelle recette
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
              </div>
              <Button 
                onClick={logout}
                variant="secondary"
                size="md"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium">Informations</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className={`h-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}
              ></div>
            </div>

            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">Ingrédients</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className={`h-full ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}
              ></div>
            </div>

            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </div>
              <span className="ml-2 text-sm font-medium">Révision</span>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Step 1: Informations générales */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Informations générales</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la recette *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Croissant"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Description de la recette..."
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="portions" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de portions
                  </label>
                  <input
                    type="number"
                    id="portions"
                    value={formData.portions}
                    onChange={(e) => setFormData({ ...formData, portions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleStep1Next} disabled={loading}>
                  {loading ? 'Chargement...' : 'Suivant'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Ingrédients */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Ajouter des ingrédients</h2>

              {/* Recherche ingrédients */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={ingredientSearch}
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    placeholder="Rechercher un ingrédient..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Suggestions */}
                  {ingredientSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {ingredientSuggestions.map((ing) => (
                        <button
                          key={ing.id}
                          onClick={() => {
                            setSelectedIngredient(ing);
                            setIngredientSearch(ing.name);
                            setIngredientSuggestions([]);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          {ing.name} ({ing.unit})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Formulaire ajout */}
                {selectedIngredient && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">{selectedIngredient.name}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Quantité ({selectedIngredient.unit})
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          value={ingredientQuantity}
                          onChange={(e) => setIngredientQuantity(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label htmlFor="loss" className="block text-sm font-medium text-gray-700 mb-1">
                          Perte (%)
                        </label>
                        <input
                          type="number"
                          id="loss"
                          value={ingredientLoss}
                          onChange={(e) => setIngredientLoss(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <Button onClick={handleAddIngredient} className="mt-4" disabled={loading}>
                      Ajouter
                    </Button>
                  </div>
                )}
              </div>

              {/* Liste ingrédients ajoutés */}
              {ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Ingrédients ajoutés ({ingredients.length})</h3>
                  <div className="space-y-2">
                    {ingredients.map((ing, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>
                          {ing.name} - {ing.quantity} {ing.unit}
                          {ing.lossPercent > 0 && ` (perte ${ing.lossPercent}%)`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={handlePrevious}>
                  Précédent
                </Button>
                <Button onClick={handleStep2Next} disabled={loading}>
                  {loading ? 'Chargement...' : 'Suivant'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Révision */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Révision</h2>

              {loading ? (
                <p className="text-gray-600">Chargement des calculs...</p>
              ) : (
                <div className="space-y-6">
                  {/* Allergènes */}
                  <div>
                    <h3 className="font-medium mb-2">Allergènes</h3>
                    {allergens.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Aucun allergène détecté</p>
                    )}
                  </div>

                  {/* Coût */}
                  {pricing && (
                    <div>
                      <h3 className="font-medium mb-2">Coût de revient</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-xl font-semibold">{pricing.totalCost?.toFixed(2)} €</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Par 100g</p>
                          <p className="text-xl font-semibold">{pricing.costPer100g?.toFixed(2)} €</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Par portion</p>
                          <p className="text-xl font-semibold">{pricing.costPerServing?.toFixed(2)} €</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nutrition */}
                  {nutrition && nutrition.per100g && (
                    <div>
                      <h3 className="font-medium mb-2">Valeurs nutritionnelles (pour 100g)</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Énergie</span>
                          <span className="font-medium">{nutrition.per100g.energy} kcal</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Matières grasses</span>
                          <span className="font-medium">{nutrition.per100g.fat} g</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Glucides</span>
                          <span className="font-medium">{nutrition.per100g.carbs} g</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Protéines</span>
                          <span className="font-medium">{nutrition.per100g.protein} g</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={handlePrevious}>
                  Précédent
                </Button>
                <Button onClick={handleSave}>Enregistrer</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
