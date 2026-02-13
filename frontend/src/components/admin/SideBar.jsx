import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  BarChart3, 
  Trophy, 
  Calendar, 
  Mail, 
  Package, 
  Settings,
  LogOut
} from 'lucide-react';
import './admin.css';

const SideBar = () => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, active: true },
    { id: 'films', label: 'Gestion films', icon: Film },
    { id: 'jury', label: 'Distribution & Jury', icon: Users },
    { id: 'results', label: 'Resultats & classement', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard officiel', icon: Trophy },
    { id: 'events', label: 'Evenements', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: Mail, badge: 2 },
    { id: 'box', label: 'Festival Box', icon: Package },
    { id: 'config', label: 'Configuration Festival', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* User Profile */}
      <div className="sidebar-user-profile">
        <div className="relative">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=OceanBreeze" 
            alt="Ocean Breeze" 
            className="sidebar-avatar"
          />
          <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]"></div>
        </div>
        <h3 className="text-lg font-bold">Ocean Breeze</h3>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Réalisateur Studio</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button 
            key={item.id} 
            className={`sidebar-nav-item w-full ${item.active ? 'active' : ''}`}
          >
            <item.icon size={20} className="mr-3" />
            <span className="flex-1 text-left text-sm">{item.label}</span>
            {item.badge && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Astronaut Image - Bottom Placeholder */}
      <div className="mt-8 mb-6 overflow-hidden rounded-2xl bg-gray-900 aspect-[3/4] flex items-center justify-center relative">
         <img 
            src="https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=400" 
            alt="Astronaut" 
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
         />
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-card">
            <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full mr-2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-bold text-sm">Mars AI</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-4">Dashboard</p>
            <button className="w-full bg-[#1a1a1a] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                Log out
            </button>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
