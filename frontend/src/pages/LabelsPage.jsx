import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button, Card, Badge, Alert } from '../components/ui';
import { Loading } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { PageContainer } from '../components/layout';
import { FileText, Download, ExternalLink, Calendar, Tag } from 'lucide-react';

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-primary mb-2">
          Mes Étiquettes INCO
        </h1>
        <p className="text-secondary font-secondary">
          {labels.length} étiquette{labels.length > 1 ? 's' : ''} générée{labels.length > 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Erreur" className="mb-6">
          {error}
        </Alert>
      )}

      {labels.length === 0 ? (
        <Card className="py-12">
          <EmptyState
            icon="🏷️"
            title="Aucune étiquette"
            description="Vous n'avez pas encore généré d'étiquette. Allez sur une recette et cliquez sur 'Générer étiquette'."
            action={
              <Button onClick={() => navigate('/recipes')} variant="primary">
                Voir mes recettes
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labels.map((label) => (
            <Card key={label.id} className="overflow-hidden hover:shadow-xl transition-all group">
              {/* Header de la carte avec couleur */}
              <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-4 border-b border-primary-light">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white font-primary truncate flex-1 mr-2" title={label.productName}>
                    {label.productName}
                  </h3>
                  <Badge variant="secondary" size="sm" className="shrink-0 bg-white/20 text-white border-0">
                    {label.template || 'standard'}
                  </Badge>
                </div>
              </div>

              {/* Corps */}
              <div className="p-6 bg-gradient-to-br from-white to-neutral-smoke/30">
                {/* Infos */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-secondary font-secondary">
                    <Calendar size={16} className="mr-2 text-accent" />
                    {formatDate(label.createdAt)}
                  </div>
                  <div className="flex items-center text-sm text-secondary font-secondary">
                    <Tag size={16} className="mr-2 text-accent" />
                    Format: <span className="font-bold ml-1">{label.format || 'A4'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={() => handleDownload(label)} variant="primary" className="flex-1">
                    <Download size={16} /> Télécharger
                  </Button>
                  <Button onClick={() => window.open(label.url, '_blank')} variant="outline" className="px-3">
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
