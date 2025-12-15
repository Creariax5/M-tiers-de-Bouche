import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const ModalsPage = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-primary text-primary mb-2">Modals</h1>
        <p className="text-secondary font-secondary">Fenêtres modales pour les actions importantes ou les formulaires.</p>
      </div>

      <Card title="Exemples">
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setIsBasicOpen(true)}>
            Modale Simple
          </Button>
          
          <Button variant="outline" onClick={() => setIsFormOpen(true)}>
            Modale Formulaire
          </Button>
          
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setIsDeleteOpen(true)}>
            Modale Danger
          </Button>
        </div>
      </Card>

      {/* Basic Modal */}
      <Modal
        isOpen={isBasicOpen}
        onClose={() => setIsBasicOpen(false)}
        title="Information Recette"
        footer={
          <Button onClick={() => setIsBasicOpen(false)}>Fermer</Button>
        }
      >
        <p>Ceci est une modale d'information standard.</p>
        <p className="mt-2">Elle se superpose au contenu et bloque l'interaction avec l'arrière-plan.</p>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Nouvel Ingrédient"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
            <Button onClick={() => setIsFormOpen(false)}>Enregistrer</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nom de l'ingrédient" placeholder="Ex: Farine T55" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prix (€)" type="number" placeholder="0.00" />
            <Input label="Unité" placeholder="kg, L, pièce..." />
          </div>
          <Input label="Fournisseur" placeholder="Nom du fournisseur" />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Supprimer la recette ?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setIsDeleteOpen(false)}>Supprimer définitivement</Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900">Êtes-vous sûr de vouloir supprimer cette recette ?</p>
            <p className="text-sm text-gray-500 mt-1">Cette action est irréversible. Toutes les données associées seront perdues.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalsPage;
