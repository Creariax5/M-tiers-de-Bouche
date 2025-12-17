import React, { useState, useEffect } from 'react';
import { Button, Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Select, Checkbox, Modal, Badge } from '../components/ui';
import { PageContainer } from '../components/layout';
import { Edit, Trash2, Plus } from 'lucide-react';
import api from '../lib/api';

const CATEGORIES = [
  { value: 'FARINES', label: 'Farines' },
  { value: 'SUCRES', label: 'Sucres' },
  { value: 'MATIERES_GRASSES', label: 'Matières grasses' },
  { value: 'PRODUITS_LAITIERS', label: 'Produits laitiers' },
  { value: 'OEUFS', label: 'Œufs' },
  { value: 'CHOCOLAT_CACAO', label: 'Chocolat & Cacao' },
  { value: 'FRUITS', label: 'Fruits' },
  { value: 'FRUITS_SECS', label: 'Fruits secs' },
  { value: 'EPICES', label: 'Épices' },
  { value: 'LEVURES', label: 'Levures' },
  { value: 'ADDITIFS', label: 'Additifs' },
  { value: 'AUTRE', label: 'Autre' },
];

const UNITS = ['KG', 'L', 'PIECE'];

const ALLERGENS = [
  { value: 'GLUTEN', label: 'Gluten' },
  { value: 'CRUSTACES', label: 'Crustacés' },
  { value: 'OEUFS', label: 'Œufs' },
  { value: 'POISSONS', label: 'Poissons' },
  { value: 'ARACHIDES', label: 'Arachides' },
  { value: 'SOJA', label: 'Soja' },
  { value: 'LAIT', label: 'Lait' },
  { value: 'FRUITS_A_COQUE', label: 'Fruits à coque' },
  { value: 'CELERI', label: 'Céleri' },
  { value: 'MOUTARDE', label: 'Moutarde' },
  { value: 'SESAME', label: 'Sésame' },
  { value: 'SULFITES', label: 'Sulfites' },
  { value: 'LUPIN', label: 'Lupin' },
  { value: 'MOLLUSQUES', label: 'Mollusques' },
];

export default function CustomIngredientsPage() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'AUTRE',
    price: '',
    priceUnit: 'KG',
    supplier: '',
    // Valeurs nutritionnelles (pour 100g)
    calories: '',
    proteins: '',
    carbs: '',
    fats: '',
    salt: '',
    // Allergènes
    allergens: [],
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/ingredients/custom');
      setIngredients(response.data || []);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      setError('Erreur de chargement des ingrédients');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'AUTRE',
      price: '',
      priceUnit: 'KG',
      supplier: '',
      calories: '',
      proteins: '',
      carbs: '',
      fats: '',
      salt: '',
      allergens: [],
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (ingredient) => {
    setEditingId(ingredient.id);
    setFormData({
      name: ingredient.name,
      category: ingredient.category,
      price: ingredient.price || '',
      priceUnit: ingredient.priceUnit,
      supplier: ingredient.supplier || '',
      calories: ingredient.calories || '',
      proteins: ingredient.proteins || '',
      carbs: ingredient.carbs || '',
      fats: ingredient.fats || '',
      salt: ingredient.salt || '',
      allergens: ingredient.allergens || [],
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name || formData.name.trim().length === 0) {
      errors.name = 'Le nom est requis';
    }

    if (formData.price && parseFloat(formData.price) <= 0) {
      errors.price = 'Le prix doit être positif';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : 0,
        priceUnit: formData.priceUnit,
        supplier: formData.supplier.trim() || null,
        // Valeurs nutritionnelles
        calories: formData.calories ? parseFloat(formData.calories) : null,
        proteins: formData.proteins ? parseFloat(formData.proteins) : null,
        carbs: formData.carbs ? parseFloat(formData.carbs) : null,
        fats: formData.fats ? parseFloat(formData.fats) : null,
        salt: formData.salt ? parseFloat(formData.salt) : null,
        // Allergènes
        allergens: formData.allergens.length > 0 ? formData.allergens : null,
      };

      if (editingId) {
        await api.put(`/ingredients/custom/${editingId}`, payload);
      } else {
        await api.post('/ingredients/custom', payload);
      }

      setShowModal(false);
      fetchIngredients();
    } catch (err) {
      console.error('Error saving ingredient:', err);
      setError('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient ?')) {
      return;
    }

    try {
      await api.delete(`/ingredients/custom/${id}`);
      fetchIngredients();
    } catch (err) {
      console.error('Error deleting ingredient:', err);
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary font-primary">
              Ingrédients personnalisés
            </h2>
            <p className="text-secondary mt-1 font-secondary">
              {ingredients.length} ingrédient{ingredients.length > 1 ? 's' : ''} personnalisé{ingredients.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="flex items-center gap-2">
            <Plus size={20} /> Nouvel ingrédient
          </Button>
        </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des ingrédients...</p>
            </div>
          ) : ingredients.length === 0 ? (
            <div className="bg-white shadow rounded-3xl p-12 text-center border border-neutral-light">
              <p className="text-secondary mb-4 font-secondary">
                Aucun ingrédient personnalisé trouvé
              </p>
              <Button onClick={handleOpenCreate}>
                Créer mon premier ingrédient
              </Button>
            </div>
          ) : (
            <Card padding="p-0" className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell className="font-medium text-gray-900">
                        {ingredient.name}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-accent-light/20 text-accent-dark border border-accent-light/30">
                          {CATEGORIES.find(c => c.value === ingredient.category)?.label || ingredient.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {ingredient.price ? `${ingredient.price.toFixed(2)} €/${ingredient.priceUnit}` : '-'}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {ingredient.supplier || '-'}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(ingredient)}
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(ingredient.id)}
                          className="text-red-600 hover:text-red-900 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Modifier l'ingrédient" : "Créer un ingrédient"}
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? 'Enregistrer' : 'Créer'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom *"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <Select
            label="Catégorie"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={CATEGORIES}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prix (€)"
              type="number"
              id="price"
              step="0.01"
              min="0"
              placeholder="ex: 5.50"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={formErrors.price}
            />

            <Select
              label="Par unité de"
              id="priceUnit"
              value={formData.priceUnit}
              onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
              options={[
                { value: 'KG', label: '1 KG' },
                { value: 'L', label: '1 L' },
                { value: 'PIECE', label: '1 Pièce' }
              ]}
            />
          </div>
          <p className="text-xs text-gray-500 -mt-3">Ex: 5.50 € par KG</p>

          <Input
            label="Fournisseur"
            id="supplier"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          />

          {/* Section Valeurs Nutritionnelles */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Valeurs nutritionnelles (pour 100g)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Calories (kcal)"
                type="number"
                id="calories"
                step="0.1"
                min="0"
                placeholder="ex: 350"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              />
              <Input
                label="Protéines (g)"
                type="number"
                id="proteins"
                step="0.1"
                min="0"
                placeholder="ex: 10.5"
                value={formData.proteins}
                onChange={(e) => setFormData({ ...formData, proteins: e.target.value })}
              />
              <Input
                label="Glucides (g)"
                type="number"
                id="carbs"
                step="0.1"
                min="0"
                placeholder="ex: 45.2"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
              />
              <Input
                label="Lipides (g)"
                type="number"
                id="fats"
                step="0.1"
                min="0"
                placeholder="ex: 12.3"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
              />
              <Input
                label="Sel (g)"
                type="number"
                id="salt"
                step="0.01"
                min="0"
                placeholder="ex: 0.45"
                value={formData.salt}
                onChange={(e) => setFormData({ ...formData, salt: e.target.value })}
              />
            </div>
          </div>

          {/* Section Allergènes */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Allergènes (INCO)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {ALLERGENS.map((allergen) => (
                <Checkbox
                  key={allergen.value}
                  id={`allergen-${allergen.value}`}
                  label={allergen.label}
                  checked={formData.allergens.includes(allergen.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setFormData({ ...formData, allergens: [...formData.allergens, allergen.value] });
                    } else {
                      setFormData({ ...formData, allergens: formData.allergens.filter(a => a !== allergen.value) });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
