import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { Button, Card, Badge, Alert, Loading, Logo } from '../components/ui';
import { PageContainer } from '../components/layout';
import LabelGenerationModal from '../components/LabelGenerationModal';
import { Clock, Users, ChefHat, Scale, AlertTriangle, ArrowLeft, Edit, Tag, Printer } from 'lucide-react';

export default function RecipeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

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
      <div className="min-h-screen bg-neutral-smoke flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-neutral-smoke flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Alert variant="error" title="Erreur" className="mb-4">
            {error || 'Recette non trouvée'}
          </Alert>
          <Button onClick={() => navigate('/recipes')} variant="secondary">
            <ArrowLeft size={16} className="mr-2" /> Retour aux recettes
          </Button>
        </div>
      </div>
    );
  }

  // Helper pour parser les instructions
  const getInstructions = () => {
    if (!recipe.instructions) return [];
    return recipe.instructions.split('\n').filter(line => line.trim().length > 0);
  };

  // Helper pour estimer le poids si manquant
  const getEstimatedWeight = () => {
    if (recipe.yieldWeight) return recipe.yieldWeight;
    if (!recipe.ingredients) return 0;
    return recipe.ingredients.reduce((acc, ing) => acc + (Number(ing.quantity) || 0), 0);
  };

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Bar / Breadcrumb */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary font-secondary">
            <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/recipes')}>Recettes</span>
            {' / '}
            <span className="cursor-pointer hover:text-primary">{recipe.category || 'Général'}</span>
            {' / '}
            <span className="font-bold text-primary">{recipe.name}</span>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowLabelModal(true)} variant="outline" size="sm" className="flex items-center gap-2">
              <Printer size={16} /> Imprimer Étiquette
            </Button>
            <Button onClick={() => navigate(`/recipes/${id}/edit`)} variant="primary" size="sm" className="flex items-center gap-2">
              <Edit size={16} /> Modifier
            </Button>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-grow">
            <h1 className="text-4xl font-primary text-primary mb-2 capitalize">{recipe.name}</h1>
            {recipe.description && (
              <p className="text-secondary font-secondary text-lg mb-4">{recipe.description}</p>
            )}
            
            <div className="flex gap-4 mt-6">
              {recipe.category && <Badge variant="secondary">{recipe.category}</Badge>}
              {recipe.allergens && recipe.allergens.length > 0 && (
                <Badge variant="warning">Allergènes: {recipe.allergens.length}</Badge>
              )}
            </div>
          </div>
          
          {/* Key Stats */}
          <Card className="w-full md:w-64 bg-neutral-light border-none" padding="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-secondary uppercase tracking-wider mb-1">Portions</div>
                <div className="font-primary text-xl text-primary">{recipe.servings || 1}</div>
              </div>
              {recipe.preparationTime > 0 && (
                <div>
                  <div className="text-xs text-secondary uppercase tracking-wider mb-1">Préparation</div>
                  <div className="font-primary text-xl text-primary">{recipe.preparationTime} min</div>
                </div>
              )}
              {recipe.cookingTime > 0 && (
                <div>
                  <div className="text-xs text-secondary uppercase tracking-wider mb-1">Cuisson</div>
                  <div className="font-primary text-xl text-primary">{recipe.cookingTime} min</div>
                </div>
              )}
              {recipe.restingTime > 0 && (
                <div>
                  <div className="text-xs text-secondary uppercase tracking-wider mb-1">Repos</div>
                  <div className="font-primary text-xl text-primary">{recipe.restingTime} min</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Ingredients & Steps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <Card>
              <h2 className="text-xl font-primary text-primary mb-6 border-b border-neutral-light pb-2">Ingrédients</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-secondary uppercase bg-neutral-light">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Ingrédient</th>
                      <th className="px-4 py-3">Quantité</th>
                      <th className="px-4 py-3 rounded-r-lg">Unité</th>
                    </tr>
                  </thead>
                  <tbody className="font-secondary">
                    {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                      <tr key={index} className="border-b border-neutral-light last:border-none">
                        <td className="px-4 py-3 font-medium text-primary">
                          {ing.baseIngredient?.name || ing.customIngredient?.name || ing.subRecipe?.name}
                          {ing.baseIngredient && <span className="ml-2 text-xs text-secondary">(base)</span>}
                        </td>
                        <td className="px-4 py-3">{ing.quantity}</td>
                        <td className="px-4 py-3">{ing.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Steps */}
            {getInstructions().length > 0 && (
              <Card>
                <h2 className="text-xl font-primary text-primary mb-6 border-b border-neutral-light pb-2">Progression</h2>
                <div className="space-y-6 font-secondary text-secondary">
                  {getInstructions().map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm leading-relaxed pt-1">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Nutrition & Label Preview */}
          <div className="space-y-8">
            {/* Allergènes */}
            {recipe.allergens && recipe.allergens.length > 0 && (
              <Card className="p-6 border-red-100 bg-red-50/30 shadow-sm">
                <h2 className="text-xl font-bold text-red-800 font-primary mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} /> Allergènes
                </h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.allergens.map((allergen, index) => (
                    <Badge key={index} variant="danger" className="text-sm py-1 px-3">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Nutrition */}
            {recipe.nutrition && recipe.nutrition.per100g && (
              <Card className="bg-primary text-white">
                <h2 className="text-xl font-primary mb-6 border-b border-white/20 pb-2">Nutrition (100g)</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Énergie</span>
                    <span className="font-bold text-xl">{Math.round(recipe.nutrition.per100g.energyKcal)} kcal</span>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-white/60 mb-1">Lipides</div>
                      <div className="font-bold">{(recipe.nutrition.per100g.fat || 0).toFixed(1)}g</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">Glucides</div>
                      <div className="font-bold">{(recipe.nutrition.per100g.carbs || 0).toFixed(1)}g</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">Protéines</div>
                      <div className="font-bold">{(recipe.nutrition.per100g.proteins || 0).toFixed(1)}g</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Label Preview */}
            <Card>
              <h2 className="text-xl font-primary text-primary mb-6 border-b border-neutral-light pb-2">Aperçu Étiquette</h2>
              <div className="border border-black p-4 rounded-sm bg-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Logo size="lg" variant="secondary" />
                 </div>
                 <h3 className="font-primary text-lg font-bold text-black mb-2">{recipe.name}</h3>
                 <p className="text-[10px] leading-tight mb-3 text-black">
                   <span className="font-bold">Ingrédients:</span> {recipe.ingredients?.map(i => i.baseIngredient?.name || i.customIngredient?.name).join(', ')}.
                   {recipe.allergens && recipe.allergens.length > 0 && (
                     <span className="block mt-1">
                       <span className="font-bold">Allergènes:</span> {recipe.allergens.join(', ')}
                     </span>
                   )}
                 </p>
                 <div className="flex justify-between items-end text-[10px] font-bold border-t border-black pt-2 mt-2">
                   <div>
                     Poids net: {getEstimatedWeight()}g<br/>
                     A consommer jusqu'au: {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('fr-FR')}
                   </div>
                   <div className="text-right">
                     <img src="/logos/principal-couleur.svg" alt="REGAL" className="h-5 ml-auto mb-1" />
                     12 Rue des Artisans<br/>
                     75001 Paris
                   </div>
                 </div>
              </div>
              <div className="mt-4 text-center">
                <Button onClick={() => setShowLabelModal(true)} variant="ghost" size="sm">
                  <Printer size={16} className="mr-2" /> Configurer l'impression
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de génération d'étiquette */}
      <LabelGenerationModal
        recipe={recipe}
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
      />
    </PageContainer>
  );
}
