import React from 'react';
import { Loader2, Save, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

const CmsActionBar = ({ saving, status, onSave, onReset }) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="btn-adventure flex items-center gap-2 text-xs md:text-sm font-bold rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        Sauvegarder
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={saving}
        className="btn-agenda flex items-center gap-2 text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <RotateCcw size={14} />
        Réinitialiser
      </button>
      {status === 'success' && (
        <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
          <CheckCircle2 size={16} />
          Sauvegardé
        </span>
      )}
      {status === 'error' && (
        <span className="flex items-center gap-1.5 text-red-400 text-sm">
          <AlertCircle size={16} />
          Une erreur est survenue
        </span>
      )}
    </div>
  );
};

export default CmsActionBar;

