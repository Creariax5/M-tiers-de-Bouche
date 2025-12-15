import React from 'react';
import { designConfig } from '../../config/designConfig';
import Card from '../../components/ui/Card';

const TypographyPage = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-primary text-4xl text-primary mb-4">Typographie</h1>
        <p className="text-secondary text-lg">
          L'alliance de l'élégance classique et de la lisibilité moderne.
        </p>
      </header>

      {/* Primary Font */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-neutral-light pb-2">
          <h2 className="text-2xl font-primary text-primary">Police Principale</h2>
          <span className="font-primary text-xl text-primary">{designConfig.fonts.primary.name}</span>
        </div>
        
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-9xl font-primary text-primary opacity-10 mb-4">Aa</div>
              <p className="text-secondary mb-4">
                <strong>Usage :</strong> Titres principaux, sous-titres, noms de produits.
              </p>
              <p className="text-secondary">
                <strong>Caractère :</strong> Serif classique, élégant et intemporel.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-neutral-dark mb-1">Bold - 30px</p>
                <p className="font-primary font-bold text-3xl text-primary">REGAL</p>
              </div>
              <div>
                <p className="text-xs text-neutral-dark mb-1">Bold - 20px</p>
                <p className="font-primary font-bold text-xl text-primary">Élégance Artisanale</p>
              </div>
              <div>
                <p className="text-xs text-neutral-dark mb-1">Regular - 15px</p>
                <p className="font-primary text-base text-primary">Authenticité Culinaire</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Secondary Font */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-neutral-light pb-2">
          <h2 className="text-2xl font-primary text-primary">Police Secondaire</h2>
          <span className="font-secondary text-xl text-secondary">{designConfig.fonts.secondary.name}</span>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-9xl font-secondary text-secondary opacity-10 mb-4">Aa</div>
              <p className="text-secondary mb-4">
                <strong>Usage :</strong> Corps de texte, descriptions, informations.
              </p>
              <p className="text-secondary">
                <strong>Caractère :</strong> Sans-serif moderne, lisible et élégant.
              </p>
              <p className="text-sm text-neutral-dark mt-4 italic">
                Cette police est utilisée pour le corps de texte, les descriptions de produits et toutes les informations détaillées. Sa lisibilité exceptionnelle garantit une lecture agréable sur tous les supports.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-neutral-dark mb-1">Bold - 16px</p>
                <p className="font-secondary font-bold text-base text-secondary">Savoir-Faire Traditionnel</p>
              </div>
              <div>
                <p className="text-xs text-neutral-dark mb-1">Medium - 13px</p>
                <p className="font-secondary font-medium text-sm text-secondary">Excellence Gastronomique et Artisanale</p>
              </div>
              <div>
                <p className="text-xs text-neutral-dark mb-1">Regular - 11px</p>
                <p className="font-secondary text-xs text-secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Example Association */}
      <section className="space-y-6">
        <h2 className="text-2xl font-primary text-primary border-b border-neutral-light pb-2">Exemple d'Association</h2>
        <Card className="bg-neutral-light border-none">
          <div className="max-w-2xl mx-auto text-center py-8">
            <h3 className="font-primary text-3xl text-primary mb-4">Croissant au Beurre</h3>
            <p className="font-secondary text-secondary leading-relaxed">
              Préparé avec du beurre français AOP, notre croissant incarne le savoir-faire artisanal traditionnel. Feuilletage délicat et croustillant, avec une mie généreuse et fondante.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default TypographyPage;
