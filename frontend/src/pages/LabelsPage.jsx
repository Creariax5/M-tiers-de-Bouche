import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button, Card, Alert } from '../components/ui';
import { Loading } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { PageContainer } from '../components/layout';
import { FileText, Download, Eye, Trash2 } from 'lucide-react';

export default function LabelsPage() {
  const navigate = useNavigate();
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
      window.open(label.url, '_blank');
    } catch (err) {
      console.error('Error downloading label:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette étiquette ?')) {
      return;
    }
    try {
      await api.delete(`/labels/${id}`);
      setLabels(labels.filter(l => l.id !== id));
    } catch (err) {
      console.error('Error deleting label:', err);
      setError('Erreur lors de la suppression de l\'étiquette');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-smoke flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold font-primary text-primary">
              Mes étiquettes
            </h2>
            <p className="text-secondary mt-1 font-secondary">
              {labels.length} étiquette{labels.length > 1 ? 's' : ''} générée{labels.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="error" title="Erreur">
            {error}
          </Alert>
        )}

        {labels.length === 0 ? (
          <Card>
            <EmptyState
              icon="🏷️"
              title="Aucune étiquette générée"
              description="Créez vos premières étiquettes INCO conformes à partir de vos recettes en un clic."
              action={
                <Button onClick={() => navigate('/recipes')} variant="primary">
                  <FileText size={18} /> Voir mes recettes
                </Button>
              }
            />
          </Card>
        ) : (
          <Card noPadding className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-medium">
                <thead className="bg-neutral-light">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark uppercase tracking-wider font-secondary">
                      Produit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark uppercase tracking-wider font-secondary">
                      Format
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark uppercase tracking-wider font-secondary">
                      Date création
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-neutral-dark uppercase tracking-wider font-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-medium">
                  {labels.map((label) => (
                    <tr key={label.id} className="hover:bg-neutral-light/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <FileText size={20} className="text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-primary font-primary">
                              {label.productName}
                            </div>
                            {label.template && (
                              <div className="text-xs text-secondary font-secondary">
                                {label.template}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent-light/20 text-accent-dark border border-accent-light/30">
                          {label.format || 'A4'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary font-secondary">
                        {formatDate(label.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => window.open(label.url, '_blank')}
                          className="text-secondary hover:text-primary transition-colors p-1"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(label)}
                          className="text-secondary hover:text-primary transition-colors p-1"
                          title="Télécharger"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(label.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
