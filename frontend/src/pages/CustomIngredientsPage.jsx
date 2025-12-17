import { useState, useEffect } from 'react';
import { Button, Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Select, Checkbox, Modal, Badge, EmptyState, Loading, Alert } from '../components/ui';
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

const emptyForm = {
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
};

export default function CustomIngredientsPage() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
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
    setFormData(emptyForm);
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
    if (!formData.name?.trim()) errors.name = 'Le nom est requis';
    if (formData.price && parseFloat(formData.price) < 0) errors.price = 'Le prix doit être positif';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : 0,
        priceUnit: formData.priceUnit,
        supplier: formData.supplier.trim() || null,
        calories: formData.calories ? parseFloat(formData.calories) : null,
        proteins: formData.proteins ? parseFloat(formData.proteins) : null,
        carbs: formData.carbs ? parseFloat(formData.carbs) : null,
        fats: formData.fats ? parseFloat(formData.fats) : null,
        salt: formData.salt ? parseFloat(formData.salt) : null,
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
    if (!window.confirm('Supprimer cet ingrédient ?')) return;
    try {
      await api.delete(`/ingredients/custom/${id}`);
      fetchIngredients();
    } catch (err) {
      console.error('Error deleting ingredient:', err);
      setError('Erreur lors de la suppression');
    }
  };

  const getCategoryLabel = (value) => CATEGORIES.find(c => c.value === value)?.label || value;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-smoke flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header Simple */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-primary">Mes Ingrédients</h1>
            <p className="text-secondary font-secondary mt-1">
              Gérez vos ingrédients personnalisés, leurs prix et valeurs nutritionnelles
            </p>
          </div>
          <Button onClick={handleOpenCreate} variant="primary">
            <Plus size={18} className="mr-2" /> Nouvel ingrédient
          </Button>
        </div>

        {error && (
          <Alert variant="error" title="Erreur">{error}</Alert>
        )}

        {/* Content */}
        {ingredients.length === 0 ? (
          <Card>
            <EmptyState
              icon="🧂"
              title="Aucun ingrédient personnalisé"
              description="Ajoutez vos propres ingrédients avec leurs prix, valeurs nutritionnelles et allergènes pour les utiliser dans vos recettes."
              action={
                <Button onClick={handleOpenCreate} variant="primary">
                  <Plus size={18} className="mr-2" /> Créer mon premier ingrédient
                </Button>
              }
            />
          </Card>
        ) : (
          <Card padding="p-0" className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrédient</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix / Unité</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Allergènes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ing) => (
                  <TableRow key={ing.id} className="hover:bg-neutral-50">
                    <TableCell className="font-medium text-primary">
                      {ing.name}
                      {ing.supplier && (
                        <div className="text-xs text-secondary font-normal mt-0.5">{ing.supplier}</div>
                      )}
                    </TableCell>
                    <TableCell>
                       <Badge variant="outline" className="text-xs font-normal text-secondary border-neutral-200">
                          {getCategoryLabel(ing.category)}
                       </Badge>
                    </TableCell>
                    <TableCell>
                      {ing.price ? (
                        <span className="font-mono text-sm text-primary">{ing.price.toFixed(2)} € / {ing.priceUnit}</span>
                      ) : (
                        <span className="text-secondary text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {ing.calories ? (
                        <span className="text-sm text-primary">{ing.calories} kcal</span>
                      ) : (
                        <span className="text-secondary text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {ing.allergens?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {ing.allergens.slice(0, 2).map((a, i) => (
                            <Badge key={i} variant="danger" className="text-[10px] py-0 px-1.5">
                              {ALLERGENS.find(al => al.value === a)?.label || a}
                            </Badge>
                          ))}
                          {ing.allergens.length > 2 && (
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                              +{ing.allergens.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-secondary text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(ing)} title="Modifier">
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(ing.id)}
                          className="text-red-600 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
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
        title={editingId ? "Modifier l'ingrédient" : "Nouvel ingrédient"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button onClick={handleSubmit} variant="primary">
              {editingId ? 'Enregistrer' : 'Créer'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Infos de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Nom de l'ingrédient *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={formErrors.name}
                placeholder="Ex: Farine T55"
              />
            </div>
            
            <Select
              label="Catégorie"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={CATEGORIES}
            />

            <Input
              label="Fournisseur (optionnel)"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Ex: Metro"
            />
          </div>

          {/* Prix */}
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
            <h3 className="text-sm font-bold text-primary mb-3">Prix</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prix HT"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                error={formErrors.price}
                placeholder="0.00"
              />
              <Select
                label="Unité"
                value={formData.priceUnit}
                onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                options={[
                  { value: 'KG', label: 'par Kg' },
                  { value: 'L', label: 'par Litre' },
                  { value: 'UNIT', label: 'par Unité' },
                ]}
              />
            </div>
          </div>

          {/* Nutrition */}
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
            <h3 className="text-sm font-bold text-primary mb-3">Valeurs nutritionnelles (pour 100g)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Input
                label="Kcal"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="0"
              />
              <Input
                label="Protéines"
                type="number"
                step="0.1"
                value={formData.proteins}
                onChange={(e) => setFormData({ ...formData, proteins: e.target.value })}
                placeholder="0g"
              />
              <Input
                label="Glucides"
                type="number"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                placeholder="0g"
              />
              <Input
                label="Lipides"
                type="number"
                step="0.1"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                placeholder="0g"
              />
              <Input
                label="Sel"
                type="number"
                step="0.01"
                value={formData.salt}
                onChange={(e) => setFormData({ ...formData, salt: e.target.value })}
                placeholder="0g"
              />
            </div>
          </div>

          {/* Allergènes */}
          <div>
            <h3 className="text-sm font-bold text-primary mb-3">Allergènes présents</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ALLERGENS.map((allergen) => (
                <div key={allergen.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergen-${allergen.value}`}
                    checked={formData.allergens.includes(allergen.value)}
                    onChange={(checked) => {
                      const newAllergens = checked
                        ? [...formData.allergens, allergen.value]
                        : formData.allergens.filter(a => a !== allergen.value);
                      setFormData({ ...formData, allergens: newAllergens });
                    }}
                  />
                  <label htmlFor={`allergen-${allergen.value}`} className="text-sm text-secondary cursor-pointer select-none">
                    {allergen.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
