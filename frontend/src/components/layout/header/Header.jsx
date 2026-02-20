import React from 'react';
import Navbar from '../Navbar/Navbar';
import '../../../styles/main.css';

const Header = () => {
  return (
    <header className="header-pill-container">
      <div className="header-pill-content">
        {/* Logo */}
        <div className='navbar-logo'>
          MARS<span className="gradient-text">AI</span>
        </div>

        {/* Navbar (Icons) */}
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
