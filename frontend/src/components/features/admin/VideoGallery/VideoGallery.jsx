import React from 'react';
import { AdminSectionHeader } from '../shared';
import { AdminSubmissions } from '../index';
import { useLanguage } from '../../../../context/LanguageContext';

const VideoGallery = ({ onDetailToggle }) => {
  const {language} = useLanguage();
  return (
    <div className="p-2">
      <AdminSectionHeader 
        title={language === 'fr' ? 'La Galerie des Films' : 'The Movie Gallery'} 
        subtitle={language === 'fr' ? 'Visualiser et Noter les soumissions' : 'View and Rate submissions'}
        action={null}
      />

      

      <AdminSubmissions onDetailToggle={onDetailToggle} />
    </div>
  );
};

export default VideoGallery;
