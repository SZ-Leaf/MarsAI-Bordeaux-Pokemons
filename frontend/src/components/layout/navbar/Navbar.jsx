import React, { useState } from 'react';
import { Home, Trophy, Calendar, User, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { id: 'home', icon: Home, path: '/', label: 'Accueil' },
    { id: 'trophy', icon: Trophy, path: '/selector', label: 'Sélection' },
    { id: 'calendar', icon: Calendar, path: '/events', label: 'Calendrier' },
    { id: 'user', icon: User, path: '/login', label: 'Profil' },
    { id: 'dashboard', icon: LayoutDashboard, path: '/admin', label: 'Admin' },
  ];

  const getActiveItem = () => {
    const currentPath = location.pathname;
    const activeNav = navItems.find(item => item.path === currentPath);
    return activeNav ? activeNav.id : 'home';
  };

  const activeItem = getActiveItem();

  return (
    <nav className="navbar-links">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`navbar-item ${isActive ? 'active' : ''}`}
            aria-label={item.label} // Pour l'accessibilité
          >
            <Icon size={22} strokeWidth={1.5} />
            {isActive && <div className="navbar-dot" />}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;