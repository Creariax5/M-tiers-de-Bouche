import React from 'react';
import { designConfig } from '../../config/designConfig';
import Card from '../../components/ui/Card';

const ColorsPage = () => {
  const ColorCard = ({ name, hex, cmyk, rgb, description, isDark = false, isLight = false }) => (
    <div className="flex flex-col h-full group">
      <div 
        className={`h-32 rounded-t-xl p-4 flex flex-col justify-between transition-shadow group-hover:shadow-lg ${isLight ? 'border border-neutral-light border-b-0' : ''}`}
        style={{ backgroundColor: hex }}
      >
        <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{name}</span>
        <span className={`text-sm opacity-90 ${isDark ? 'text-white' : 'text-black'}`}>{hex}</span>
      </div>
      <div className={`bg-white p-4 rounded-b-xl border border-t-0 ${isLight ? 'border-neutral-light' : 'border-gray-100'} flex-grow`}>
        <div className="space-y-2 text-xs text-neutral-dark font-mono mb-4">
          <div>RGB: {rgb}</div>
          <div>CMYK: {cmyk}</div>
        </div>
        {description && (
          <p className="text-sm text-secondary font-secondary">{description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-primary text-4xl text-primary mb-4">Couleurs</h1>
        <p className="text-secondary text-lg">
          Une palette inspirée par les matières nobles : bois, vin et pierre.
        </p>
      </header>

      {/* Philosophy */}
      <Card className="bg-neutral-light border-none">
        <h3 className="font-bold text-primary mb-2">Philosophie</h3>
        <p className="text-secondary italic font-secondary">
          "Cette palette exprime l'alliance parfaite entre artisanat traditionnel, chaleur gastronomique et élégance intemporelle. Elle mélange des teintes profondes, minérales et poudrées, inspirées à la fois du bois, du vin, de la farine et des matières naturelles."
        </p>
      </Card>

      {/* Main Palette */}
      <section className="space-y-6">
        <h2 className="text-2xl font-primary text-primary border-b border-neutral-light pb-2">Palette Principale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <ColorCard 
            name="Night Bordeaux" 
            hex={designConfig.colors.primary.DEFAULT}
            rgb="73, 17, 28"
            cmyk="0, 77, 62, 71"
            description="Dominante. Logos, titres et éléments importants."
            isDark
          />
          <ColorCard 
            name="Stone Brown" 
            hex={designConfig.colors.secondary.DEFAULT}
            rgb="93, 77, 61"
            cmyk="0, 17, 34, 64"
            description="Dominante. Logos, titres et éléments importants."
            isDark
          />
          <ColorCard 
            name="Dusty Taupe" 
            hex={designConfig.colors.accent.DEFAULT}
            rgb="164, 140, 120"
            cmyk="0, 15, 27, 36"
            description="Complémentaire. Équilibre, fonds et bordures."
            isDark
          />
          <ColorCard 
            name="White Smoke" 
            hex={designConfig.colors.neutral.smoke}
            rgb="234, 233, 232"
            cmyk="0, 0, 1, 8"
            description="Complémentaire. Fonds, bordures et éléments secondaires."
            isLight
          />
          <ColorCard 
            name="Black" 
            hex={designConfig.colors.neutral.black}
            rgb="13, 9, 9"
            cmyk="0, 31, 31, 95"
            description="Texte et contrastes forts."
            isDark
          />
        </div>
      </section>

      {/* Usage Rules */}
      <section className="space-y-6">
        <h2 className="text-2xl font-primary text-primary border-b border-neutral-light pb-2">Règles d'Utilisation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              Couleurs Principales
            </h3>
            <p className="text-secondary mb-4">
              <strong>Night Bordeaux</strong> et <strong>Stone Brown</strong> sont les couleurs dominantes.
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-dark space-y-1 ml-2">
              <li>Logos</li>
              <li>Titres principaux</li>
              <li>Boutons d'action principale</li>
              <li>Éléments de navigation actifs</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              Couleurs Complémentaires
            </h3>
            <p className="text-secondary mb-4">
              <strong>Dusty Taupe</strong> et <strong>White Smoke</strong> créent l'équilibre.
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-dark space-y-1 ml-2">
              <li>Arrière-plans de sections</li>
              <li>Bordures et séparateurs</li>
              <li>Éléments secondaires</li>
              <li>Cartes et conteneurs</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ColorsPage;
