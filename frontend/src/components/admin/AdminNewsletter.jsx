import React from 'react';
import { Mail, Send, Users, BarChart2, Filter } from 'lucide-react';
import AdminSectionHeader from './shared/AdminSectionHeader';
import AdminStatCard from './shared/AdminStatCard';
import AdminSearchInput from './shared/AdminSearchInput';

const AdminNewsletter = () => {
  const campaigns = [
    { id: 1, subject: 'Les temps forts de la semaine', date: '10 Fév 2024', sent: 12500, opens: '42%', clicks: '12%', status: 'Envoyé' },
    { id: 2, subject: 'Annonce du jury officiel', date: '05 Fév 2024', sent: 12300, opens: '58%', clicks: '24%', status: 'Envoyé' },
    { id: 3, subject: 'Dernière chance pour soumettre', date: '15 Fév 2024', sent: 0, opens: '-', clicks: '-', status: 'Brouillon' },
  ];

  return (
    <div className="p-2">
      <AdminSectionHeader 
        title="Newsletter" 
        subtitle="Communiquez avec la communauté et suivez vos performances."
        action={{
          label: "Nouvelle campagne",
          icon: Send,
          onClick: () => console.log('New campaign'),
          color: 'pink'
        }}
      />

      <div className="stats-grid">
        <AdminStatCard 
          title="Total abonnés"
          value="12,842"
          badge="+12% ce mois"
          badgeColor="text-green-500 font-bold"
          icon={Users}
          iconColor="text-pink-400"
        />
        <AdminStatCard 
          title="Emails envoyés (Total)"
          value="52k"
          subtitle="Derniers 30 jours"
          icon={Mail}
          iconColor="text-blue-400"
        />
        <AdminStatCard 
          title="Taux d'ouverture moyen"
          value="45.2%"
          progress={45.2}
          progressColor="bg-purple-500"
          icon={BarChart2}
          iconColor="text-purple-400"
        />
        <AdminStatCard 
          title="Taux de clic moyen"
          value="18.5%"
          progress={18.5}
          progressColor="bg-orange-500"
          icon={BarChart2}
          iconColor="text-orange-400"
        />
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800/50 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold">Historique des campagnes</h3>
          <div className="flex space-x-4">
            <AdminSearchInput placeholder="Sujet..." className="w-64" />
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
