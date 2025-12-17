import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { PageContainer } from '../components/layout';
import { Button, Card, Alert, Loading, Input, Textarea, Select, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';
import IngredientAutocomplete from '../components/IngredientAutocomplete';
import { Trash2, ArrowLeft, ArrowRight, Check, ChefHat, Users } from 'lucide-react';

const CATEGORIES = [
  'Viennoiserie',
  'Pâtisserie',
  'Chocolaterie',
  'Boulangerie',
  'Confiserie',
  'Traiteur',
];

const STEPS = [
  { id: 1, label: 'Informations', icon: ChefHat },
  { id: 2, label: 'Ingrédients', icon: Users },
  { id: 3, label: 'Révision', icon: Check },
];

export default function RecipeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [recipeId, setRecipeId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    portions: 1,
  });

  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('G');
  const [ingredientLoss, setIngredientLoss] = useState(0);

  const [allergens, setAllergens] = useState([]);
  const [nutrition, setNutrition] = useState(null);
  const [pricing, setPricing] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const draft = localStorage.getItem('recipe_draft');
    if (draft && !id) {
      try {
        setFormData(JSON.parse(draft));
      } catch (e) {
        console.error('Error parsing draft:', e);
      }
    }
  }, [id]);

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
          });
          if (recipe.ingredients?.length > 0) {
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
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((formData.name || formData.description) && !id) {
        localStorage.setItem('recipe_draft', JSON.stringify(formData));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData, id]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Le nom est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Next = async () => {
    if (!validateStep1()) return;

    if (recipeId) {
      setCurrentStep(2);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/recipes', {
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category || undefined,
        portions: parseInt(formData.portions, 10) || 1,
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

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleAddIngredient = async () => {
    if (!selectedIngredient || !ingredientQuantity) return;

    setLoading(true);
    try {
      const ingredientPayload = {
        quantity: parseFloat(ingredientQuantity),
        unit: ingredientUnit,
        lossPercent: parseFloat(ingredientLoss) || 0,
      };

      if (selectedIngredient.type === 'custom') {
        ingredientPayload.customIngredientId = selectedIngredient.id;
      } else {
        ingredientPayload.baseIngredientId = selectedIngredient.id;
      }

      await api.post(`/recipes/${recipeId}/ingredients`, ingredientPayload);

      setIngredients([
        ...ingredients,
        {
          ...selectedIngredient,
          quantity: parseFloat(ingredientQuantity),
          unit: ingredientUnit,
          lossPercent: parseFloat(ingredientLoss) || 0,
        },
      ]);

      setSelectedIngredient(null);
      setIngredientQuantity('');
      setIngredientUnit('G');
      setIngredientLoss(0);
    } catch (err) {
      console.error('Error adding ingredient:', err);
      setError("Erreur lors de l'ajout de l'ingrédient");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveIngredient = async (index) => {
    const ingredientToRemove = ingredients[index];

    if (ingredientToRemove.id && recipeId) {
      setLoading(true);
      try {
        await api.delete(`/recipes/${recipeId}/ingredients/${ingredientToRemove.id}`);
      } catch (err) {
        console.error('Error removing ingredient:', err);
        setError("Erreur lors de la suppression de l'ingrédient");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }

    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleStep2Next = async () => {
    setLoading(true);
    setError('');

    try {
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

  const handleSave = () => {
    localStorage.removeItem('recipe_draft');
    navigate('/recipes');
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (loading && !formData.name) {
    return (
      <div className="min-h-screen bg-neutral-smoke flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button
              onClick={() => navigate('/recipes')}
              className="text-sm text-secondary hover:text-primary font-secondary mb-2 flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Retour aux recettes
            </button>
            <h1 className="text-3xl font-bold text-primary font-primary">
              {id ? 'Modifier la recette' : 'Nouvelle recette'}
            </h1>
          </div>
        </div>

        {/* Stepper */}
        <Card className="bg-neutral-50 border-neutral-200">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      currentStep >= step.id
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white border-neutral-300 text-secondary'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check size={18} />
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:block ${
                      currentStep >= step.id ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-0.5 rounded transition-colors ${
                        currentStep > step.id ? 'bg-primary' : 'bg-neutral-200'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Step 1: Informations */}
        {currentStep === 1 && (
          <Card>
            <h2 className="text-lg font-bold text-primary font-primary mb-6">Informations générales</h2>

            <div className="space-y-4">
              <Input
                label="Nom de la recette *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                placeholder="Ex: Croissant au beurre"
              />

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Description de la recette..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Catégorie"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: '', label: 'Sélectionner...' },
                    ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
                  ]}
                />

                <Input
                  label="Nombre de portions"
                  type="number"
                  value={formData.portions}
                  onChange={(e) => setFormData({ ...formData, portions: e.target.value })}
                  min="1"
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleStep1Next} disabled={loading} variant="primary">
                {loading ? 'Chargement...' : 'Suivant'} <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Ingrédients */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-bold text-primary font-primary mb-4">Ajouter un ingrédient</h2>

              <IngredientAutocomplete
                onSelect={handleIngredientSelect}
                placeholder="Rechercher un ingrédient..."
                clearOnSelect={false}
              />

              {selectedIngredient && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                  <p className="font-medium text-primary mb-3">{selectedIngredient.name}</p>

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Quantité"
                      type="number"
                      value={ingredientQuantity}
                      onChange={(e) => setIngredientQuantity(e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />

                    <Select
                      label="Unité"
                      value={ingredientUnit}
                      onChange={(e) => setIngredientUnit(e.target.value)}
                      options={[
                        { value: 'G', label: 'Grammes' },
                        { value: 'KG', label: 'Kg' },
                        { value: 'L', label: 'Litres' },
                        { value: 'ML', label: 'mL' },
                        { value: 'PIECE', label: 'Pièce(s)' },
                      ]}
                    />

                    <Input
                      label="Perte (%)"
                      type="number"
                      value={ingredientLoss}
                      onChange={(e) => setIngredientLoss(e.target.value)}
                      min="0"
                      max="100"
                      placeholder="0"
                    />
                  </div>

                  <Button onClick={handleAddIngredient} className="mt-4" disabled={loading} variant="primary">
                    Ajouter à la recette
                  </Button>
                </div>
              )}
            </Card>

            {ingredients.length > 0 && (
              <Card padding="p-0" className="overflow-hidden">
                <div className="p-4 border-b border-neutral-100">
                  <h3 className="font-bold text-primary">
                    Ingrédients ajoutés <Badge variant="secondary" className="ml-2">{ingredients.length}</Badge>
                  </h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingrédient</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Perte</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredients.map((ing, index) => (
                      <TableRow key={index} className="hover:bg-neutral-50">
                        <TableCell className="font-medium text-primary">{ing.name}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {ing.quantity} {ing.unit}
                        </TableCell>
                        <TableCell className="text-secondary text-sm">
                          {ing.lossPercent > 0 ? `${ing.lossPercent}%` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveIngredient(index)}
                            disabled={loading}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="secondary" onClick={handlePrevious}>
                <ArrowLeft size={16} className="mr-2" /> Précédent
              </Button>
              <Button onClick={handleStep2Next} disabled={loading || ingredients.length === 0} variant="primary">
                {loading ? 'Chargement...' : 'Suivant'} <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Révision */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Résumé */}
            <Card>
              <h2 className="text-lg font-bold text-primary font-primary mb-4">Résumé de la recette</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-secondary">Nom :</span> <span className="text-primary">{formData.name}</span></p>
                {formData.category && (
                  <p><span className="font-medium text-secondary">Catégorie :</span> <Badge variant="outline">{formData.category}</Badge></p>
                )}
                <p><span className="font-medium text-secondary">Portions :</span> <span className="text-primary">{formData.portions}</span></p>
                <p><span className="font-medium text-secondary">Ingrédients :</span> <span className="text-primary">{ingredients.length}</span></p>
              </div>
            </Card>

            {/* Allergènes */}
            <Card>
              <h3 className="font-bold text-primary mb-3">Allergènes détectés</h3>
              {allergens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen) => (
                    <Badge key={allergen} variant="danger">{allergen}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-sm">Aucun allergène détecté</p>
              )}
            </Card>

            {/* Coût */}
            {pricing && (
              <Card>
                <h3 className="font-bold text-primary mb-3">Coût de revient</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-secondary uppercase">Total</p>
                    <p className="text-xl font-bold text-primary">{pricing.totalCost?.toFixed(2)} €</p>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-secondary uppercase">Par 100g</p>
                    <p className="text-xl font-bold text-primary">{pricing.costPer100g?.toFixed(2)} €</p>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-secondary uppercase">Par portion</p>
                    <p className="text-xl font-bold text-primary">{pricing.costPerServing?.toFixed(2)} €</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Nutrition */}
            {nutrition?.per100g && (
              <Card>
                <h3 className="font-bold text-primary mb-3">Valeurs nutritionnelles (pour 100g)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-secondary">Énergie</p>
                    <p className="font-bold text-primary">{nutrition.per100g.energyKcal} kcal</p>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-secondary">Lipides</p>
                    <p className="font-bold text-primary">{nutrition.per100g.fats} g</p>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-secondary">Glucides</p>
                    <p className="font-bold text-primary">{nutrition.per100g.carbs} g</p>
                  </div>
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-secondary">Protéines</p>
                    <p className="font-bold text-primary">{nutrition.per100g.proteins} g</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="secondary" onClick={handlePrevious}>
                <ArrowLeft size={16} className="mr-2" /> Précédent
              </Button>
              <Button onClick={handleSave} variant="primary">
                <Check size={16} className="mr-2" /> Enregistrer la recette
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
