import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../lib/api';
import { Button } from '../components/ui/Button';

export default function LabelsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      const response = await api.get('/labels');
      setLabels(response.data);
    } catch (err) {
      console.error('Error loading labels:', err);
      setError('Erreur lors du chargement des étiquettes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (label) => {
    try {
      // Ouvrir l'URL de téléchargement dans un nouvel onglet
      window.open(label.url, '_blank');
    } catch (err) {
      console.error('Error downloading label:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/dashboard')} variant="secondary">
                Dashboard
              </Button>
              <Button onClick={() => navigate('/recipes')} variant="secondary">
                Mes Recettes
              </Button>
              <Button onClick={() => navigate('/labels')} variant="primary">
                Mes Étiquettes
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <Button onClick={logout} variant="secondary">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mes Étiquettes</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : labels.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune étiquette</h3>
            <p className="mt-2 text-gray-500">
              Vous n'avez pas encore généré d'étiquette. Allez sur une recette et cliquez sur "Générer étiquette".
            </p>
            <Button onClick={() => navigate('/recipes')} variant="primary" className="mt-4">
              Voir mes recettes
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labels.map((label) => (
              <div key={label.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {label.productName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(label.createdAt)}
                      </p>
                    </div>
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {label.template || 'default'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Format: {label.format || 'A4'}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => handleDownload(label)} variant="primary" className="flex-1">
                      Télécharger
                    </Button>
                    <Button onClick={() => window.open(label.url, '_blank')} variant="secondary">
                      Voir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
