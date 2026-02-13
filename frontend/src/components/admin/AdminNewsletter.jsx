import React from 'react';
import { Mail, Send, Users, BarChart2, Search, Filter, Plus } from 'lucide-react';

const AdminNewsletter = () => {
  const campaigns = [
    { id: 1, subject: 'Les temps forts de la semaine', date: '10 Fév 2024', sent: 12500, opens: '42%', clicks: '12%', status: 'Envoyé' },
    { id: 2, subject: 'Annonce du jury officiel', date: '05 Fév 2024', sent: 12300, opens: '58%', clicks: '24%', status: 'Envoyé' },
    { id: 3, subject: 'Dernière chance pour soumettre', date: '15 Fév 2024', sent: 0, opens: '-', clicks: '-', status: 'Brouillon' },
  ];

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="section-title">Newsletter</h1>
          <p className="section-subtitle">Communiquez avec la communauté et suivez vos performances.</p>
        </div>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl flex items-center font-bold transition-colors shadow-lg shadow-pink-600/20">
          <Send size={18} className="mr-2" />
          Nouvelle campagne
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="p-2 bg-pink-500/10 rounded-lg w-fit mb-4">
            <Users size={18} className="text-pink-400" />
          </div>
          <h2 className="stat-value">12,842</h2>
          <p className="stat-label">Total abonnés</p>
          <span className="text-[10px] text-green-500 font-bold">+12% ce mois</span>
        </div>
        <div className="stat-card">
          <div className="p-2 bg-blue-500/10 rounded-lg w-fit mb-4">
            <Mail size={18} className="text-blue-400" />
          </div>
          <h2 className="stat-value">52k</h2>
          <p className="stat-label">Emails envoyés (Total)</p>
          <span className="text-[10px] text-gray-500 font-bold">Derniers 30 jours</span>
        </div>
        <div className="stat-card">
          <div className="p-2 bg-purple-500/10 rounded-lg w-fit mb-4">
            <BarChart2 size={18} className="text-purple-400" />
          </div>
          <h2 className="stat-value">45.2%</h2>
          <p className="stat-label">Taux d'ouverture moyen</p>
          <div className="progress-container h-1 mt-2">
            <div className="progress-fill bg-purple-500 w-[45%]"></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="p-2 bg-orange-500/10 rounded-lg w-fit mb-4">
            <BarChart2 size={18} className="text-orange-400" />
          </div>
          <h2 className="stat-value">18.5%</h2>
          <p className="stat-label">Taux de clic moyen</p>
          <div className="progress-container h-1 mt-2">
            <div className="progress-fill bg-orange-500 w-[18%]"></div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold">Historique des campagnes</h3>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
              <input type="text" placeholder="Sujet..." className="bg-[#0a0a0a] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-pink-500 transition-colors" />
            </div>
            <button className="p-2 bg-[#0a0a0a] border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors">
              <Filter size={14} />
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-[10px] uppercase font-bold border-b border-gray-800">
              <th className="px-6 py-4">Sujet de la campagne</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Destinataires</th>
              <th className="px-6 py-4">Ouverture</th>
              <th className="px-6 py-4">Clics</th>
              <th className="px-6 py-4">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-bold text-sm text-pink-400">{camp.subject}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{camp.date}</td>
                <td className="px-6 py-4 text-sm font-medium">{camp.sent > 0 ? camp.sent.toLocaleString() : '-'}</td>
                <td className="px-6 py-4 text-sm font-medium">{camp.opens}</td>
                <td className="px-6 py-4 text-sm font-medium">{camp.clicks}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    camp.status === 'Envoyé' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {camp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminNewsletter;
