import React from 'react';
import { Search, UserPlus, MoreVertical, Edit2, Trash2, Mail } from 'lucide-react';

const AdminUsers = () => {
  const users = [
    { id: 1, name: 'Ocean Breeze', email: 'ocean@marsai.com', role: 'Réalisateur', status: 'Actif', lastActive: 'Il y a 2h' },
    { id: 2, name: 'Stellar Mind', email: 'stellar@marsai.com', role: 'Jury', status: 'Actif', lastActive: 'Il y a 5h' },
    { id: 3, name: 'Cosmic Ray', email: 'cosmic@marsai.com', role: 'Admin', status: 'Inactif', lastActive: 'Il y a 2j' },
    { id: 4, name: 'Nebula Star', email: 'nebula@marsai.com', role: 'Réalisateur', status: 'Actif', lastActive: 'En ligne' },
  ];

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="section-title">Utilisateurs</h1>
          <p className="section-subtitle">Gérez les comptes et les permissions des membres du festival.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center font-bold transition-colors">
          <UserPlus size={18} className="mr-2" />
          Inviter un utilisateur
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Rechercher un utilisateur..." className="search-input pl-12 w-full" />
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs font-bold uppercase hover:bg-gray-800">Tous</button>
            <button className="px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs font-bold uppercase hover:bg-gray-800">Jury</button>
            <button className="px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-xs font-bold uppercase hover:bg-gray-800">Réalisateurs</button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-[10px] uppercase font-bold border-b border-gray-800">
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Dernière activité</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      className="w-10 h-10 rounded-full bg-gray-800 mr-3" 
                      alt=""
                    />
                    <div>
                      <div className="font-bold text-sm text-blue-400">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-800 rounded-lg">{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Actif' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span className="text-xs">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{user.lastActive}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg transition-colors"><Mail size={16} /></button>
                    <button className="p-2 hover:bg-purple-500/10 hover:text-purple-400 rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
