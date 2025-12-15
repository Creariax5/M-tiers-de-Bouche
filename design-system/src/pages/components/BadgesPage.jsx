import React from 'react';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

const BadgesPage = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-primary text-4xl text-primary mb-4">Badges</h1>
        <p className="text-secondary text-lg">
          Indicateurs de statut et étiquettes pour catégoriser le contenu.
        </p>
      </header>

      <section className="space-y-8">
        <Card>
          <div className="space-y-8">
            {/* Brand Variants */}
            <div>
              <h2 className="font-primary text-xl text-primary mb-4">Variantes de Marque</h2>
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="mt-4 p-4 bg-neutral-light rounded-lg">
                <code className="text-xs text-neutral-dark">
                  {`<Badge variant="primary">Primary</Badge>`}
                </code>
              </div>
            </div>

            {/* System Variants */}
            <div>
              <h2 className="font-primary text-xl text-primary mb-4">États Système</h2>
              <div className="flex flex-wrap gap-4">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
              </div>
              <div className="mt-4 p-4 bg-neutral-light rounded-lg">
                <code className="text-xs text-neutral-dark">
                  {`<Badge variant="success">Success</Badge>`}
                </code>
              </div>
            </div>

            {/* Use Cases */}
            <div>
              <h2 className="font-primary text-xl text-primary mb-4">Exemples d'Usage</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-neutral-light rounded-lg">
                  <span className="font-bold text-primary">Tarte au Citron</span>
                  <Badge variant="secondary">Pâtisserie</Badge>
                  <Badge variant="outline">Hiver</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-4 border border-neutral-light rounded-lg">
                  <span className="font-bold text-primary">Commande #1234</span>
                  <Badge variant="success">Payée</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 border border-neutral-light rounded-lg">
                  <span className="font-bold text-primary">Stock Farine</span>
                  <Badge variant="danger">Critique</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default BadgesPage;
