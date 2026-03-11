import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, RotateCcw, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../../context/LanguageContext';
import { getHomepageService, updateHomepageService } from '../../../../services/homepage.service';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const TABS = ['hero', 'features', 'films', 'stats', 'conferences', 'objectives'];

const TAB_LABELS = {
  hero:        { fr: 'Hero',         en: 'Hero' },
  features:    { fr: 'Features',     en: 'Features' },
  films:       { fr: 'Films',        en: 'Films' },
  stats:       { fr: 'Stats',        en: 'Stats' },
  conferences: { fr: 'Conférences',  en: 'Conferences' },
  objectives:  { fr: 'Objectifs',    en: 'Objectives' },
};

const INITIAL_DATA = {
  hero: {
    badge:            { fr: '', en: '' },
    descriptionLine1: { fr: '', en: '' },
    descriptionLine2: { fr: '', en: '' },
    ctaPrimary:       { fr: '', en: '' },
    ctaSecondary:     { fr: '', en: '' },
  },
  features:    [],
  films:       [],
  stats:       [],
  conferences: [],
  objectives:  [],
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const BilingualField = ({ label, value, onChange, multiline = false }) => {
  const inputClass =
    'w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60 transition-colors resize-none';
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-white/60">{label}</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">FR</label>
          {multiline ? (
            <textarea
              rows={3}
              className={inputClass}
              value={value?.fr ?? ''}
              onChange={(e) => onChange({ ...value, fr: e.target.value })}
            />
          ) : (
            <input
              type="text"
              className={inputClass}
              value={value?.fr ?? ''}
              onChange={(e) => onChange({ ...value, fr: e.target.value })}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">EN</label>
          {multiline ? (
            <textarea
              rows={3}
              className={inputClass}
              value={value?.en ?? ''}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
            />
          ) : (
            <input
              type="text"
              className={inputClass}
              value={value?.en ?? ''}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, onDelete, children }) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</span>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
    {children}
  </div>
);

// ─── Tab panels ────────────────────────────────────────────────────────────────

const HeroTab = ({ data, onChange, language }) => {
  const set = (key) => (val) => onChange({ ...data, [key]: val });
  const l = (fr, en) => (language === 'fr' ? fr : en);

  return (
    <div className="flex flex-col gap-5">
      <BilingualField label={l('Badge', 'Badge')}          value={data.badge}            onChange={set('badge')} />
      <BilingualField label={l('Description ligne 1', 'Description line 1')} value={data.descriptionLine1} onChange={set('descriptionLine1')} multiline />
      <BilingualField label={l('Description ligne 2', 'Description line 2')} value={data.descriptionLine2} onChange={set('descriptionLine2')} multiline />
      <BilingualField label={l('CTA principal', 'Primary CTA')}       value={data.ctaPrimary}   onChange={set('ctaPrimary')} />
      <BilingualField label={l('CTA secondaire', 'Secondary CTA')}    value={data.ctaSecondary} onChange={set('ctaSecondary')} />
    </div>
  );
};

const FeaturesTab = ({ data, onChange, language }) => {
  const l = (fr, en) => (language === 'fr' ? fr : en);

  const updateItem = (i, key, val) => {
    const next = data.map((f, idx) => (idx === i ? { ...f, [key]: val } : f));
    onChange(next);
  };

  const addItem = () =>
    onChange([...data, { title: { fr: '', en: '' }, description: { fr: '', en: '' }, className: 'card-blue' }]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  const CLASS_OPTIONS = ['card-purple', 'card-green', 'card-pink', 'card-blue'];

  return (
    <div className="flex flex-col gap-4">
      {data.map((feature, i) => (
        <SectionCard key={i} title={l(`Carte #${i + 1}`, `Card #${i + 1}`)} onDelete={() => removeItem(i)}>
          <BilingualField label={l('Titre', 'Title')}       value={feature.title}       onChange={(v) => updateItem(i, 'title', v)} />
          <BilingualField label={l('Description', 'Description')} value={feature.description} onChange={(v) => updateItem(i, 'description', v)} multiline />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/60">{l('Style', 'Style')}</span>
            <select
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60"
              value={feature.className}
              onChange={(e) => updateItem(i, 'className', e.target.value)}
            >
              {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-blue/80 hover:text-blue transition-colors self-start"
      >
        <Plus size={15} /> {l('Ajouter une carte', 'Add a card')}
      </button>
    </div>
  );
};

const FilmsTab = ({ data, onChange, language }) => {
  const l = (fr, en) => (language === 'fr' ? fr : en);

  const updateItem = (i, key, val) => {
    const next = data.map((f, idx) => (idx === i ? { ...f, [key]: val } : f));
    onChange(next);
  };

  const addItem = () =>
    onChange([...data, { title: { fr: '', en: '' }, director: '', image: '' }]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  const inputClass =
    'w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60 transition-colors';

  return (
    <div className="flex flex-col gap-4">
      {data.map((film, i) => (
        <SectionCard key={i} title={l(`Film #${i + 1}`, `Film #${i + 1}`)} onDelete={() => removeItem(i)}>
          <BilingualField label={l('Titre', 'Title')} value={film.title} onChange={(v) => updateItem(i, 'title', v)} />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/60">{l('Réalisateur', 'Director')}</span>
            <input
              type="text"
              className={inputClass}
              value={film.director}
              onChange={(e) => updateItem(i, 'director', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/60">{l('URL image', 'Image URL')}</span>
            <input
              type="text"
              className={inputClass}
              value={film.image}
              onChange={(e) => updateItem(i, 'image', e.target.value)}
            />
            {film.image && (
              <img src={film.image} alt="" className="mt-1 h-16 w-28 object-cover rounded-md opacity-70" />
            )}
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-blue/80 hover:text-blue transition-colors self-start"
      >
        <Plus size={15} /> {l('Ajouter un film', 'Add a film')}
      </button>
    </div>
  );
};

const StatsTab = ({ data, onChange, language }) => {
  const l = (fr, en) => (language === 'fr' ? fr : en);

  const updateItem = (i, key, val) => {
    const next = data.map((s, idx) => (idx === i ? { ...s, [key]: val } : s));
    onChange(next);
  };

  const addItem = () =>
    onChange([...data, { title: { fr: '', en: '' }, subtitle: { fr: '', en: '' }, color: 'text-blue-400', borderClass: 'border-blue' }]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  const inputClass =
    'w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60 transition-colors';

  return (
    <div className="flex flex-col gap-4">
      {data.map((stat, i) => (
        <SectionCard key={i} title={l(`Stat #${i + 1}`, `Stat #${i + 1}`)} onDelete={() => removeItem(i)}>
          <BilingualField label={l('Valeur', 'Value')}   value={stat.title}    onChange={(v) => updateItem(i, 'title', v)} />
          <BilingualField label={l('Sous-titre', 'Subtitle')} value={stat.subtitle} onChange={(v) => updateItem(i, 'subtitle', v)} />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">{l('Couleur texte', 'Text color')}</span>
              <input type="text" className={inputClass} value={stat.color} onChange={(e) => updateItem(i, 'color', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">{l('Classe bordure', 'Border class')}</span>
              <input type="text" className={inputClass} value={stat.borderClass} onChange={(e) => updateItem(i, 'borderClass', e.target.value)} />
            </div>
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-blue/80 hover:text-blue transition-colors self-start"
      >
        <Plus size={15} /> {l('Ajouter une stat', 'Add a stat')}
      </button>
    </div>
  );
};

const ConferencesTab = ({ data, onChange, language }) => {
  const l = (fr, en) => (language === 'fr' ? fr : en);
  const ICONS = ['Play', 'Users', 'Award', 'Target', 'Zap', 'Rocket'];

  const updateItem = (i, key, val) => {
    const next = data.map((c, idx) => (idx === i ? { ...c, [key]: val } : c));
    onChange(next);
  };

  const addItem = () =>
    onChange([...data, { title: { fr: '', en: '' }, description: { fr: '', en: '' }, icon: 'Play' }]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {data.map((conf, i) => (
        <SectionCard key={i} title={l(`Conférence #${i + 1}`, `Conference #${i + 1}`)} onDelete={() => removeItem(i)}>
          <BilingualField label={l('Titre', 'Title')}       value={conf.title}       onChange={(v) => updateItem(i, 'title', v)} />
          <BilingualField label={l('Description', 'Description')} value={conf.description} onChange={(v) => updateItem(i, 'description', v)} multiline />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/60">{l('Icône', 'Icon')}</span>
            <select
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60"
              value={conf.icon}
              onChange={(e) => updateItem(i, 'icon', e.target.value)}
            >
              {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-blue/80 hover:text-blue transition-colors self-start"
      >
        <Plus size={15} /> {l('Ajouter une conférence', 'Add a conference')}
      </button>
    </div>
  );
};

const ObjectivesTab = ({ data, onChange, language }) => {
  const l = (fr, en) => (language === 'fr' ? fr : en);
  const ICONS = ['Play', 'Users', 'Award', 'Target', 'Zap', 'Rocket'];

  const updateItem = (i, key, val) => {
    const next = data.map((o, idx) => (idx === i ? { ...o, [key]: val } : o));
    onChange(next);
  };

  const addItem = () =>
    onChange([...data, { title: { fr: '', en: '' }, description: { fr: '', en: '' }, icon: 'Target', color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderClass: 'border-blue' }]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  const inputClass =
    'w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60 transition-colors';

  return (
    <div className="flex flex-col gap-4">
      {data.map((obj, i) => (
        <SectionCard key={i} title={l(`Objectif #${i + 1}`, `Objective #${i + 1}`)} onDelete={() => removeItem(i)}>
          <BilingualField label={l('Titre', 'Title')}       value={obj.title}       onChange={(v) => updateItem(i, 'title', v)} />
          <BilingualField label={l('Description', 'Description')} value={obj.description} onChange={(v) => updateItem(i, 'description', v)} multiline />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">{l('Icône', 'Icon')}</span>
              <select
                className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60"
                value={obj.icon}
                onChange={(e) => updateItem(i, 'icon', e.target.value)}
              >
                {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">{l('Classe bordure', 'Border class')}</span>
              <input type="text" className={inputClass} value={obj.borderClass} onChange={(e) => updateItem(i, 'borderClass', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">{l('Couleur texte', 'Text color')}</span>
              <input type="text" className={inputClass} value={obj.color} onChange={(e) => updateItem(i, 'color', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">{l('Couleur fond icône', 'Icon bg color')}</span>
              <input type="text" className={inputClass} value={obj.bgColor} onChange={(e) => updateItem(i, 'bgColor', e.target.value)} />
            </div>
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-blue/80 hover:text-blue transition-colors self-start"
      >
        <Plus size={15} /> {l('Ajouter un objectif', 'Add an objective')}
      </button>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const AdminCMS = () => {
  const { language } = useLanguage();
  const l = (fr, en) => (language === 'fr' ? fr : en);

  const [activeTab, setActiveTab] = useState('hero');
  const [data, setData] = useState(INITIAL_DATA);
  const [originalData, setOriginalData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHomepageService();
      setData(res.data);
      setOriginalData(res.data);
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await updateHomepageService(data);
      setOriginalData(data);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleReset = () => {
    setData(originalData);
    setStatus(null);
  };

  const updateSection = (section) => (val) =>
    setData((prev) => ({ ...prev, [section]: val }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 size={28} className="animate-spin text-blue/60" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-black gradient-text">
          {l('CMS Homepage', 'Homepage CMS')}
        </h1>
        <p className="text-sm text-white/50 max-w-2xl">
          {l('Modifie les textes et contenus affichés sur la page d\'accueil.', 'Edit the texts and content displayed on the homepage.')}
        </p>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-adventure flex items-center gap-2 text-xs md:text-sm font-bold rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {l('Sauvegarder', 'Save')}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="btn-agenda flex items-center gap-2 text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw size={14} />
          {l('Réinitialiser', 'Reset')}
        </button>
        {status === 'success' && (
          <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
            <CheckCircle2 size={16} />
            {l('Sauvegardé', 'Saved')}
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1.5 text-red-400 text-sm">
            <AlertCircle size={16} />
            {l('Erreur', 'Error')}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-white/10 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-blue text-blue bg-blue/5'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            {language === 'fr' ? TAB_LABELS[tab].fr : TAB_LABELS[tab].en}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-2xl border border-white/10 bg-bg/60 p-4 md:p-6 shadow-[0_0_30px_rgba(43,127,255,0.08)]">
        {activeTab === 'hero' && (
          <HeroTab data={data.hero} onChange={updateSection('hero')} language={language} />
        )}
        {activeTab === 'features' && (
          <FeaturesTab data={data.features} onChange={updateSection('features')} language={language} />
        )}
        {activeTab === 'films' && (
          <FilmsTab data={data.films} onChange={updateSection('films')} language={language} />
        )}
        {activeTab === 'stats' && (
          <StatsTab data={data.stats} onChange={updateSection('stats')} language={language} />
        )}
        {activeTab === 'conferences' && (
          <ConferencesTab data={data.conferences} onChange={updateSection('conferences')} language={language} />
        )}
        {activeTab === 'objectives' && (
          <ObjectivesTab data={data.objectives} onChange={updateSection('objectives')} language={language} />
        )}
      </div>

    </div>
  );
};

export default AdminCMS;
