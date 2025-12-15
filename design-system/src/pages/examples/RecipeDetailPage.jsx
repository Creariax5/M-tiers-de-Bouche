import React from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Logo from '../../components/ui/Logo';

const RecipeDetailPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Bar / Breadcrumb */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-secondary font-secondary">
          Recettes / Pâtisserie / <span className="font-bold text-primary">Tarte au Citron Meringuée</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">Imprimer Étiquette</Button>
          <Button variant="primary" size="sm">Modifier</Button>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-grow">
          <h1 className="text-4xl font-primary text-primary mb-2">Tarte au Citron Meringuée</h1>
          <p className="text-secondary font-secondary text-lg">Classique de la pâtisserie française, équilibre parfait entre l'acidité du citron et la douceur de la meringue.</p>
          
          <div className="flex gap-4 mt-6">
            <Badge variant="secondary">Pâtisserie</Badge>
            <Badge variant="outline">Saison: Hiver</Badge>
            <Badge variant="warning">Allergènes: 3</Badge>
          </div>
        </div>
        
        {/* Key Stats */}
        <Card className="w-full md:w-64 bg-neutral-light border-none" padding="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-secondary uppercase tracking-wider mb-1">Coût</div>
              <div className="font-primary text-xl text-primary">2.45€</div>
            </div>
            <div>
              <div className="text-xs text-secondary uppercase tracking-wider mb-1">Marge</div>
              <div className="font-primary text-xl text-success">72%</div>
            </div>
            <div>
              <div className="text-xs text-secondary uppercase tracking-wider mb-1">Prix Vente</div>
              <div className="font-primary text-xl text-primary">4.20€</div>
            </div>
            <div>
              <div className="text-xs text-secondary uppercase tracking-wider mb-1">Portions</div>
              <div className="font-primary text-xl text-primary">8</div>
            </div>
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
                    <th className="px-4 py-3">Unité</th>
                    <th className="px-4 py-3 rounded-r-lg text-right">Coût</th>
                  </tr>
                </thead>
                <tbody className="font-secondary">
                  <tr className="border-b border-neutral-light">
                    <td className="px-4 py-3 font-medium text-primary">Pâte Sablée</td>
                    <td className="px-4 py-3">250</td>
                    <td className="px-4 py-3">g</td>
                    <td className="px-4 py-3 text-right">0.85€</td>
                  </tr>
                  <tr className="border-b border-neutral-light">
                    <td className="px-4 py-3 font-medium text-primary">Crème Citron</td>
                    <td className="px-4 py-3">400</td>
                    <td className="px-4 py-3">g</td>
                    <td className="px-4 py-3 text-right">1.20€</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-primary">Meringue Italienne</td>
                    <td className="px-4 py-3">150</td>
                    <td className="px-4 py-3">g</td>
                    <td className="px-4 py-3 text-right">0.40€</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Steps */}
          <Card>
            <h2 className="text-xl font-primary text-primary mb-6 border-b border-neutral-light pb-2">Progression</h2>
            <div className="space-y-6 font-secondary text-secondary">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-primary mb-1">Fonçage</h3>
                  <p className="text-sm leading-relaxed">Étaler la pâte sablée à 3mm. Foncer les cercles de 8cm. Laisser reposer au frais 30min.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-primary mb-1">Cuisson à blanc</h3>
                  <p className="text-sm leading-relaxed">Cuire à 160°C pendant 15-20 minutes jusqu'à coloration dorée.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-primary mb-1">Montage</h3>
                  <p className="text-sm leading-relaxed">Garnir les fonds de tarte refroidis avec la crème citron. Lisser à la palette.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Nutrition & Label Preview */}
        <div className="space-y-8">
          {/* Nutrition */}
          <Card className="bg-primary text-white">
            <h2 className="text-xl font-primary mb-6 border-b border-white/20 pb-2">Nutrition (100g)</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Énergie</span>
                <span className="font-bold text-xl">285 kcal</span>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-white/60 mb-1">Lipides</div>
                  <div className="font-bold">14g</div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Glucides</div>
                  <div className="font-bold">38g</div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Protéines</div>
                  <div className="font-bold">4.5g</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Label Preview */}
          <Card>
            <h2 className="text-xl font-primary text-primary mb-6 border-b border-neutral-light pb-2">Aperçu Étiquette</h2>
            <div className="border border-black p-4 rounded-sm bg-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Logo size="lg" variant="secondary" />
               </div>
               <h3 className="font-primary text-lg font-bold text-black mb-2">Tarte Citron Meringuée</h3>
               <p className="text-[10px] leading-tight mb-3 text-black">
                 <span className="font-bold">Ingrédients:</span> Sucre, <span className="font-bold">OEUFS</span>, Farine de <span className="font-bold">BLÉ</span>, Beurre (<span className="font-bold">LAIT</span>), Jus de citron (12%), Amandes en poudre (<span className="font-bold">FRUITS A COQUE</span>), Sel.
               </p>
               <div className="flex justify-between items-end text-[10px] font-bold border-t border-black pt-2 mt-2">
                 <div>
                   Poids net: 110g<br/>
                   A consommer jusqu'au: 14/12/2025
                 </div>
                 <div className="text-right">
                   REGAL - 12 Rue des Artisans<br/>
                   75001 Paris
                 </div>
               </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm">Télécharger PDF</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
