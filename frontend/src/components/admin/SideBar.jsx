import React from 'react';
import './sideBar.css';
import navItems from '../../constants/dashboard';
import { useLanguage } from '../../context/LanguageContext';

const SideBar = ({ activeView, onViewChange }) => {
  const { language } = useLanguage();
  const items = navItems();
  return (
    <aside className="sidebar">
      {/* User Profile */}
      <div className="sidebar-user-profile">
        <div className="sidebar-avatar-container">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=OceanBreeze" 
            alt="Ocean Breeze" 
            className="sidebar-avatar"
          />
          <div className="sidebar-status-dot"></div>
        </div>
        <h3 className="sidebar-user-name">Admin</h3>
        <p className="sidebar-user-role">Mars AI</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {items.map((item) => (
          <button 
            key={item.id} 
            className={`sidebar-nav-item w-full ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon size={20} className="mr-3" />
            <span className="sidebar-nav-label">{item.label[language]}</span>
            {item.badge && (
              <span className="sidebar-nav-badge">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
            <button className="sidebar-logout-btn">
                Log out
            </button>
      </div>
    </aside>
  );
}

export default SideBar;
