import React from 'react';
import PrimaryLogo from '../../assets/images/Primary Logo.png';
import SecondaryLogo from '../../assets/images/Secondary Logo.png';
import TertiaryLogo from '../../assets/images/Tertiary Logo.png';

const BrandPage = () => {
  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-primary tracking-wider mb-4">BRAND SHEET</h1>
        <div className="text-2xl md:text-3xl font-secondary font-light">
          <span className="uppercase tracking-widest">Regal</span>
          <div className="text-xl mt-2 text-gray-600">by: Caire Anna</div>
        </div>
      </header>

      {/* Logos Section */}
      <section>
        <h2 className="text-2xl font-primary text-night-bordeaux mb-8 border-b border-gray-200 pb-4">Logotypes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Primary Logo */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-center shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-stone-brown">Primary Logo</h3>
            <div className="w-full h-32 flex items-center justify-center">
              <img src={PrimaryLogo} alt="Primary Logo" className="max-w-full max-h-24 object-contain" />
            </div>
          </div>

          {/* Secondary Logo */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-center shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-stone-brown">Secondary Logo</h3>
            <div className="w-full h-32 flex items-center justify-center">
              <img src={SecondaryLogo} alt="Secondary Logo" className="max-w-full max-h-24 object-contain" />
            </div>
          </div>

          {/* Tertiary Logo */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-center shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-stone-brown">Tertiary Logo</h3>
            <div className="w-full h-32 flex items-center justify-center">
              <img src={TertiaryLogo} alt="Tertiary Logo" className="max-w-full max-h-24 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Section */}
      <section>
        <h2 className="text-2xl font-primary text-night-bordeaux mb-8 border-b border-gray-200 pb-4">Palette de Couleurs</h2>
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3 text-sm leading-relaxed text-stone-brown">
              <p className="mb-4 font-medium text-black">Philosophie</p>
              <p className="mb-4">Cette palette exprime l'alliance parfaite entre artisanat traditionnel, chaleur gastronomique et élégance intemporelle.</p>
              <p>Elle mélange des teintes profondes, minérales et poudrées, inspirées à la fois du bois, du vin, de la farine et des matières naturelles.</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Night Bordeaux */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-night-bordeaux flex-grow rounded-t-xl p-4 text-white font-bold text-sm group-hover:shadow-lg transition-all">
                  Night<br/>Bordeaux
                </div>
                <div className="bg-night-bordeaux rounded-b-xl p-4 text-white text-xs opacity-90 border-t border-white/10">
                  #49111C
                </div>
              </div>
              {/* Stone Brown */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-stone-brown flex-grow rounded-t-xl p-4 text-white font-bold text-sm group-hover:shadow-lg transition-all">
                  Stone<br/>Brown
                </div>
                <div className="bg-stone-brown rounded-b-xl p-4 text-white text-xs opacity-90 border-t border-white/10">
                  #5D4D3D
                </div>
              </div>
              {/* Dusty Taupe */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-dusty-taupe flex-grow rounded-t-xl p-4 text-white font-bold text-sm group-hover:shadow-lg transition-all">
                  Dusty<br/>Taupe
                </div>
                <div className="bg-dusty-taupe rounded-b-xl p-4 text-white text-xs opacity-90 border-t border-white/10">
                  #A48C78
                </div>
              </div>
              {/* White Smoke */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-white-smoke flex-grow rounded-t-xl p-4 text-black font-bold text-sm group-hover:shadow-lg transition-all border border-gray-200 border-b-0">
                  White<br/>smoke
                </div>
                <div className="bg-white-smoke rounded-b-xl p-4 text-black text-xs opacity-90 border border-gray-200 border-t-0">
                  #EAE9E8
                </div>
              </div>
              {/* Black */}
              <div className="flex flex-col h-48 group cursor-pointer">
                <div className="bg-black flex-grow rounded-t-xl p-4 text-white font-bold text-sm group-hover:shadow-lg transition-all">
                  Black
                </div>
                <div className="bg-black rounded-b-xl p-4 text-white text-xs opacity-90 border-t border-white/10">
                  #0D0909
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonts & Example Section */}
      <section>
        <h2 className="text-2xl font-primary text-night-bordeaux mb-8 border-b border-gray-200 pb-4">Typographie & Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fonts */}
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-stone-brown">Primary Font</h3>
              <div className="font-primary text-4xl md:text-5xl text-night-bordeaux">
                LIBRE<br/>BASKERVILLE
              </div>
              <p className="mt-4 text-xs text-gray-400">Titres, Mises en avant</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-stone-brown">Secondary Font</h3>
              <div className="font-secondary text-4xl md:text-5xl font-light text-black">
                Raleway
              </div>
              <p className="mt-4 text-xs text-gray-400">Corps de texte, UI, Labels</p>
            </div>
          </div>

          {/* Example */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-center text-stone-brown">Exemple d'application</h3>
            
            <div className="mb-12 text-center">
              <h2 className="font-primary text-4xl mb-4 text-night-bordeaux">TITLE</h2>
              <p className="text-stone-brown text-sm leading-relaxed max-w-md mx-auto">
                L'élégance de la typographie Libre Baskerville associée à la modernité de Raleway crée une hiérarchie visuelle claire et sophistiquée.
              </p>
            </div>

            {/* Card Example */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
              {/* Card Header */}
              <div className="p-6 pb-0 flex justify-between items-start">
                <img src={SecondaryLogo} alt="RG" className="h-12 w-auto object-contain" />
                <div className="text-right text-xs text-dusty-taupe uppercase tracking-wide font-medium">
                  Fait maison<br/>Du jour
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="font-primary text-2xl text-night-bordeaux mb-1">Tarte aux Pommes</h3>
                <p className="text-stone-brown text-sm mb-6">Part individuelle</p>

                {/* Nutrition Table */}
                <div className="bg-white-smoke rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-stone-brown">Énergie (100g)</span>
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
