import React from 'react';
import { Trash2 } from 'lucide-react';

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

export default SectionCard;

