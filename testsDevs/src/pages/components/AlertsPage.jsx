import React from 'react';
import Alert from '../../components/ui/Alert';
import Card from '../../components/ui/Card';

const AlertsPage = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-primary text-primary mb-2">Alerts</h1>
        <p className="text-secondary font-secondary">Messages de feedback pour l'utilisateur.</p>
      </div>

      <Card title="Variantes">
        <div className="space-y-4">
          <Alert variant="info" title="Information">
            Une nouvelle version du logiciel est disponible.
          </Alert>
          
          <Alert variant="success" title="Succès">
            La recette a été enregistrée avec succès.
          </Alert>
          
          <Alert variant="warning" title="Attention">
            Le stock de farine est bas (moins de 5kg).
          </Alert>
          
          <Alert variant="error" title="Erreur">
            Impossible de calculer la marge. Prix de vente manquant.
          </Alert>

          <Alert variant="neutral" title="Note">
            Ceci est une note neutre pour l'utilisateur.
          </Alert>
        </div>
      </Card>

      <Card title="Sans Titre">
        <div className="space-y-4">
          <Alert variant="info">
            Juste un message d'information simple sans titre.
          </Alert>
          <Alert variant="error">
            Une erreur est survenue lors de la connexion.
          </Alert>
        </div>
      </Card>
    </div>
  );
};

export default AlertsPage;
