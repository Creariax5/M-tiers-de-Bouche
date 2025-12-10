import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { PageContainer } from '../components/layout';
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
    <PageContainer title="Ingrédients personnalisés">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Ingrédients personnalisés ({ingredients.length})
            </h2>
            <Button
              onClick={handleOpenCreate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + Nouvel ingrédient
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
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <p className="text-gray-500 mb-4">
                Aucun ingrédient personnalisé trouvé
              </p>
              <Button
                onClick={handleOpenCreate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer mon premier ingrédient
              </Button>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fournisseur
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ingredient.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {CATEGORIES.find(c => c.value === ingredient.category)?.label || ingredient.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ingredient.price ? `${ingredient.price.toFixed(2)} €/${ingredient.priceUnit}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ingredient.supplier || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleOpenEdit(ingredient)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(ingredient.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingId ? "Modifier l'ingrédient" : "Créer un ingrédient"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} role="dialog">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Prix (€)
                    </label>
                    <input
                      type="number"
                      id="price"
                      step="0.01"
                      min="0"
                      placeholder="ex: 5.50"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    />
                    {formErrors.price && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="priceUnit" className="block text-sm font-medium text-gray-700">
                      Par unité de
                    </label>
                    <select
                      id="priceUnit"
                      value={formData.priceUnit}
                      onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    >
                      <option value="KG">1 KG</option>
                      <option value="L">1 L</option>
                      <option value="PIECE">1 Pièce</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-500 -mt-3">Ex: 5.50 € par KG</p>

                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                    Fournisseur
                  </label>
                  <input
                    type="text"
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                {/* Section Valeurs Nutritionnelles */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Valeurs nutritionnelles (pour 100g)
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="calories" className="block text-xs font-medium text-gray-700">
                        Calories (kcal)
                      </label>
                      <input
                        type="number"
                        id="calories"
                        step="0.1"
                        min="0"
                        placeholder="ex: 350"
                        value={formData.calories}
                        onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-2 py-1 border"
                      />
                    </div>
                    <div>
                      <label htmlFor="proteins" className="block text-xs font-medium text-gray-700">
                        Protéines (g)
                      </label>
                      <input
                        type="number"
                        id="proteins"
                        step="0.1"
                        min="0"
                        placeholder="ex: 10.5"
                        value={formData.proteins}
                        onChange={(e) => setFormData({ ...formData, proteins: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-2 py-1 border"
                      />
                    </div>
                    <div>
                      <label htmlFor="carbs" className="block text-xs font-medium text-gray-700">
                        Glucides (g)
                      </label>
                      <input
                        type="number"
                        id="carbs"
                        step="0.1"
                        min="0"
                        placeholder="ex: 45.2"
                        value={formData.carbs}
                        onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-2 py-1 border"
                      />
                    </div>
                    <div>
                      <label htmlFor="fats" className="block text-xs font-medium text-gray-700">
                        Lipides (g)
                      </label>
                      <input
                        type="number"
                        id="fats"
                        step="0.1"
                        min="0"
                        placeholder="ex: 12.3"
                        value={formData.fats}
                        onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-2 py-1 border"
                      />
                    </div>
                    <div>
                      <label htmlFor="salt" className="block text-xs font-medium text-gray-700">
                        Sel (g)
                      </label>
                      <input
                        type="number"
                        id="salt"
                        step="0.01"
                        min="0"
                        placeholder="ex: 0.45"
                        value={formData.salt}
                        onChange={(e) => setFormData({ ...formData, salt: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-2 py-1 border"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Allergènes */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Allergènes (INCO)
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {ALLERGENS.map((allergen) => (
                      <label key={allergen.value} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.allergens.includes(allergen.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, allergens: [...formData.allergens, allergen.value] });
                            } else {
                              setFormData({ ...formData, allergens: formData.allergens.filter(a => a !== allergen.value) });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        {allergen.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingId ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
