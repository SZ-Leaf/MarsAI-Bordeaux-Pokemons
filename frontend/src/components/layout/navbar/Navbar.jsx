import React, { useState } from 'react';
import { Home, Trophy, Award, Calendar, User, LayoutDashboard, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import '../../../styles/main.css';
import { useAuth } from '../../../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { id: 'home', icon: Home, path: '/', label: 'Accueil' },
    { id: 'trophy', icon: Trophy, path: '/selection', label: 'Sélection' },
    { id: 'awards', icon: Award, path: '/awards', label: 'Palmarès' },
    { id: 'calendar', icon: Calendar, path: '/events', label: 'Calendrier' },
    { id: 'jury', icon: Users, path: '/jury', label: 'Jury' },
    ...(user ? [{ id: 'dashboard', icon: LayoutDashboard, path: '/dashboard', label: 'Admin' }] : []),
  ];

  const getActiveItem = () => {
    const currentPath = location.pathname;
    const activeNav = navItems.find(
      (item) =>
        currentPath === item.path ||
        (item.path !== '/' && currentPath.startsWith(item.path + '/'))
    );
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