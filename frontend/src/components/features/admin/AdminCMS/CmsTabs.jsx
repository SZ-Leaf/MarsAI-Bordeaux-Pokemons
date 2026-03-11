import React from 'react';
import { TABS } from './adminCmsConfig';

const CmsTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 flex-wrap border-b border-white/10 pb-0">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onTabChange(key)}
          className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
            activeTab === key
              ? 'border-blue text-blue bg-blue/5'
              : 'border-transparent text-white/50 hover:text-white/80'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default CmsTabs;

