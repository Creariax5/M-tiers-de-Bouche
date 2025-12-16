import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { PageContainer } from '../components/layout';
import { Button, Card, Alert, Loading, Input, Textarea, Select } from '../components/ui';
import IngredientAutocomplete from '../components/IngredientAutocomplete';
import { Trash2 } from 'lucide-react';

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
  const { id } = useParams(); // ID de la recette pour l'édition (undefined si création)

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
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('G'); // Unité par défaut
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

  // Charger la recette existante si en mode édition
  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/recipes/${id}`)
        .then((response) => {
          const recipe = response.data;
          setRecipeId(id);
          setFormData({
            name: recipe.name || '',
            description: recipe.description || '',
            category: recipe.category || '',
            portions: recipe.servings || 1,
            portionSize: recipe.portionSize || '',
            preparationTime: recipe.preparationTime || 0,
            cookingTime: recipe.cookingTime || 0,
            restingTime: recipe.restingTime || 0,
          });
          // Si la recette a des ingrédients, aller au step 2
          if (recipe.ingredients && recipe.ingredients.length > 0) {
            // Transformer les ingrédients pour avoir le format attendu par le formulaire
            const transformedIngredients = recipe.ingredients.map(ing => ({
              id: ing.id,
              name: ing.baseIngredient?.name || ing.customIngredient?.name || ing.subRecipe?.name || 'Ingrédient inconnu',
              quantity: ing.quantity,
              unit: ing.unit,
              lossPercent: ing.lossPercent || 0,
              baseIngredientId: ing.baseIngredientId,
              customIngredientId: ing.customIngredientId,
              subRecipeId: ing.subRecipeId,
              type: ing.baseIngredientId ? 'base' : ing.customIngredientId ? 'custom' : 'subRecipe'
            }));
            setIngredients(transformedIngredients);
            setCurrentStep(2);
          }
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

    // Si on est en mode édition et qu'on a déjà un recipeId, passer au step 2 directement
    if (recipeId) {
      setCurrentStep(2);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Créer la recette (mode création uniquement)
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

  // Sélection d'ingrédient depuis l'autocomplete
  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredient(ingredient);
  };

  // Ajouter ingrédient
  const handleAddIngredient = async () => {
    if (!selectedIngredient || !ingredientQuantity) return;

    setLoading(true);
    try {
      // Déterminer le bon champ selon le type d'ingrédient
      const ingredientPayload = {
        quantity: parseFloat(ingredientQuantity),
        unit: ingredientUnit,
        lossPercent: parseFloat(ingredientLoss) || 0,
      };

      // Utiliser le bon champ selon le type d'ingrédient (base ou custom)
      if (selectedIngredient.type === 'custom') {
        ingredientPayload.customIngredientId = selectedIngredient.id;
      } else {
        ingredientPayload.baseIngredientId = selectedIngredient.id;
      }

      await api.post(`/recipes/${recipeId}/ingredients`, ingredientPayload);

      // Ajouter à la liste locale
      setIngredients([
        ...ingredients,
        {
          ...selectedIngredient,
          quantity: parseFloat(ingredientQuantity),
          unit: ingredientUnit,
          lossPercent: parseFloat(ingredientLoss) || 0,
        },
      ]);

      // Reset form
      setSelectedIngredient(null);
      setIngredientQuantity('');
      setIngredientUnit('G'); // Reset à l'unité par défaut
      setIngredientLoss(0);
    } catch (err) {
      console.error('Error adding ingredient:', err);
      setError('Erreur lors de l\'ajout de l\'ingrédient');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un ingrédient
  const handleRemoveIngredient = async (index) => {
    const ingredientToRemove = ingredients[index];
    
    // Si l'ingrédient a un ID (existe en BDD), le supprimer via l'API
    if (ingredientToRemove.id && recipeId) {
      setLoading(true);
      try {
        await api.delete(`/recipes/${recipeId}/ingredients/${ingredientToRemove.id}`);
      } catch (err) {
        console.error('Error removing ingredient:', err);
        setError('Erreur lors de la suppression de l\'ingrédient');
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }
    
    // Retirer de la liste locale
    setIngredients(ingredients.filter((_, i) => i !== index));
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
    <PageContainer
      minimal
      showBackButton
      backTo="/recipes"
      title={id ? 'Modifier la recette' : 'Nouvelle recette'}
      maxWidth="4xl"
    >
      <div className="space-y-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium">Informations</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className={`h-full ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}
              ></div>
            </div>

            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">Ingrédients</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className={`h-full ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}
              ></div>
            </div>

            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
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
                <Input
                  label="Nom de la recette *"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  placeholder="Ex: Croissant"
                />

                <Textarea
                  label="Description"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Description de la recette..."
                />

                <Select
                  label="Catégorie"
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: '', label: 'Sélectionner une catégorie' },
                    ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
                  ]}
                />

                <Input
                  label="Nombre de portions"
                  type="number"
                  id="portions"
                  value={formData.portions}
                  onChange={(e) => setFormData({ ...formData, portions: e.target.value })}
                  min="1"
                />
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

              {/* Recherche ingrédients avec composant IngredientAutocomplete */}
              <div className="mb-6">
                <IngredientAutocomplete
                  onSelect={handleIngredientSelect}
                  placeholder="Rechercher un ingrédient..."
                  clearOnSelect={false}
                />

                {/* Formulaire ajout */}
                {selectedIngredient && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">{selectedIngredient.name}</p>

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label="Quantité"
                        type="number"
                        id="quantity"
                        value={ingredientQuantity}
                        onChange={(e) => setIngredientQuantity(e.target.value)}
                        min="0"
                        step="0.01"
                      />

                      <Select
                        label="Unité"
                        id="unit"
                        value={ingredientUnit}
                        onChange={(e) => setIngredientUnit(e.target.value)}
                        options={[
                          { value: 'G', label: 'Grammes (G)' },
                          { value: 'KG', label: 'Kilogrammes (KG)' },
                          { value: 'L', label: 'Litres (L)' },
                          { value: 'ML', label: 'Millilitres (ML)' },
                          { value: 'PIECE', label: 'Pièce(s)' }
                        ]}
                      />

                      <Input
                        label="Perte (%)"
                        type="number"
                        id="loss"
                        value={ingredientLoss}
                        onChange={(e) => setIngredientLoss(e.target.value)}
                        min="0"
                        max="100"
                      />
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIngredient(index)}
                          title="Supprimer cet ingrédient"
                          disabled={loading}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
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
                          <span className="font-medium">{nutrition.per100g.energyKcal} kcal</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Matières grasses</span>
                          <span className="font-medium">{nutrition.per100g.fats} g</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Glucides</span>
                          <span className="font-medium">{nutrition.per100g.carbs} g</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Protéines</span>
                          <span className="font-medium">{nutrition.per100g.proteins} g</span>
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
    </PageContainer>
  );
}
