import React from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import NutritionLabel from '../../components/ui/NutritionLabel';
import ProductLabel from '../../components/ui/ProductLabel';
import Card from '../../components/ui/Card';

// Import logo if available, otherwise ProductLabel will use fallback
import logoTertiaire from '../../assets/logos/logo-tertiaire.svg';

const NutritionPage = () => {
  const sampleNutrition = {
    energyKj: 1340,
    energyKcal: 320,
    fat: 12,
    saturatedFat: 3.2,
    carbs: 48,
    sugars: 28.7,
    proteins: 4,
    salt: 0.15
  };

  return (
    <div className="space-y-12 p-8">
      <header>
        <Breadcrumbs 
          items={[
            { label: 'Design System', href: '/' },
            { label: 'Composants', href: '/components' },
            { label: 'Nutrition & Étiquettes' }
          ]} 
          className="mb-4"
        />
        <h1 className="font-primary text-4xl text-primary mb-4">Nutrition & Étiquettes</h1>
        <p className="text-secondary text-lg">
          Composants dédiés à l'affichage des informations légales et commerciales (INCO).
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Étiquette Produit (Design Image) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-primary text-primary">Étiquette Produit (Vitrine)</h2>
          <p className="text-secondary">
            Format carte pour l'affichage en vitrine ou sur les produits emballés. 
            Met en avant l'identité de marque et les informations essentielles.
          </p>
          
          <div className="bg-neutral-light/30 p-8 rounded-xl border border-neutral-light flex justify-center">
            <ProductLabel 
              title="Tarte aux Pommes"
              subtitle="Part individuelle"
              nutrition={sampleNutrition}
              allergens={['Gluten', 'Œufs', 'Lait']}
              conservation="3 jours au frais"
              weight="120g"
              logoSrc={logoTertiaire}
            />
          </div>

          <div className="bg-neutral-light/30 p-8 rounded-xl border border-neutral-light flex justify-center">
             <ProductLabel 
              title="Sandwich Parisien"
              subtitle="Jambon Beurre Cornichons"
              nutrition={{...sampleNutrition, energyKcal: 450, proteins: 18}}
              allergens={['Gluten', 'Lait', 'Moutarde']}
              conservation="Consommer immédiatement"
              weight="250g"
              isHomemade={true}
              isFresh={true}
            />
          </div>
        </section>

        {/* Tableau Nutritionnel (INCO Standard) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-primary text-primary">Tableau Nutritionnel (INCO)</h2>
          <p className="text-secondary">
            Format réglementaire strict (Règlement UE n°1169/2011) pour l'étiquetage technique.
            Doit respecter les tailles de police et l'ordre des nutriments.
          </p>

          <div className="bg-neutral-light/30 p-8 rounded-xl border border-neutral-light flex justify-center items-start">
            <NutritionLabel values={sampleNutrition} />
          </div>
        </section>

      </div>
    </div>
  );
};

export default NutritionPage;
