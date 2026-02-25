
import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const AdminCMS = () => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-black gradient-text">
          {language === 'fr' ? 'CMS Homepage' : 'Homepage CMS'}
        </h1>
        <p className="text-sm text-white/60 max-w-2xl">
          {language === 'fr'
            ? "Maquette d'interface CMS pour modifier les textes de la homepage."
            : 'CMS interface mockup to edit homepage texts.'}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            className="btn-adventure text-xs md:text-sm font-bold rounded-full cursor-not-allowed opacity-60"
            disabled
          >
            {language === 'fr'
              ? 'Sauvegarder'
              : 'Save'}
          </button>
          <button
            type="button"
            className="btn-agenda text-xs md:text-sm cursor-not-allowed opacity-40"
            disabled
          >
            {language === 'fr' ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="flex flex-col gap-4 rounded-3xl border border-blue/30 bg-bg/80 p-4 md:p-6 shadow-[0_0_30px_rgba(43,127,255,0.15)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-blue flex items-center gap-3">
          <span className="w-8 h-px bg-blue/60" />
          {language === 'fr' ? 'Section Hero' : 'Hero section'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 opacity-70">
            <label className="text-xs font-semibold text-white/70">
              {language === 'fr'
                ? 'Ligne 1 sous le titre'
                : 'Line 1 under title'}
            </label>
            <input
              type="text"
              value={
                language === 'fr'
                  ? 'Le festival de courts-métrages de 60 secondes réalisés par IA.'
                  : 'The festival of 60 second short films made by AI.'
              }
              readOnly
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2 opacity-70">
            <label className="text-xs font-semibold text-white/70">
              {language === 'fr'
                ? 'Ligne 2 sous le titre'
                : 'Line 2 under title'}
            </label>
            <input
              type="text"
              value={
                language === 'fr'
                  ? "2 jours d'immersion au cœur de Marseille."
                  : '2 days of immersion in the heart of Marseille.'
              }
              readOnly
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-2 opacity-70">
            <label className="text-xs font-semibold text-white/70">
              {language === 'fr'
                ? 'Texte du bouton principal'
                : 'Primary button label'}
            </label>
            <input
              type="text"
              value={
                language === 'fr' ? 'VOIR LES FILMS' : 'SEE THE FILMS'
              }
              readOnly
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2 opacity-70">
            <label className="text-xs font-semibold text-white/70">
              {language === 'fr'
                ? 'Texte du bouton secondaire'
                : 'Secondary button label'}
            </label>
            <input
              type="text"
              value={
                language === 'fr' ? 'SOUMETTRE UN FILM' : 'SUBMIT A FILM'
              }
              readOnly
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="flex flex-col gap-4 rounded-3xl border border-purple-500/30 bg-bg/80 p-4 md:p-6 shadow-[0_0_30px_rgba(157,49,255,0.18)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
          {language === 'fr'
            ? 'Cartes "Features"'
            : '"Features" cards'}
        </h2>
        <p className="text-xs text-white/50 mb-2">
          {language === 'fr'
            ? 'Modifie les titres et descriptions des 4 cartes sous le hero.'
            : 'Edit the titles and descriptions of the 4 cards under the hero.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="flex flex-col gap-3 card-dark-premium p-4 opacity-80 border-blue/20"
            >
              <div className="text-xs font-semibold text-white/60">
                {language === 'fr'
                  ? `Carte #${index}`
                  : `Card #${index}`}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-white/70">
                  {language === 'fr' ? 'Titre' : 'Title'}
                </label>
                <input
                  type="text"
                  value={
                    language === 'fr'
                      ? 'EXEMPLE DE TITRE'
                      : 'SAMPLE TITLE'
                  }
                  readOnly
                  className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-white/70">
                  {language === 'fr' ? 'Description' : 'Description'}
                </label>
                <textarea
                  value={
                    language === 'fr'
                      ? 'Texte de description de la carte (exemple).'
                      : 'Card description text (example).'
                  }
                  readOnly
                  rows={3}
                  className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-xs text-white outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminCMS;

