import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { PageContainer } from '../../components/layout';
import { Card, Alert, Button, Logo } from '../../components/ui';
import { Loading } from '../../components/ui/Loading';
import api from '../../lib/api';
import { UtensilsCrossed, Tag, ChefHat, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalRecipes: 0 });
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [labelsCount, setLabelsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger stats, recettes, ingrédients et étiquettes en parallèle
        const [statsRes, recipesRes, ingredientsRes, labelsRes] = await Promise.all([
          api.get('/recipes/stats'),
          api.get('/recipes?limit=5'),
          api.get('/ingredients/custom'),
          api.get('/labels').catch(() => ({ data: [] }))
        ]);
        
        setStats(statsRes.data);
        setRecipes(recipesRes.data.recipes || []);
        setIngredients(ingredientsRes.data || []);
        setLabelsCount(labelsRes.data?.length || 0);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <PageContainer>
      <div className="space-y-8">
        {/* En-tête avec message de bienvenue */}
        <div className="bg-primary rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-primary font-bold mb-2">
            Bonjour {user?.firstName} 👋
          </h2>
          <p className="text-white/80 font-secondary text-lg">
            {user?.company || 'Bienvenue sur RÉGAL'}
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        {loading ? (
          <Loading fullPage text="Chargement..." />
        ) : (
          <>
            {/* Statistiques en grille - Utilise les alias du DS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recettes */}
              <Card 
                className="text-center cursor-pointer hover:shadow-lg transition-all group" 
                onClick={() => navigate('/recipes')}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <UtensilsCrossed size={32} className="text-primary group-hover:text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary font-primary mb-1">
                  {stats.totalRecipes}
                </div>
                <div className="text-sm text-secondary uppercase tracking-wider font-bold font-secondary">
                  Recettes
                </div>
              </Card>

              {/* Ingrédients */}
              <Card 
                className="text-center cursor-pointer hover:shadow-lg transition-all group" 
                onClick={() => navigate('/ingredients/custom')}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                    <ChefHat size={32} className="text-secondary group-hover:text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-secondary font-primary mb-1">
                  {ingredients.length}
                </div>
                <div className="text-sm text-secondary uppercase tracking-wider font-bold font-secondary">
                  Ingrédients
                </div>
              </Card>

              {/* Étiquettes */}
              <Card 
                className="text-center cursor-pointer hover:shadow-lg transition-all group" 
                onClick={() => navigate('/labels')}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <Tag size={32} className="text-accent group-hover:text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-accent font-primary mb-1">
                  {labelsCount}
                </div>
                <div className="text-sm text-secondary uppercase tracking-wider font-bold font-secondary">
                  Étiquettes
                </div>
              </Card>
            </div>

            {/* Grille deux colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dernières recettes */}
              <Card className="overflow-hidden" padding="p-0">
                <div className="px-6 py-4 border-b border-neutral-light">
                  <h3 className="text-lg font-bold text-primary font-primary">
                    Dernières recettes
                  </h3>
                </div>
                {recipes.length === 0 ? (
                  <div className="p-8 text-center text-secondary font-secondary">
                    <p className="mb-6">Aucune recette pour l'instant</p>
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/recipes/new')}
                    >
                      Créer ma première recette
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-neutral-light">
                    {recipes.map((recipe) => (
                      <li 
                        key={recipe.id} 
                        className="px-6 py-4 hover:bg-neutral-smoke cursor-pointer flex justify-between items-center group transition-colors"
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                      >
                        <div>
                          <p className="font-bold text-primary font-primary group-hover:text-secondary transition-colors">
                            {recipe.name}
                          </p>
                          <p className="text-sm text-accent mt-1 font-secondary">
                            {recipe.category || 'Sans catégorie'} • {recipe.servings || 1} portion(s)
                          </p>
                        </div>
                        <ArrowRight size={18} className="text-accent group-hover:text-primary transition-colors" />
                      </li>
                    ))}
                  </ul>
                )}
                {recipes.length > 0 && (
                  <div className="px-6 py-4 border-t border-neutral-light bg-neutral-smoke/50 flex justify-end">
                    <Button 
                      variant="ghost"
                      onClick={() => navigate('/recipes')}
                    >
                      Voir toutes les recettes <ArrowRight size={16} />
                    </Button>
                  </div>
                )}
              </Card>

              {/* Ingrédients personnalisés */}
              <Card className="overflow-hidden" padding="p-0">
                <div className="px-6 py-4 border-b border-neutral-light">
                  <h3 className="text-lg font-bold text-primary font-primary">
                    Mes ingrédients
                  </h3>
                </div>
                {ingredients.length === 0 ? (
                  <div className="p-8 text-center text-secondary font-secondary">
                    <p className="mb-6">Aucun ingrédient personnalisé</p>
                    <Button 
                      variant="secondary"
                      onClick={() => navigate('/ingredients/custom')}
                    >
                      Ajouter un ingrédient
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-neutral-light">
                    {ingredients.slice(0, 5).map((ingredient) => (
                      <li 
                        key={ingredient.id} 
                        className="px-6 py-4 hover:bg-neutral-smoke flex justify-between items-center font-secondary"
                      >
                        <div>
                          <p className="font-bold text-primary font-primary">{ingredient.name}</p>
                          <p className="text-sm text-accent mt-1">
                            {ingredient.price ? `${ingredient.price.toFixed(2)} €/${ingredient.priceUnit}` : 'Prix non défini'}
                            {ingredient.supplier && ` • ${ingredient.supplier}`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {ingredients.length > 0 && (
                  <div className="px-6 py-4 border-t border-neutral-light bg-neutral-smoke/50 flex justify-end">
                    <Button 
                      variant="ghost"
                      onClick={() => navigate('/ingredients/custom')}
                    >
                      Voir tous les ingrédients <ArrowRight size={16} />
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
