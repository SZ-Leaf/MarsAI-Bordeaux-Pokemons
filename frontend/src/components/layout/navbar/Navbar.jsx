import React, { useState } from 'react';
import { Home, Trophy, Calendar, User } from 'lucide-react';
import './navbar.css';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('calendar');

  const navItems = [
    { id: 'home', icon: Home },
    { id: 'trophy', icon: Trophy },
    { id: 'calendar', icon: Calendar },
    { id: 'user', icon: User },
  ];

  return (
    <nav className="navbar-links">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`navbar-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => setActiveItem(item.id)}
          >
            <Icon size={22} strokeWidth={1.5} />
            {activeItem === item.id && <div className="navbar-dot" />}
          </div>
        );
      })}
    </nav>
  );
};

export default Navbar;
