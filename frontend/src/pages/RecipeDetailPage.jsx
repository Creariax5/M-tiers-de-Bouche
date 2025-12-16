import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { Button, Card, Badge, Alert, Loading, ProductLabel } from '../components/ui';
import { PageContainer } from '../components/layout';
import LabelGenerationModal from '../components/LabelGenerationModal';
import { Clock, Users, ChefHat, Scale, AlertTriangle, ArrowLeft, Edit, Tag } from 'lucide-react';

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

  return (
    <PageContainer>
      {/* En-tête */}
      <Card className="p-6 mb-6 border-neutral-light shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-primary font-primary">{recipe.name}</h1>
              {recipe.category && (
                <Badge variant="primary">{recipe.category}</Badge>
              )}
            </div>
            {recipe.description && (
              <p className="text-secondary font-secondary text-lg">{recipe.description}</p>
            )}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={() => setShowLabelModal(true)} variant="secondary" className="flex-1 md:flex-none">
              <Tag size={16} className="mr-2" /> Étiquette
            </Button>
            <Button onClick={() => navigate(`/recipes/${id}/edit`)} variant="primary" className="flex-1 md:flex-none">
              <Edit size={16} className="mr-2" /> Modifier
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-neutral-smoke rounded-lg border border-neutral-light">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary uppercase tracking-wider font-bold">Portions</p>
              <p className="text-xl font-bold text-primary">{recipe.servings || 1}</p>
            </div>
          </div>
          
          {recipe.preparationTime > 0 && (
            <div className="flex items-center gap-3 p-3 bg-neutral-smoke rounded-lg border border-neutral-light">
              <div className="p-2 bg-gold/10 rounded-full text-gold">
                <ChefHat size={20} />
              </div>
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider font-bold">Préparation</p>
                <p className="text-xl font-bold text-primary">{recipe.preparationTime} min</p>
              </div>
            </div>
          )}
          
          {recipe.cookingTime > 0 && (
            <div className="flex items-center gap-3 p-3 bg-neutral-smoke rounded-lg border border-neutral-light">
              <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider font-bold">Cuisson</p>
                <p className="text-xl font-bold text-primary">{recipe.cookingTime} min</p>
              </div>
            </div>
          )}
          
          {recipe.restingTime > 0 && (
            <div className="flex items-center gap-3 p-3 bg-neutral-smoke rounded-lg border border-neutral-light">
              <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider font-bold">Repos</p>
                <p className="text-xl font-bold text-primary">{recipe.restingTime} min</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Gauche: Ingrédients */}
        <div className="lg:col-span-2 space-y-6">
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <Card className="p-6 border-neutral-light shadow-sm">
              <h2 className="text-xl font-bold text-primary font-primary mb-4 flex items-center gap-2">
                <Scale size={20} /> Ingrédients ({recipe.ingredients.length})
              </h2>
              <div className="space-y-3">
                {recipe.ingredients.map((ing, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-neutral-smoke rounded-lg border border-neutral-light hover:border-primary/30 transition-colors">
                    <div>
                      <span className="font-bold text-primary-dark">
                        {ing.baseIngredient?.name || ing.customIngredient?.name || ing.subRecipe?.name}
                      </span>
                      <div className="flex gap-2 mt-1">
                        {ing.baseIngredient && (
                          <Badge variant="info" size="sm">base</Badge>
                        )}
                        {ing.customIngredient && (
                          <Badge variant="success" size="sm">custom</Badge>
                        )}
                        {ing.subRecipe && (
                          <Badge variant="warning" size="sm">recette</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg text-primary">{ing.quantity}</span>
                      <span className="text-secondary ml-1">{ing.unit}</span>
                      {ing.lossPercent > 0 && (
                        <p className="text-xs text-red-500 font-medium">Perte {ing.lossPercent}%</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Colonne Droite: Allergènes & Nutrition */}
        <div className="space-y-6">
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

          {/* Informations nutritionnelles - Étiquette Produit (Vitrine) */}
          {recipe.nutrition && recipe.nutrition.per100g && (
            <div className="flex justify-center">
              <ProductLabel 
                title={recipe.name}
                subtitle={recipe.category}
                nutrition={{
                  energyKcal: recipe.nutrition.per100g.energyKcal || 0,
                  fat: recipe.nutrition.per100g.fat || 0,
                  carbs: recipe.nutrition.per100g.carbs || 0,
                  proteins: recipe.nutrition.per100g.proteins || 0
                }}
                allergens={recipe.allergens || []}
                conservation="À conserver au frais"
                weight={`${recipe.servings || 1} portion(s)`}
                isHomemade={true}
                isFresh={true}
                logoSrc="/logos/secondaire-couleur.svg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Boutons d'action bas de page */}
      <div className="mt-8 flex justify-start">
        <Button onClick={() => navigate('/recipes')} variant="ghost" className="text-secondary hover:text-primary">
          <ArrowLeft size={16} className="mr-2" /> Retour à la liste
        </Button>
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
