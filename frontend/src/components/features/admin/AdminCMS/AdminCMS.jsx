import React from 'react';
import { Loader2 } from 'lucide-react';
import { useHomepageCms } from './useHomepageCms';
import CmsActionBar from './CmsActionBar';
import {
  CmsTabs,
  HeroTab,
  FeaturesTab,
  FilmsTab,
  StatsTab,
  ConferencesTab,
  ObjectivesTab,
} from './TabsCMS';

const AdminCMS = () => {
  const {
    activeTab,
    setActiveTab,
    data,
    loading,
    saving,
    status,
    updateSection,
    handleSave,
    handleReset,
  } = useHomepageCms();

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
        <h1 className="text-2xl md:text-3xl font-black gradient-text">CMS Homepage</h1>
        <p className="text-sm text-white/50 max-w-2xl">
          Modifie les textes et contenus affichés sur la page d'accueil.
        </p>
      </div>

      <CmsActionBar saving={saving} status={status} onSave={handleSave} onReset={handleReset} />

      <CmsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      <div className="rounded-2xl border border-white/10 bg-bg/60 p-4 md:p-6 shadow-[0_0_30px_rgba(43,127,255,0.08)]">
        {activeTab === 'hero' && (
          <HeroTab data={data.hero} onChange={updateSection('hero')} />
        )}
        {activeTab === 'features' && (
          <FeaturesTab data={data.features} onChange={updateSection('features')} />
        )}
        {activeTab === 'films' && (
          <FilmsTab data={data.films} onChange={updateSection('films')} />
        )}
        {activeTab === 'stats' && (
          <StatsTab data={data.stats} onChange={updateSection('stats')} />
        )}
        {activeTab === 'conferences' && (
          <ConferencesTab
            data={data.conferences}
            onChange={updateSection('conferences')}
          />
        )}
        {activeTab === 'objectives' && (
          <ObjectivesTab
            data={data.objectives}
            onChange={updateSection('objectives')}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCMS;
