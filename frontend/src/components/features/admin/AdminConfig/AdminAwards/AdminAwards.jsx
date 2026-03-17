import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AwardsIndex from './awards/AwardsIndex';
import { AdminSectionHeader } from '../../shared';
import { useLanguage } from '../../../../../context/LanguageContext';

const AdminAwards = () => {
  const { language } = useLanguage();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="p-2">
      <AdminSectionHeader
        title={language === 'fr' ? 'Palmarès' : 'Awards'}
        subtitle={
          language === 'fr'
            ? 'Gérez les awards du festival.'
            : 'Manage the awards of the festival.'
        }
        action={{
          label: language === 'fr' ? 'Ajouter un award' : 'Add an award',
          icon: Plus,
          onClick: () => setCreateOpen(true),
          color: 'blue',
        }}
      />
      <AwardsIndex createOpen={createOpen} setCreateOpen={setCreateOpen} />
    </div>
  );
};

export default AdminAwards;
