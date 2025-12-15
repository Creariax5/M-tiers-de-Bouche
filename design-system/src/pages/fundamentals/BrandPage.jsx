import React from 'react';
import { designConfig } from '../../config/designConfig';
import Logo from '../../components/ui/Logo';

const BrandPage = () => {
  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-primary tracking-wider mb-4">BRAND SHEET</h1>
        <div className="text-2xl md:text-3xl font-secondary font-light">
          <span className="uppercase tracking-widest">{designConfig.brand.name}</span>
          <div className="text-xl mt-2 text-neutral-dark">by: Caire Anna</div>
        </div>
      </header>

      {/* Logos Section */}
      <section>
        <h2 className="text-2xl font-primary text-primary mb-8 border-b border-neutral-light pb-4">Logotypes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Primary Logo */}
          <div className="bg-white border border-neutral-light rounded-3xl p-8 flex flex-col items-center shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-secondary">Primary Logo</h3>
            <div className="w-full h-32 flex items-center justify-center">
              <Logo size="xl" variant="main" />
            </div>
          </div>

          {/* Secondary Logo */}
          <div className="bg-white border border-neutral-light rounded-3xl p-8 flex flex-col items-center shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-secondary">Secondary Logo</h3>
            <div className="w-full h-32 flex items-center justify-center">
              <Logo size="xl" variant="secondary" />
            </div>
          </div>

          {/* Tertiary Logo */}
          <div className="bg-white border border-neutral-light rounded-3xl p-8 flex flex-col items-center shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-secondary">Tertiary Logo</h3>
            <div className="w-full h-32 flex items-center justify-center">
              <Logo size="xl" variant="tertiary" />
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Section */}
      <section>
        <h2 className="text-2xl font-primary text-primary mb-8 border-b border-neutral-light pb-4">Palette de Couleurs</h2>
        <div className="bg-white border border-neutral-light rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3 text-sm leading-relaxed text-secondary">
              <p className="mb-4 font-medium text-black">Philosophie</p>
              <p className="mb-4">Cette palette exprime l'alliance parfaite entre artisanat traditionnel, chaleur gastronomique et élégance intemporelle.</p>
              <p>Elle mélange des teintes profondes, minérales et poudrées, inspirées à la fois du bois, du vin, de la farine et des matières naturelles.</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Primary */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-primary flex-grow rounded-t-xl p-4 text-white font-bold text-sm group-hover:shadow-lg transition-all">
                  Primary
                </div>
                <div className="bg-primary rounded-b-xl p-4 text-white text-xs opacity-90 border-t border-white/10">
                  {designConfig.colors.primary.DEFAULT}
                </div>
              </div>
              {/* Secondary */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-secondary flex-grow rounded-t-xl p-4 text-white font-bold text-sm group-hover:shadow-lg transition-all">
                  Secondary
                </div>
                <div className="bg-secondary rounded-b-xl p-4 text-white text-xs opacity-90 border-t border-white/10">
                  {designConfig.colors.secondary.DEFAULT}
                </div>
              </div>
              {/* Accent */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-accent flex-grow rounded-t-xl p-4 text-white font-bold text-sm group-hover:shadow-lg transition-all">
                  Accent
                </div>
                <div className="bg-accent rounded-b-xl p-4 text-white text-xs opacity-90 border-t border-white/10">
                  {designConfig.colors.accent.DEFAULT}
                </div>
              </div>
              {/* Neutral Smoke */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-neutral-light flex-grow rounded-t-xl p-4 text-black font-bold text-sm group-hover:shadow-lg transition-all border border-neutral-light border-b-0">
                  Neutral<br/>Light
                </div>
                <div className="bg-neutral-light rounded-b-xl p-4 text-black text-xs opacity-90 border border-neutral-light border-t-0">
                  {designConfig.colors.neutral.smoke}
                </div>
              </div>
              {/* Black */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-black flex-grow rounded-t-xl p-4 text-white font-bold text-sm group-hover:shadow-lg transition-all">
                  Black
                </div>
                <div className="bg-black rounded-b-xl p-4 text-white text-xs opacity-90 border-t border-white/10">
                  {designConfig.colors.neutral.black}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonts & Example Section */}
      <section>
        <h2 className="text-2xl font-primary text-primary mb-8 border-b border-neutral-light pb-4">Typographie & Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fonts */}
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-neutral-light rounded-3xl p-8 text-center shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-secondary">Primary Font</h3>
              <div className="font-primary text-4xl md:text-5xl text-primary uppercase">
                {designConfig.fonts.primary.name}
              </div>
              <p className="mt-4 text-xs text-neutral-dark">Titres, Mises en avant</p>
            </div>
            <div className="bg-white border border-neutral-light rounded-3xl p-8 text-center shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-secondary">Secondary Font</h3>
              <div className="font-secondary text-4xl md:text-5xl font-light text-black">
                {designConfig.fonts.secondary.name}
              </div>
              <p className="mt-4 text-xs text-neutral-dark">Corps de texte, UI, Labels</p>
            </div>
          </div>

          {/* Example */}
          <div className="bg-white border border-neutral-light rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-center text-secondary">Exemple d'application</h3>
            
            <div className="mb-12 text-center">
              <h2 className="font-primary text-4xl mb-4 text-primary">TITLE</h2>
              <p className="text-secondary text-sm leading-relaxed max-w-md mx-auto">
                L'élégance de la typographie {designConfig.fonts.primary.name} associée à la modernité de {designConfig.fonts.secondary.name} crée une hiérarchie visuelle claire et sophistiquée.
              </p>
            </div>

            {/* Card Example */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
              {/* Card Header */}
              <div className="p-6 pb-0 flex justify-between items-start">
                <Logo size="md" variant="secondary" />
                <div className="text-right text-xs text-accent uppercase tracking-wide font-medium">
                  Fait maison<br/>Du jour
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="font-primary text-2xl text-primary mb-1">Tarte aux Pommes</h3>
                <p className="text-secondary text-sm mb-6">Part individuelle</p>

                {/* Nutrition Table */}
                <div className="bg-neutral-light rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-secondary">Énergie (100g)</span>
                    <span className="font-bold text-black">320 kcal</span>
                  </div>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-stone-brown">Lipides</span>
                    <span className="font-bold text-black">12g</span>
                  </div>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-stone-brown">Glucides</span>
                    <span className="font-bold text-black">48g</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-brown">Protéines</span>
                    <span className="font-bold text-black">4g</span>
                  </div>
                </div>

                {/* Allergens & Conservation */}
                <div className="text-xs text-stone-brown space-y-1 mb-2">
                  <p><span className="font-bold text-night-bordeaux">Allergènes:</span> Gluten, Œufs, Lait</p>
                  <p><span className="font-bold text-night-bordeaux">Conservation:</span> 3 jours au frais</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-night-bordeaux text-white text-center py-2 text-xs font-medium tracking-wide">
                120g • Généré par REGAL
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandPage;
