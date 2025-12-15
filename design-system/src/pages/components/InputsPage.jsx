import React from 'react';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const InputsPage = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-primary text-4xl text-primary mb-4">Inputs & Formulaires</h1>
        <p className="text-secondary text-lg">
          Composants de saisie : Input, Textarea, Select et Checkbox.
        </p>
      </header>

      <section className="space-y-8">
        <Card title="Champs de Texte (Input & Textarea)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Input 
                label="Nom du produit" 
                placeholder="Ex: Croissant au beurre" 
              />
              <Input 
                label="Prix de vente" 
                type="number" 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-6">
              <Textarea 
                label="Description" 
                placeholder="Description détaillée de la recette..." 
              />
            </div>
          </div>
        </Card>

        <Card title="Sélection & Options">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Select 
                label="Catégorie" 
                options={[
                  { label: 'Pâtisserie', value: 'patisserie' },
                  { label: 'Viennoiserie', value: 'viennoiserie' },
                  { label: 'Traiteur', value: 'traiteur' },
                ]} 
              />
              <Select 
                label="Unité" 
                options={[
                  { label: 'Kilogrammes (kg)', value: 'kg' },
                  { label: 'Litres (L)', value: 'l' },
                  { label: 'Pièces (pce)', value: 'pce' },
                ]} 
              />
            </div>
            <div className="space-y-4 pt-6">
              <h3 className="text-sm font-bold text-secondary font-secondary mb-2">Options</h3>
              <Checkbox label="Recette active" defaultChecked />
              <Checkbox label="Ingrédient allergène" />
              <Checkbox label="Stock critique" error />
            </div>
          </div>
        </Card>

        <Card title="États Spéciaux">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              label="Erreur" 
              defaultValue="Valeur invalide"
              error="Ce champ est requis" 
            />
            <Input 
              label="Désactivé" 
              defaultValue="Non modifiable"
              disabled 
            />
            <Select 
              label="Select Désactivé" 
              disabled
              options={[{ label: 'Option 1', value: '1' }]} 
            />
          </div>
        </Card>

        <Card title="Exemple de Formulaire">
           <div className="max-w-md mx-auto space-y-4 p-6 border border-neutral-light rounded-xl">
              <h3 className="text-lg font-primary text-primary mb-4">Connexion</h3>
              <Input label="Email" type="email" placeholder="contact@regal.fr" />
              <Input label="Mot de passe" type="password" placeholder="••••••••" />
              <Button className="w-full">Se connecter</Button>
           </div>
        </Card>
      </section>
    </div>
  );
};

export default InputsPage;
