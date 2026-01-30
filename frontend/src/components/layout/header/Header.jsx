import React from 'react';
import Navbar from '../navbar/Navbar';
import './header.css';
import '../navbar/navbar.css';

const Header = () => {
  return (
    <header className="header-pill-container">
      <div className="header-pill-content">
        {/* Logo */}
        <div className="navbar-logo">
          MARS<span>AI</span>
        </div>

        {/* Navbar (Icons) */}
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
