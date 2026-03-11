import React from 'react';

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

export default BilingualField;

