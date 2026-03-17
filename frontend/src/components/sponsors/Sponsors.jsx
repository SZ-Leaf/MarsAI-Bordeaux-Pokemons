import { useEffect, useState } from "react";
import { getSponsorsService } from "../../services/sponsors.service.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { Link } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const { language } = useLanguage();
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await getSponsorsService();
        setSponsors(res.data.sponsors);
      } catch (error) {
        console.error("Erreur fetch sponsors :", error);
      }
    };
    fetchSponsors();
  }, []);

  if (!sponsors.length) return null;

  // Duplique les sponsors pour remplir visuellement la barre,
  // même quand il y en a très peu (ex : 2 sponsors seulement).
  const MIN_ITEMS = 8;
  let repeatedSponsors = sponsors;
  while (repeatedSponsors.length < MIN_ITEMS) {
    repeatedSponsors = repeatedSponsors.concat(sponsors);
  }

  return (
    <section className="sponsors-section">
      <div className="sponsors-inner">
        <div className="sponsors-header">
          <p className="sponsors-label">{language === 'fr' ? 'PARTENAIRES' : 'SPONSORS'}</p>
          <h2 className="sponsors-title">{language === 'fr' ? 'ILS SOUTIENNENT' : 'THEY SUPPORT'} <Link
            to="/"
            className="navbar-logo cursor-pointer "
            aria-label="Retour à la page d'accueil"
          >
            {language === 'fr' ? 'MARS' : 'MARS'}<span className="gradient-text">{language === 'fr' ? 'AI' : 'AI'}</span>
          </Link></h2>
          <p className="sponsors-subtitle">
            {language === 'fr' ? 'Un réseau de partenaires engagés qui rendent possible le festival.' : 'A network of committed partners who make the festival possible.'}
          </p>
        </div>

        <div className="sponsors-marquees">
          <div className="marquee-row marquee-row-primary">
            <div className="marquee-container">
              {[1, 2].map((i) => (
                <div key={`row-${i}`} className="marquee-content-left">
                  {repeatedSponsors.map((sponsor, index) => (
                    <a
                      key={`${i}-${sponsor.id}-${index}`}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sponsor-logo-link"
                    >
                      <img
                        src={
                          sponsor.cover?.startsWith('http')
                            ? sponsor.cover
                            : `${API_URL}${sponsor.cover}`
                        }
                        alt={sponsor.name}
                        className="sponsor-logo"
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
