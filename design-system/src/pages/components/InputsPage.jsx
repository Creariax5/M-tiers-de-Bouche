import React from 'react';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const InputsPage = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-primary text-4xl text-primary mb-4">Inputs</h1>
        <p className="text-secondary text-lg">
          Champs de saisie pour collecter les données utilisateur.
        </p>
      </header>

      <section className="space-y-8">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Standard Inputs */}
            <div className="space-y-6">
              <h2 className="font-primary text-xl text-primary border-b border-neutral-light pb-2">États Standards</h2>
              
              <Input 
                label="Nom du produit" 
                placeholder="Ex: Croissant au beurre" 
              />
              
              <Input 
                label="Prix de vente" 
                type="number" 
                placeholder="0.00" 
              />

              <Input 
                label="Description" 
                placeholder="Description détaillée..." 
              />
            </div>

            {/* Special States */}
            <div className="space-y-6">
              <h2 className="font-primary text-xl text-primary border-b border-neutral-light pb-2">États Spéciaux</h2>
              
              <Input 
                label="Champ avec erreur" 
                defaultValue="Valeur invalide"
                error="Ce champ est requis" 
              />
              
              <Input 
                label="Champ désactivé" 
                defaultValue="Lecture seule"
                disabled 
              />

              <div className="pt-4">
                <h3 className="text-sm font-bold text-secondary mb-2">Exemple de Formulaire</h3>
                <div className="space-y-4 bg-neutral-light p-4 rounded-xl">
                  <Input label="Email" type="email" placeholder="contact@regal.fr" className="bg-white" />
                  <Input label="Mot de passe" type="password" placeholder="••••••••" className="bg-white" />
                  <Button className="w-full">Se connecter</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default InputsPage;
