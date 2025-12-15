import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const CardsPage = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-primary text-4xl text-primary mb-4">Cards</h1>
        <p className="text-secondary text-lg">
          Conteneurs flexibles pour regrouper du contenu connexe.
        </p>
      </header>

      <section className="space-y-8">
        {/* Basic Card */}
        <div className="space-y-4">
          <h2 className="font-primary text-xl text-primary">Card Standard</h2>
          <Card>
            <h3 className="font-primary text-lg text-primary mb-2">Titre de la carte</h3>
            <p className="text-secondary mb-4">
              Ceci est une carte standard avec un padding par défaut de p-6. Elle utilise les bordures et ombres définies dans la configuration.
            </p>
            <Button size="sm">Action</Button>
          </Card>
        </div>

        {/* Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-primary text-xl text-primary">Sans Padding</h2>
            <Card padding="p-0" className="overflow-hidden">
              <div className="h-32 bg-neutral-light flex items-center justify-center text-neutral-dark">
                Image / Header
              </div>
              <div className="p-6">
                <h3 className="font-primary text-lg text-primary mb-2">Contenu</h3>
                <p className="text-secondary">
                  Carte avec padding="p-0" pour permettre des images pleine largeur.
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="font-primary text-xl text-primary">Fond Coloré</h2>
            <Card className="bg-primary text-white border-none">
              <h3 className="font-primary text-lg text-white mb-2">Carte Primaire</h3>
              <p className="text-white/80 mb-4">
                Carte utilisant la couleur primaire comme fond. Les textes sont adaptés en conséquence.
              </p>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Action
              </Button>
            </Card>
          </div>
        </div>

        {/* Interactive */}
        <div className="space-y-4">
          <h2 className="font-primary text-xl text-primary">Interactive</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <p className="font-bold text-primary">Hover me</p>
              <p className="text-sm text-secondary">Shadow effect</p>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <p className="font-bold text-primary">Hover me</p>
              <p className="text-sm text-secondary">Border effect</p>
            </Card>
            <Card className="cursor-pointer hover:-translate-y-1 transition-transform">
              <p className="font-bold text-primary">Hover me</p>
              <p className="text-sm text-secondary">Translate effect</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CardsPage;
