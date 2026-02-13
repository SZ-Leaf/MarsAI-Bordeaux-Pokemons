import React from 'react';
import { Plus, Filter, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AdminSectionHeader from './shared/AdminSectionHeader';
import AdminSearchInput from './shared/AdminSearchInput';

const AdminVideos = () => {
  const videos = [
    { id: 1, title: 'Red Horizon', director: 'Ocean Breeze', duration: '12:45', status: 'Validé', category: 'Sci-Fi', date: '12 Fév 2024' },
    { id: 2, title: 'The Signal', director: 'Nebula Star', duration: '08:30', status: 'En attente', category: 'Thriller', date: '14 Fév 2024' },
    { id: 3, title: 'Synthetic Dreams', director: 'Cosmic Ray', duration: '15:20', status: 'Validé', category: 'Animation', date: '15 Fév 2024' },
    { id: 4, title: 'Mars Protocol', director: 'Stellar Mind', duration: '22:10', status: 'Rejeté', category: 'Documentaire', date: '16 Fév 2024' },
  ];

  return (
    <div className="p-2">
      <AdminSectionHeader 
        title="Gestion Vidéos" 
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

      <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <AdminSearchInput placeholder="Titre, réalisateur..." className="w-96" />
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs font-bold uppercase hover:bg-gray-800">
            <Filter size={14} />
            <span>Filtres</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-[#0a0a0a] rounded-2xl border border-gray-800 overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="aspect-video bg-gray-900 relative">
                <img 
                  src={`https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400&sig=${video.id}`} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  alt=""
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl">
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-blue-400 truncate">{video.title}</h4>
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    video.status === 'Validé' ? 'bg-green-500/10 text-green-500' : 
                    video.status === 'Rejeté' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {video.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">Par {video.director}</p>
                <div className="flex justify-between items-center text-[10px] text-gray-600 uppercase font-bold">
                  <span>{video.category}</span>
                  <span>{video.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminVideos;
