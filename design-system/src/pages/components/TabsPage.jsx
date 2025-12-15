import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TabsPage = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-primary text-primary mb-2">Tabs</h1>
        <p className="text-secondary font-secondary">Navigation par onglets pour organiser le contenu.</p>
      </div>

      <Card title="Exemple Simple">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <p className="text-secondary">Gérez les informations de votre compte ici.</p>
            <div className="p-4 bg-neutral-light rounded-lg">Formulaire Compte...</div>
          </TabsContent>
          <TabsContent value="password">
            <p className="text-secondary">Changez votre mot de passe ici.</p>
          </TabsContent>
          <TabsContent value="preferences">
            <p className="text-secondary">Vos préférences d'affichage.</p>
          </TabsContent>
        </Tabs>
      </Card>

      <Card title="Exemple Fiche Recette">
        <Tabs defaultValue="ingredients">
          <TabsList>
            <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
            <TabsTrigger value="steps">Progression</TabsTrigger>
            <TabsTrigger value="costs">Coûts & Marges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingredients">
            <div className="p-4 border border-neutral-light rounded-lg bg-gray-50">
              <h3 className="font-bold text-primary mb-2">Liste des ingrédients</h3>
              <ul className="list-disc list-inside text-secondary">
                <li>Farine</li>
                <li>Sucre</li>
                <li>Oeufs</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="steps">
            <div className="p-4 border border-neutral-light rounded-lg bg-gray-50">
              <h3 className="font-bold text-primary mb-2">Étapes de préparation</h3>
              <ol className="list-decimal list-inside text-secondary">
                <li>Mélanger la farine et le sucre</li>
                <li>Ajouter les oeufs</li>
                <li>Cuire à 180°C</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="costs">
            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <span className="font-bold text-primary">Coût total matière</span>
              <span className="text-xl font-bold text-primary">12.50 €</span>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default TabsPage;
