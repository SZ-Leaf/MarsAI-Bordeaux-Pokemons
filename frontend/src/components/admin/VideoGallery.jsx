import React from 'react';
import { Plus, Filter, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AdminSectionHeader from './shared/AdminSectionHeader';
import AdminSearchInput from './shared/AdminSearchInput';
import Submissions from '../../pages/Submissions';

const VideoGallery = () => {

  return (
    <div className="p-2">
      <AdminSectionHeader 
        title="Gestion des soumissions" 
        subtitle="Modérez les soumissions et organisez le catalogue du festival."
        action={null}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="text-green-500" size={24} />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Validées</span>
          </div>
          <h3 className="text-3xl font-bold">124</h3>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-orange-500" size={24} />
            <span className="text-[10px] font-bold text-gray-500 uppercase">En attente</span>
          </div>
          <h3 className="text-3xl font-bold">42</h3>
        </div>
        <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="text-red-500" size={24} />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Rejetées</span>
          </div>
          <h3 className="text-3xl font-bold">12</h3>
        </div>
      </div>

      <Submissions />
    </div>
  );
};

export default VideoGallery;
