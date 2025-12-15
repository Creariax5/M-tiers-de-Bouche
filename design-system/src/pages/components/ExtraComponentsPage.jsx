import React, { useState } from 'react';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import { useToast } from '../../components/ui/Toast';
import Loader from '../../components/ui/Loader';
import Switch from '../../components/ui/Switch';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import DatePicker from '../../components/ui/DatePicker';
import FileUpload from '../../components/ui/FileUpload';
import NutritionLabel from '../../components/ui/NutritionLabel';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ExtraComponentsPage = () => {
  const { addToast } = useToast();
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        title: "Succès",
        description: "Les modifications ont été enregistrées.",
        variant: "success"
      });
    }, 1500);
  };

  return (
    <div className="space-y-12 p-8">
      <header>
        <Breadcrumbs 
          items={[
            { label: 'Design System', href: '/' },
            { label: 'Composants', href: '/components' },
            { label: 'Extras' }
          ]} 
          className="mb-4"
        />
        <h1 className="font-primary text-4xl text-primary mb-4">Composants Avancés</h1>
        <p className="text-secondary text-lg">
          Éléments d'interface riches et composants métier spécifiques.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Navigation & Actions */}
        <Card title="Navigation & Actions">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-secondary mb-4">Dropdown Menu</h3>
              <div className="flex justify-between items-center bg-neutral-light p-4 rounded-lg">
                <span className="text-primary font-medium">Tarte au Citron</span>
                <Dropdown 
                  trigger={
                    <button className="p-2 hover:bg-white rounded-full transition-colors">
                      <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  }
                >
                  <DropdownItem onClick={() => addToast({ title: "Édition", description: "Mode édition activé" })}>
                    Modifier
                  </DropdownItem>
                  <DropdownItem onClick={() => addToast({ title: "Duplication", description: "Recette dupliquée" })}>
                    Dupliquer
                  </DropdownItem>
                  <DropdownItem danger onClick={() => addToast({ title: "Suppression", description: "Recette supprimée", variant: "error" })}>
                    Supprimer
                  </DropdownItem>
                </Dropdown>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-secondary mb-4">Switch & Loader</h3>
              <div className="flex items-center gap-8">
                <Switch 
                  label="Recette active" 
                  checked={switchEnabled} 
                  onChange={setSwitchEnabled} 
                />
                
                <div className="flex items-center gap-4">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? <Loader size="sm" /> : 'Sauvegarder'}
                  </Button>
                  {isLoading && <span className="text-sm text-secondary">Chargement...</span>}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Métier : Nutrition & Images */}
        <Card title="Composants Métier">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <DatePicker label="Date de fabrication" />
              <DatePicker label="DLUO" />
            </div>

            <FileUpload label="Photo du produit" />

            <div>
              <h3 className="text-sm font-bold text-secondary mb-4">Étiquette Nutritionnelle (INCO)</h3>
              <p className="text-sm text-secondary mb-2">Voir la page dédiée <a href="/components/nutrition" className="text-primary underline">Nutrition</a></p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExtraComponentsPage;
