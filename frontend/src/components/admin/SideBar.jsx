import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  User,
} from 'lucide-react';
import './admin.css';

const SideBar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', active: true },
    { icon: <Film size={20} />, label: 'Gestion films' },
    { icon: <Users size={20} />, label: 'Distribution & Jury' },
    { icon: <Calendar size={20} />, label: 'Evenements' },
    { icon: <Settings size={20} />, label: 'Configuration Festival' },
  ];

  return (
    <aside className="sidebar">
      {/* Profil Utilisateur */}
      <div className="sidebar-profile">
        <div className="profile-image-container">
          <img 
            src=""
            alt="Profile" 
            className="profile-image" 
          />
        </div>
        <div>
          <p>Role</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={item.active ? 'active' : ''}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.label === 'Messages' && <span className="nav-badge">2</span>}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer SideBar */}
      <div className="sidebar-footer">              
        <div className="footer-card">
          <div className="card-header">
            <span className="brand-dot"></span>
            <span className="brand-name">Mars AI</span>
          </div>
          <p className="card-subtitle">Dashboard</p>
          <button className="logout-button">
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
