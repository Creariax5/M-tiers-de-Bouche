import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { 
  Button, 
  Card, 
  Alert,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Loading,
  EmptyState
} from '../components/ui';
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
      setError("Erreur lors de la suppression de l'étiquette");
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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-primary">
              Mes Étiquettes
            </h1>
            <p className="text-secondary mt-1 font-secondary">
              {labels.length} étiquette{labels.length > 1 ? 's' : ''} générée{labels.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {labels.length === 0 ? (
          <Card>
            <EmptyState
              icon="🏷️"
              title="Aucune étiquette générée"
              description="Créez vos premières étiquettes INCO conformes à partir de vos recettes."
              action={
                <Button onClick={() => navigate('/recipes')} variant="primary">
                  <FileText size={18} className="mr-2" /> Voir mes recettes
                </Button>
              }
            />
          </Card>
        ) : (
          <Card padding="p-0" className="overflow-hidden border-neutral-200 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labels.map((label) => (
                  <TableRow key={label.id} className="hover:bg-neutral-50">
                    <TableCell>
                      <div className="font-medium text-primary">{label.productName}</div>
                      {label.template && (
                        <div className="text-xs text-secondary mt-0.5">{label.template}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal text-secondary border-neutral-200">
                        {label.format || 'A4'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-secondary">
                      {formatDate(label.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(label.url, '_blank')}
                          title="Voir"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(label)}
                          title="Télécharger"
                        >
                          <Download size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(label.id)}
                          title="Supprimer"
                          className="text-red-600 hover:bg-red-50"
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
    </PageContainer>
  );
}
