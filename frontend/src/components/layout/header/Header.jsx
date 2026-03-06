import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import '../../../styles/main.css';
import { useLanguage } from '../../../context/LanguageContext';
import LanguageSwitch from './LanguageSwitch';

const Header = () => {
  const { language } = useLanguage();
  const { setLanguage } = useLanguage();
  return (
    <header className="header-pill-container">
      <div className="header-pill-content">
        {/* Logo cliquable vers la homepage */}
        <Link
          to="/"
          className="navbar-logo cursor-pointer"
          aria-label="Retour à la page d'accueil"
        >
          MARS<span className="gradient-text">AI</span>
        </Link>

        {/* Navbar (Icons) */}
        <Navbar />

        <LanguageSwitch language={language} setLanguage={setLanguage} />

      </div>
    </header>
  );
};

export default Header;
