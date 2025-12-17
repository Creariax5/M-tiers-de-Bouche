import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { Button, Card, Badge, Alert, Loading, Logo, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';
import { PageContainer } from '../components/layout';
import LabelGenerationModal from '../components/LabelGenerationModal';
import { Clock, Users, ChefHat, AlertTriangle, ArrowLeft, Edit, Printer, Flame, CheckCircle } from 'lucide-react';

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

  const getInstructions = () => {
    if (!recipe.instructions) return [];
    return recipe.instructions.split('\n').filter(line => line.trim().length > 0);
  };

  const getEstimatedWeight = () => {
    if (recipe.yieldWeight) return recipe.yieldWeight;
    if (!recipe.ingredients) return 0;
    return recipe.ingredients.reduce((acc, ing) => acc + (Number(ing.quantity) || 0), 0);
  };

  const getTotalTime = () => (recipe.preparationTime || 0) + (recipe.cookingTime || 0) + (recipe.restingTime || 0);

  const isRecipeComplete = () => {
    return recipe.ingredients?.length > 0 && 
           recipe.instructions && 
           recipe.servings > 0;
  };

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-secondary font-secondary">
            <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/recipes')}>← Recettes</span>
            <span className="mx-2">/</span>
            <span>{recipe.category || 'Général'}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowLabelModal(true)} variant="primary" size="sm" className="flex items-center gap-2">
              <Printer size={16} /> Imprimer Étiquette
            </Button>
            <Button onClick={() => navigate(`/recipes/${id}/edit`)} variant="outline" size="sm" className="flex items-center gap-2">
              <Edit size={16} /> Modifier
            </Button>
          </div>
        </div>

        {/* Hero Header */}
        <Card className="overflow-hidden" padding="p-0">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-primary mb-2 capitalize">{recipe.name}</h1>
                {recipe.description && (
                  <p className="text-white/80 font-secondary max-w-xl">{recipe.description}</p>
                )}
              </div>
              {isRecipeComplete() ? (
                <Badge className="bg-white/20 text-white border-white/30 flex items-center gap-1">
                  <CheckCircle size={14} /> Complète
                </Badge>
              ) : (
                <Badge className="bg-orange-500/80 text-white border-orange-400">Brouillon</Badge>
              )}
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="bg-neutral-50 px-6 py-4 flex flex-wrap gap-6 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <span className="font-bold text-primary">{recipe.servings || 1}</span>
              <span className="text-sm text-secondary">portions</span>
            </div>
            {recipe.preparationTime > 0 && (
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                <span className="font-bold text-primary">{recipe.preparationTime}</span>
                <span className="text-sm text-secondary">min prépa</span>
              </div>
            )}
            {recipe.cookingTime > 0 && (
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-primary" />
                <span className="font-bold text-primary">{recipe.cookingTime}</span>
                <span className="text-sm text-secondary">min cuisson</span>
              </div>
            )}
            {getTotalTime() > 0 && (
              <div className="flex items-center gap-2 ml-auto text-secondary">
                <span className="text-sm">Total:</span>
                <span className="font-bold text-primary">{getTotalTime()} min</span>
              </div>
            )}
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Ingredients & Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Ingrédients */}
            <div>
              <h2 className="text-xl font-primary text-primary mb-4 flex items-center gap-2">
                Ingrédients
                <Badge variant="secondary" className="text-xs">{recipe.ingredients?.length || 0}</Badge>
              </h2>
              <Card padding="p-0" className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingrédient</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead>Unité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                      <TableRow key={index} className="hover:bg-neutral-50">
                        <TableCell className="font-medium text-primary">
                          {ing.baseIngredient?.name || ing.customIngredient?.name || ing.subRecipe?.name}
                          {ing.baseIngredient && <span className="ml-2 text-xs text-secondary">(CIQUAL)</span>}
                          {ing.customIngredient && <span className="ml-2 text-xs text-accent-dark">(perso)</span>}
                        </TableCell>
                        <TableCell className="text-right font-mono">{ing.quantity}</TableCell>
                        <TableCell className="text-secondary">{ing.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Progression */}
            {getInstructions().length > 0 && (
              <div>
                <h2 className="text-xl font-primary text-primary mb-4 flex items-center gap-2">
                  <ChefHat size={20} /> Progression
                </h2>
                <Card>
                  <div className="space-y-4">
                    {getInstructions().map((step, index) => (
                      <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <p className="text-secondary leading-relaxed pt-1 flex-grow">{step}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            
            {/* Allergènes - EN PREMIER (conformité INCO) */}
            {recipe.allergens && recipe.allergens.length > 0 && (
              <Card className="border-red-200 bg-red-50/50">
                <h2 className="text-lg font-bold text-red-800 font-primary mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} /> Allergènes
                </h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.allergens.map((allergen, index) => (
                    <Badge key={index} variant="danger" className="text-sm">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Nutrition */}
            {recipe.nutrition && recipe.nutrition.per100g && (
              <Card className="bg-primary text-white">
                <h2 className="text-lg font-primary mb-4 pb-2 border-b border-white/20">
                  Nutrition /100g
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Énergie</span>
                    <span className="font-bold text-2xl">{Math.round(recipe.nutrition.per100g.energyKcal)} kcal</span>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/10 rounded p-2">
                      <div className="font-bold">{(recipe.nutrition.per100g.fat || 0).toFixed(1)}g</div>
                      <div className="text-xs text-white/60">Lipides</div>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <div className="font-bold">{(recipe.nutrition.per100g.carbs || 0).toFixed(1)}g</div>
                      <div className="text-xs text-white/60">Glucides</div>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <div className="font-bold">{(recipe.nutrition.per100g.proteins || 0).toFixed(1)}g</div>
                      <div className="text-xs text-white/60">Protéines</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Aperçu Étiquette */}
            <Card>
              <h2 className="text-lg font-primary text-primary mb-4 pb-2 border-b border-neutral-100">
                Aperçu Étiquette
              </h2>
              <div className="border-2 border-dashed border-neutral-200 p-4 rounded bg-white relative">
                <div className="absolute top-2 right-2 opacity-10">
                  <Logo size="md" variant="secondary" />
                </div>
                <h3 className="font-primary font-bold text-primary text-sm mb-2">{recipe.name}</h3>
                <p className="text-[9px] leading-tight text-secondary mb-2 line-clamp-3">
                  <span className="font-bold">Ingrédients:</span> {recipe.ingredients?.map(i => i.baseIngredient?.name || i.customIngredient?.name).filter(Boolean).join(', ')}.
                </p>
                {recipe.allergens && recipe.allergens.length > 0 && (
                  <p className="text-[9px] text-red-700 font-bold mb-2">
                    Allergènes: {recipe.allergens.join(', ')}
                  </p>
                )}
                <div className="flex justify-between text-[8px] text-secondary pt-2 border-t border-neutral-100">
                  <span>Poids: {getEstimatedWeight()}g</span>
                  <span>DLC: {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <Button onClick={() => setShowLabelModal(true)} variant="primary" className="w-full mt-4">
                <Printer size={16} className="mr-2" /> Générer l'étiquette
              </Button>
            </Card>

          </div>
        </div>
      </div>

      {/* Modal */}
      <LabelGenerationModal
        recipe={recipe}
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
      />
    </PageContainer>
  );
}
