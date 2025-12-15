import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="space-y-12">
      <header className="text-center py-12">
        <h1 className="font-primary text-5xl md:text-6xl text-night-bordeaux mb-6">REGAL</h1>
        <p className="font-secondary text-xl text-stone-brown max-w-2xl mx-auto leading-relaxed">
          Système de design unifié pour l'identité numérique de la marque.
          <br />
          Alliance parfaite entre artisanat traditionnel et élégance intemporelle.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/fundamentals/brand" className="group">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-full">
            <div className="w-12 h-12 bg-night-bordeaux/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-night-bordeaux group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>
            </div>
            <h2 className="font-primary text-2xl text-night-bordeaux mb-3">Fondamentaux</h2>
            <p className="text-stone-brown text-sm leading-relaxed">
              Explorez l'ADN de la marque : logos, palette de couleurs, typographies et principes directeurs qui définissent notre identité visuelle.
            </p>
          </div>
        </Link>

        <Link to="/components/buttons" className="group">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-full">
            <div className="w-12 h-12 bg-stone-brown/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-stone-brown group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </div>
            <h2 className="font-primary text-2xl text-night-bordeaux mb-3">Composants</h2>
            <p className="text-stone-brown text-sm leading-relaxed">
              Bibliothèque de composants React réutilisables, accessibles et conformes à la charte graphique pour construire les interfaces.
            </p>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-200">
        <h3 className="font-primary text-xl text-night-bordeaux mb-6">Dernières mises à jour</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mt-1">NEW</span>
            <div>
              <h4 className="font-bold text-black">Lancement du Design System</h4>
              <p className="text-sm text-gray-500">Initialisation de la structure, intégration de la Brand Sheet et des premiers tokens de design.</p>
              <span className="text-xs text-gray-400 mt-1 block">11 Décembre 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
