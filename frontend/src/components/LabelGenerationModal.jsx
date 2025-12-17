import { useState } from 'react';
import { Button } from './ui';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';

const TEMPLATES = [
  { value: 'default', label: 'Standard' },
  { value: 'classic', label: 'Classique' },
  { value: 'modern', label: 'Moderne' },
  { value: 'minimalist', label: 'Minimaliste' },
];

const FORMATS = [
  { value: 'A4', label: 'A4' },
  { value: '70x50', label: 'Étiquette 70x50mm' },
  { value: '50x30', label: 'Étiquette 50x30mm' },
  { value: '40x30', label: 'Étiquette 40x30mm' },
];

export default function LabelGenerationModal({ recipe, isOpen, onClose }) {
  const [template, setTemplate] = useState('default');
  const [format, setFormat] = useState('A4');
  const [dlc, setDlc] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [storage, setStorage] = useState('Conserver au frais');
  const [manufacturer, setManufacturer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewHtml, setPreviewHtml] = useState(null);

  if (!isOpen) return null;

  const getLabelData = () => ({
    productName: recipe.name,
    template,
    format,
    ingredients: recipe.ingredients?.map(ing => ({
      name: ing.baseIngredient?.name || ing.customIngredient?.name || ing.subRecipe?.name || 'Inconnu',
      quantity: ing.quantity || 0,
      unit: ing.unit || 'g',
      isAllergen: recipe.allergens?.some(a => 
        (ing.baseIngredient?.allergens || []).includes(a)
      ) || false,
      allergens: ing.baseIngredient?.allergens || []
    })) || [],
    nutrition: recipe.nutrition?.per100g ? {
      energy: recipe.nutrition.per100g.energyKj || 0,
      energyKcal: recipe.nutrition.per100g.energyKcal || 0,
      fat: recipe.nutrition.per100g.fats || 0,
      saturatedFat: recipe.nutrition.per100g.saturatedFats || 0,
      carbs: recipe.nutrition.per100g.carbs || 0,
      sugars: recipe.nutrition.per100g.sugars || 0,
      proteins: recipe.nutrition.per100g.proteins || 0,
      salt: recipe.nutrition.per100g.salt || 0
    } : {},
    mentions: {
      dlc: dlc || 'À définir',
      netWeight: netWeight || (recipe.nutrition?.totalWeight ? `${recipe.nutrition.totalWeight}g` : 'N/A'),
      storage: storage || 'Conserver au frais',
      manufacturer: manufacturer || 'Mon Entreprise'
    }
  });

  const handlePreview = async () => {
    setLoading(true);
    setError('');
    setPreviewHtml(null);

    try {
      const response = await api.post('/labels/preview', getLabelData());
      setPreviewHtml(response.data);
    } catch (err) {
      console.error('Error generating preview:', err);
      setError(err.response?.data?.error || 'Erreur lors de la prévisualisation');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/labels/generate', getLabelData(), {
        headers: { Accept: 'application/json' }
      });

      if (response.data.fileName) {
        const token = useAuthStore.getState().token;
        const viewUrl = `/api/labels/view/${response.data.fileName}?token=${token}`;
        
        // Télécharger le PDF en blob
        const pdfResponse = await api.get(viewUrl.replace('/api', ''), {
          responseType: 'blob'
        });
        
        const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `etiquette-${recipe.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        link.click();
        
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error downloading label:', err);
      setError(err.response?.data?.error || 'Erreur lors du téléchargement');
    } finally {
      setLoading(false);
    }
  };



  const handleClose = () => {
    setPreviewHtml(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Générer une étiquette</h2>
          <button onClick={handleClose} className="text-white hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Options */}
          <div className="md:w-1/2 w-full p-6 border-r border-gray-200 overflow-y-auto max-h-[70vh] flex-shrink-0">
            <h3 className="font-semibold text-gray-700 mb-4">Configuration</h3>

            {/* Template */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              >
                {TEMPLATES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Format */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <hr className="my-4" />
            <h3 className="font-semibold text-gray-700 mb-4">Mentions obligatoires</h3>

            {/* DLC */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date limite de consommation (DLC)</label>
              <input
                type="date"
                value={dlc}
                onChange={(e) => setDlc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Poids net */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Poids net</label>
              <input
                type="text"
                value={netWeight}
                onChange={(e) => setNetWeight(e.target.value)}
                placeholder={recipe.nutrition?.totalWeight ? `${recipe.nutrition.totalWeight}g` : 'Ex: 250g'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Conservation */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Conditions de conservation</label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="Ex: Conserver au frais entre 0°C et +4°C"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Fabricant */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom et adresse du fabricant</label>
              <textarea
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Ex: Ma Boulangerie, 12 rue du Pain, 75001 Paris"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button onClick={handlePreview} disabled={loading} variant="primary" className="w-full">
              {loading ? 'Génération en cours...' : 'Prévisualiser'}
            </Button>
          </div>

          {/* Preview */}
          <div className="md:w-1/2 w-full p-6 bg-gray-50 overflow-y-auto max-h-[70vh] flex-shrink-0">
            <h3 className="font-semibold text-gray-700 mb-4">Aperçu</h3>
            
            {previewHtml ? (
              <div>
                <div 
                  className="w-full h-96 border border-gray-300 rounded-lg overflow-auto bg-white p-4"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
                <div className="mt-4 flex gap-2">
                  <Button onClick={handleDownload} variant="primary" className="flex-1">
                    Télécharger PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">Cliquez sur "Prévisualiser" pour voir l'aperçu</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
