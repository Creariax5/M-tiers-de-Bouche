import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { Button, Card, Badge, Alert, Loading, Logo, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';
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
  const [designVersion, setDesignVersion] = useState('v1');

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

  const renderIngredients = () => {
    if (designVersion === 'v2') {
      return (
        <Card padding="p-0" className="overflow-hidden border-t-4 border-t-primary">
          <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <Scale size={18} /> Ingrédients
            </h2>
            <Badge variant="secondary" className="text-xs">{recipe.ingredients?.length || 0} éléments</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50/50">
                <TableHead>Ingrédient</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Unité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                <TableRow key={index} className="hover:bg-neutral-50 transition-colors">
                  <TableCell className="font-medium text-primary">
                    {ing.baseIngredient?.name || ing.customIngredient?.name || ing.subRecipe?.name}
                    {ing.baseIngredient && <span className="ml-2 text-xs text-secondary bg-neutral-100 px-1.5 py-0.5 rounded">(base)</span>}
                  </TableCell>
                  <TableCell className="font-mono text-primary">{ing.quantity}</TableCell>
                  <TableCell className="text-secondary text-sm">{ing.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      );
    }

    if (designVersion === 'v3') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-6 pb-2">
            <h2 className="text-2xl font-primary text-primary mb-2">Ingrédients</h2>
            <div className="h-1 w-12 bg-accent-light rounded-full"></div>
          </div>
          <div className="p-2">
            <table className="w-full">
              <tbody>
                {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                  <tr key={index} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-primary">
                      {ing.baseIngredient?.name || ing.customIngredient?.name || ing.subRecipe?.name}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-primary w-24">
                      {ing.quantity} <span className="text-xs font-normal text-secondary ml-1">{ing.unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // V1 (Default)
    return (
      <div>
        <h2 className="text-xl font-primary text-primary mb-4">Ingrédients</h2>
        <Card padding="p-0" className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingrédient</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Unité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-primary">
                    {ing.baseIngredient?.name || ing.customIngredient?.name || ing.subRecipe?.name}
                    {ing.baseIngredient && <span className="ml-2 text-xs text-secondary">(base)</span>}
                  </TableCell>
                  <TableCell>{ing.quantity}</TableCell>
                  <TableCell>{ing.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  };

  const renderSteps = () => {
    const steps = getInstructions();
    if (steps.length === 0) return null;

    if (designVersion === 'v2') {
      return (
        <Card padding="p-0" className="overflow-hidden border-t-4 border-t-secondary">
          <div className="bg-neutral-50 p-4 border-b border-neutral-200">
            <h2 className="text-lg font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <ChefHat size={18} /> Progression
            </h2>
          </div>
          <div className="p-6 space-y-6 bg-white">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-100 text-primary border border-neutral-200 flex items-center justify-center font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm leading-relaxed pt-1.5 text-primary">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      );
    }

    if (designVersion === 'v3') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-2xl font-primary text-primary mb-2">Progression</h2>
          <div className="h-1 w-12 bg-secondary rounded-full mb-8"></div>
          
          <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-100">
            {steps.map((step, index) => (
              <div key={index} className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-secondary text-secondary flex items-center justify-center font-bold text-sm z-10">
                  {index + 1}
                </div>
                <p className="text-base leading-relaxed text-primary/80">{step}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // V1 (Default)
    return (
      <div>
        <h2 className="text-xl font-primary text-primary mb-4">Progression</h2>
        <Card>
          <div className="space-y-6 font-secondary text-secondary">
            {steps.map((step, index) => (
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
      </div>
    );
  };

  return (
    <PageContainer>
      {/* Design Switcher (Dev Only) */}
      <div className="fixed bottom-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-neutral-200 flex gap-2">
        <span className="text-xs font-bold uppercase text-secondary self-center mr-2">Design:</span>
        <button 
          onClick={() => setDesignVersion('v1')}
          className={`px-3 py-1 text-xs rounded ${designVersion === 'v1' ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
        >
          Classique
        </button>
        <button 
          onClick={() => setDesignVersion('v2')}
          className={`px-3 py-1 text-xs rounded ${designVersion === 'v2' ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
        >
          Intégré
        </button>
        <button 
          onClick={() => setDesignVersion('v3')}
          className={`px-3 py-1 text-xs rounded ${designVersion === 'v3' ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
        >
          Moderne
        </button>
      </div>

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
              {recipe.category && (
                <Badge className="bg-accent-light/20 text-accent-dark border border-accent-light/30">
                  {recipe.category}
                </Badge>
              )}
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
            {renderIngredients()}
            {renderSteps()}
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
