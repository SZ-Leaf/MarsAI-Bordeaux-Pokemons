import React from 'react';
import BilingualField from '../BilingualField';

const HeroTab = ({ data, onChange }) => {
  const set = (key) => (val) => onChange({ ...data, [key]: val });

  return (
    <div className="flex flex-col gap-5">
      <BilingualField label="Badge" value={data.badge} onChange={set('badge')} />
      <BilingualField
        label="Description ligne 1"
        value={data.descriptionLine1}
        onChange={set('descriptionLine1')}
        multiline
      />
      <BilingualField
        label="Description ligne 2"
        value={data.descriptionLine2}
        onChange={set('descriptionLine2')}
        multiline
      />
      <BilingualField label="CTA principal" value={data.ctaPrimary} onChange={set('ctaPrimary')} />
      <BilingualField
        label="CTA secondaire"
        value={data.ctaSecondary}
        onChange={set('ctaSecondary')}
      />
    </div>
  );
};

export default HeroTab;

