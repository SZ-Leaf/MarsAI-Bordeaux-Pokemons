import React from 'react';
import { Plus, Filter, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AdminSectionHeader from './shared/AdminSectionHeader';
import AdminSearchInput from './shared/AdminSearchInput';
import Submissions from '../../pages/Submissions';
import { useLanguage } from '../../context/LanguageContext';

const VideoGallery = ({ onDetailToggle }) => {
  const {language} = useLanguage();
  return (
    <div className="p-2">
      <AdminSectionHeader 
        title={language === 'fr' ? 'La Galerie des Films' : 'The Movie Gallery'} 
        subtitle={language === 'fr' ? 'Visualiser et Noter les soumissions' : 'View and Rate submissions'}
        action={null}
      />

      

      <Submissions onDetailToggle={onDetailToggle} />
    </div>
  );
};

export default VideoGallery;
