import React, { useState, useRef, useEffect } from 'react';
import './footer.css';
import '../navbar/navbar.css';
import '../../ui/buttons.css';
import { subscribeNewsletter } from '../../../services/newsletter.service';

function getErrorMessage(err) {
  const m = err?.message;
  if (typeof m === 'string') return m;
  if (m && typeof m === 'object' && (m.fr || m.en)) return m.fr || m.en;
  return 'Une erreur est survenue.';
}

const FLAG_CDN = 'https://flagcdn.com/w40';
const LANG_OPTIONS = [
  { value: 'fr', label: 'FR', flagSrc: `${FLAG_CDN}/fr.png` },
  { value: 'en', label: 'EN', flagSrc: `${FLAG_CDN}/gb.png` },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('fr');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const selectedOption = LANG_OPTIONS.find((o) => o.value === language) || LANG_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email?.trim();
    if (!trimmedEmail) {
      alert('Veuillez saisir votre email.');
      return;
    }
    if (!consent) {
      alert("Veuillez accepter de recevoir la newsletter.");
      return;
    }
    setIsSubmitting(true);
    setIsSubscribed(false);
    try {
      await subscribeNewsletter(trimmedEmail, true, language);
      alert('Vérifiez votre email pour confirmer votre inscription.');
      setEmail('');
      setConsent(false);
      setIsSubscribed(true);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Grid principal */}
        <div className="footer-grid">
          {/* Section Gauche - Logo & Description */}
          <div className="footer-brand">
            <div className='navbar-logo'>
              MARS<span className="gradient-text">AI</span>
            </div>
            <p className="footer-tagline">
              "La plateforme mondiale dédiée à l'univers Pokémon, ancrée dans la lumière de Bordeaux."
            </p>
            
            {/* Icônes sociales */}
            <div className="footer-social">
              <a href="#facebook" className="social-icon" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#instagram" className="social-icon" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#youtube" className="social-icon" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#twitter" className="social-icon" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Section Centre - Navigation */}
          <div className="footer-column">
            <h4 className="footer-column-title navigation-title">NAVIGATION</h4>
            <ul className="footer-links">
              <li><a href="#pokedex">Pokédex</a></li>
              <li><a href="#types">Types Pokémon</a></li>
              <li><a href="#combat">Combat</a></li>
              <li><a href="#collection">Collection</a></li>
            </ul>
          </div>

          {/* Section Centre-Droite - Légal */}
          <div className="footer-column">
            <h4 className="footer-column-title legal-title">LÉGAL</h4>
            <ul className="footer-links">
              <li><a href="#about">À propos</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Section Droite - Newsletter Card */}
          <div className="footer-newsletter-card">
            <h3 className="newsletter-card-title">
              RESTEZ CONNECTÉ
            </h3>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="newsletter-row">
                <div
                  className="newsletter-lang-select-wrap"
                  ref={langDropdownRef}
                >
                  <button
                    type="button"
                    className="newsletter-lang-select"
                    onClick={() => !isSubmitting && setLangDropdownOpen((v) => !v)}
                    disabled={isSubmitting}
                    aria-label="Langue de la newsletter"
                    aria-expanded={langDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <img
                      src={selectedOption.flagSrc}
                      alt=""
                      className="newsletter-lang-flag"
                      width={20}
                      height={14}
                    />
                    <span className="newsletter-lang-label">{selectedOption.label}</span>
                    <span className={`newsletter-lang-chevron ${langDropdownOpen ? 'newsletter-lang-chevron--open' : ''}`} aria-hidden>▼</span>
                  </button>
                  {langDropdownOpen && (
                    <ul
                      className="newsletter-lang-dropdown"
                      role="listbox"
                      aria-label="Choisir la langue"
                    >
                      {LANG_OPTIONS.map((opt) => (
                        <li
                          key={opt.value}
                          role="option"
                          aria-selected={language === opt.value}
                          className={`newsletter-lang-option ${language === opt.value ? 'newsletter-lang-option--selected' : ''}`}
                          onClick={() => {
                            setLanguage(opt.value);
                            setLangDropdownOpen(false);
                          }}
                        >
                          <img
                            src={opt.flagSrc}
                            alt=""
                            className="newsletter-lang-flag"
                            width={20}
                            height={14}
                          />
                          <span>{opt.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="btn btn-primary newsletter-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi...' : isSubscribed ? '✓ Inscrit' : "S'inscrire"}
                </button>
              </div>
              <label className="newsletter-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span>J'accepte de recevoir la newsletter.</span>
              </label>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 MARS A.I PROTOCOL • BORDEAUX HUB
          </p>
          <div className="footer-credits">
            <span className="credits-text">DESIGN SYSTÈME CYBER•PREMIUM</span>
            <a href="#legal" className="legal-link">LÉGAL</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
