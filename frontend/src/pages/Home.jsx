import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, Calendar, Clock, MapPin, Play, Users, Award, Target, Zap, Rocket } from 'lucide-react';
import { Card } from '../components/ui';
import useModal from '../hooks/useModal';
import { SubmitModal } from '../components/features/submission';
import '../styles/main.css';
import Sponsors from '../components/sponsors/Sponsors';
import { getFEATURES, getFILMS, getSTATS, getCONFERENCES, getOBJECTIVES } from '../constants/homepage';
import { useLanguage } from '../context/LanguageContext';
import { getHomepageService } from '../services/homepage.service';

const ICON_MAP = { Play, Users, Award, Target, Zap, Rocket };

// --- Shared Internal Components ---

const Section = ({ id, children, className = '', wide = false }) => (
  <section
    id={id}
    className={`section-container ${wide ? 'section-container-wide' : ''} ${className}`}
  >
    {children}
  </section>
);

const SectionLabel = ({ children, centered = false }) => (
  <div className={`section-label-group ${centered ? 'section-label-centered' : ''}`}>
    {!centered && <span className="line"></span>}
    {centered && <span className="line"></span>}
    {children}
    {centered && <span className="line"></span>}
  </div>
);

const t = (field, language) => {
  if (!field || typeof field !== 'object') return field ?? '';
  return field[language] ?? field.fr ?? '';
};

// --- Main Component ---

const Home = () => {
  const { isOpen: isSubmitModalOpen, openModal: openSubmitModal, closeModal: closeSubmitModal } = useModal();
  const { language } = useLanguage();
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    getHomepageService()
      .then((res) => setCmsData(res.data))
      .catch(() => {});
  }, []);

  const FEATURES = cmsData
    ? cmsData.features.map((f) => ({ ...f, title: t(f.title, language), description: t(f.description, language) }))
    : getFEATURES(language);

  const FILMS = cmsData
    ? cmsData.films.map((f) => ({ ...f, title: t(f.title, language) }))
    : getFILMS(language);

  const STATS = cmsData
    ? cmsData.stats.map((s) => ({ ...s, title: t(s.title, language), subtitle: t(s.subtitle, language) }))
    : getSTATS(language);

  const CONFERENCES = cmsData
    ? cmsData.conferences.map((c) => ({ ...c, title: t(c.title, language), description: t(c.description, language), icon: ICON_MAP[c.icon] ?? Play }))
    : getCONFERENCES(language);

  const OBJECTIVES = cmsData
    ? cmsData.objectives.map((o) => ({ ...o, title: t(o.title, language), description: t(o.description, language), icon: ICON_MAP[o.icon] ?? Target }))
    : getOBJECTIVES(language);

  const hero = cmsData?.hero ?? null;

  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <main className="hero-section">
        <div className="hero-badge animate-fade-in">
          <span className="sparkle">✨</span>
          {hero ? t(hero.badge, language) : (language === 'fr' ? "LE PROTOCOLE TEMPOREL 2026" : "TEMPORAL PROTOCOL 2026")}
        </div>

        <h1 className="hero-title">
          {language === 'fr' ? "MARS" : "MARS"}<span className="gradient-text">AI</span>
        </h1>

        <h2 className="hero-subtitle">
          {language === 'fr' ? "IMAGINEZ DES " : "IMAGINE "}<span className="gradient-text-alt">FUTURS</span> {language === 'fr' ? "SOUHAITABLES" : "DESIRABLES"}
        </h2>

        <div className="hero-description-container">
          <p className="hero-description">{hero ? t(hero.descriptionLine1, language) : (language === 'fr' ? "Le festival de courts-métrages de 60 secondes réalisés par IA." : "The festival of 60 second short films made by AI.")}</p>
          <p className="hero-description">{hero ? t(hero.descriptionLine2, language) : (language === 'fr' ? "2 jours d'immersion au cœur de Marseille." : "2 days of immersion in the heart of Marseille.")}</p>
        </div>

        <div className="hero-actions">
          <button className="btn btn-primary flex items-center gap-2 group">
            {hero ? t(hero.ctaPrimary, language) : (language === 'fr' ? "VOIR LES FILMS" : "SEE THE FILMS")} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            className="btn btn-secondary flex items-center gap-2 group"
            onClick={openSubmitModal}
          >
            {hero ? t(hero.ctaSecondary, language) : (language === 'fr' ? "SOUMETTRE UN FILM" : "SUBMIT A FILM")}
            <Plus size={18} className="text-purple-400 transition-transform group-hover:rotate-90" />
          </button>
        </div>
      </main>

      {/* 2. FEATURES SECTION */}
      <Section className="py-20">
        <h2 className="section-title-medium text-center mb-16">
          {language === 'fr' ? "UN FESTIVAL " : "A FESTIVAL "}<span className="stats-accent">{language === 'fr' ? "NOUVELLE GÉNÉRATION" : "NEW GENERATION"}</span>
        </h2>

        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <Card
              key={index}
              type="text"
              title={feature.title}
              description={feature.description}
              className={`feature-card ${feature.className}`}
            />
          ))}
        </div>
      </Section>

      {/* 3. FILMS SECTION */}
      <Section id="films">
        <SectionLabel>{language === 'fr' ? "LE PROJET MARS.A.I" : "THE MARS.A.I PROJECT"}</SectionLabel>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className="section-title-xl section-title-huge">
              {language === 'fr' ? "FILMS EN" : "FILMS IN"}<br />
              <span className="fade-text">{language === 'fr' ? "COMPÉTITION" : "COMPETITION"}</span>
            </h2>
            <p className="section-description">
              {language === 'fr' ? "Découvrez une sélection d'œuvres pionnières explorant les nouvelles frontières de l'imaginaire assisté par l'IA." : "Discover a selection of pioneering works exploring the new frontiers of imagination assisted by AI."}
            </p>
          </div>

          <button className="view-selection-btn">
            {language === 'fr' ? "VOIR LA SÉLECTION" : "SEE THE SELECTION"}
            <div className="arrow-circle"><ArrowRight size={20} /></div>
          </button>
        </div>

        <div className="films-grid">
          {FILMS.map((film, index) => (
            <Card
              key={index}
              type="image"
              title={film.title}
              subtitle={film.director}
              image={film.image}
              className="film-card"
            />
          ))}
        </div>
      </Section>

      {/* 3.5 OBJECTIVES SECTION */}
      <Section id="objectives" className="flex flex-col items-center">
        <h2 className="section-title-medium text-center mb-24">
          {language === 'fr' ? "OBJECTIFS DU " : "OBJECTIVES OF "}<span className="stats-accent">{language === 'fr' ? "FESTIVAL" : "FESTIVAL"}</span>
        </h2>

        <div className="objectives-grid">
          {OBJECTIVES.map((obj, index) => {
            const Icon = obj.icon;
            return (
              <div key={index} className={`objective-card ${obj.borderClass}`}>
                <div className={`objective-icon-wrapper ${obj.bgColor} ${obj.color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="objective-title">{obj.title}</h3>
                <p className="objective-description">{obj.description}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 4. PROTOCOL SECTION */}
      <Section id="protocol" className="flex flex-col items-center">
        <div className="text-center mb-20">
          <SectionLabel centered>{language === 'fr' ? "IMMERSION TOTALE" : "TOTAL IMMERSION"}</SectionLabel>
          <h2 className="section-title-xl">{language === 'fr' ? "LE PROTOCOLE TEMPOREL" : "THE TEMPORAL PROTOCOL"}</h2>
        </div>

        <div className="stats-grid-home">
          {STATS.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.borderClass}`}>
              <h3 className={`stat-value ${stat.color}`}>{stat.title}</h3>
              <p className="stat-subtitle">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-adventure"
          onClick={openSubmitModal}
        >
          {language === 'fr' ? "REJOINDRE L'AVENTURE" : "JOIN THE ADVENTURE"}
        </button>
      </Section>

      {/* 5. CONFERENCES SECTION */}
      <Section id="conferences">
        <div className="conf-content-top">
          <h2 className="section-title-xl">
            {language === 'fr' ? "DEUX JOURNÉES DE" : "TWO DAYS OF"}<br />
          </h2>
          <span className="purple-underline">{language === 'fr' ? "CONFÉRENCES GRATUITES" : "FREE CONFERENCES"}</span>

          <div className="conf-info-container">
            <ol className="conf-list">
              <li>{language === 'fr' ? "Débats engagés sur l'éthique et le future" : "Engaged debates on ethics and future"}</li>
              <li>{language === 'fr' ? "Confrontations d'idées entre artistes et tech" : "Confrontations of ideas between artists and tech"}</li>
              <li>{language === 'fr' ? "Interrogations stimulantes sur la création" : "Stimulating interrogations on creation"}</li>
            </ol>

            <button className="btn-agenda">
              <Calendar size={18} className="text-pink-400" />
              {language === 'fr' ? "AGENDA COMPLET" : "COMPLETE AGENDA"}
            </button>
          </div>
        </div>

        <div className="conf-cards-grid">
          {CONFERENCES.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="conf-card">
                <div className="conf-card-icon"><Icon size={32} /></div>
                <h3 className="conf-card-title">{card.title}</h3>
                <p className="conf-card-description">{card.description}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 6. NIGHT SECTION */}
      <Section id="night">
        <div className="night-container">
          <div className="night-content">
            <div className="night-badge">{language === 'fr' ? "SOIRÉE DE CLÔTURE" : "CLOSING NIGHT"}</div>
            <h2 className="night-title">MARS.A.I<br /><span className="night-accent">NIGHT</span></h2>
            <div className="night-description">
              <p>{language === 'fr' ? "Fête Électro mêlant IA et futurs souhaitables." : "Electro party mixing AI and desirable futures."}</p>
              <p>{language === 'fr' ? "Une expérience immersive sonore et visuelle." : "An immersive sound and visual experience."}</p>
            </div>
          </div>

          <div className="night-card">
            <div className="night-card-icon"><Clock size={48} /></div>
            <div className="night-card-date">{language === 'fr' ? "13 JUIN" : "13 JUNE"}</div>
            <div className="night-card-info">{language === 'fr' ? "DÈS 19H00 • MARSEILLE" : "STARTING AT 19H00 • MARSEILLE"}</div>
            <button className="btn btn-primary w-full mt-6">{language === 'fr' ? "RÉSERVER" : "RESERVE"}</button>
          </div>
        </div>
      </Section>

      {/* 7. LOCATION SECTION */}
      <Section id="venue" className="py-32">
        <div className="venue-header">
          <div className="venue-badge">
            <MapPin size={14} className="text-blue" />
            {language === 'fr' ? "LE LIEU" : "THE PLACE"}
          </div>
          <h2 className="venue-main-title">
            <span className="neon-text-blue">LA PLATEFORME</span>
          </h2>

          <div className="venue-info-bar">
            <div className="info-item-blue">{language === 'fr' ? "MARSEILLE, HUB" : "MARSEILLE, HUB"}<br />{language === 'fr' ? "CRÉATIF" : "CREATIVE"}</div>
            <div className="info-item-white"><strong>12 Rue d'Uzes, 13002</strong><br />Marseille</div>
            <div className="info-item-white">{language === 'fr' ? "ACCÈS TRAM T2/T3 ARRÊT ARENC LE SILO" : "TRAM T2/T3 STOP ARENC LE SILO"}</div>
          </div>
        </div>

        <div className="venue-cards-grid">
          <div className="venue-description-card border-blue">
            <h3 className="venue-card-title text-blue underline decoration-2 underline-offset-8">{language === 'fr' ? "SALLE DES SUCRES" : "SUGAR SALON"}</h3>
            <p className="venue-card-text">{language === 'fr' ? "Futur sanctuaire des conférences et de la remise des prix de Mars.A.I. Un espace majestueux alliant patrimoine et technologie." : "Future sanctuary for conferences and the awarding of prizes for Mars.A.I. A majestic space combining heritage and technology."}</p>
          </div>
          <div className="venue-description-card border-purple">
            <h3 className="venue-card-title text-purple-500 underline decoration-2 underline-offset-8">{language === 'fr' ? "SALLE PLAZA" : "PLAZA SALON"}</h3>
            <p className="venue-card-text">{language === 'fr' ? "L'épicentre du festival : accueil, animations, workshops et restauration. Le point de rencontre de tous les participants." : "The epicenter of the festival: reception, animations, workshops and catering. The meeting point for all participants."}</p>
          </div>
        </div>

        <div className="venue-map-wrapper">
          <div className="venue-map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2903.0132951923456!2d5.368406487830724!3d43.313981112461356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9c13ddc0211b9%3A0xd1642ae4b32c4bc4!2s%C3%89cole%20La%20Plateforme_%20Marseille%20-%20Entr%C3%A9e%20Sud!5e0!3m2!1sfr!2sfr!4v1771239065673!5m2!1sfr!2sfr"
              className="venue-map-iframe"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte de La Plateforme Marseille"
            />
            <a
              href="https://www.google.com/maps/search/?api=1&query=La+Plateforme+Marseille+12+Rue+d'Uzes+13002"
              target="_blank"
              rel="noopener noreferrer"
              className="venue-map-overlay"
            >
              <MapPin size={20} className="mr-2" />
              {language === 'fr' ? "Ouvrir dans Google Maps" : "Open in Google Maps"}
            </a>
          </div>
        </div>
      </Section>

      {/* 8. STATS NUMBERS SECTION */}
      <Section className="py-32">
        <div className="stats-numbers-container">
          <div className="stats-title-block">
            <h2 className="section-title-xl">{language === 'fr' ? "CHIFFRES" : "NUMBERS"}<br /><span className="stats-accent">{language === 'fr' ? "PROJETÉS" : "PROJECTED"}</span></h2>
            <p className="stats-tagline">{language === 'fr' ? "ÉCHELLE MONDIALE, IMPACT LOCAL." : "GLOBAL SCALE, LOCAL IMPACT."}</p>
          </div>

          <div className="stats-cards-wrapper">
            <div className="stats-number-card">
              <div className="stats-value">+120</div>
              <div className="stats-label">{language === 'fr' ? "PAYS REPRÉSENTÉS" : "REPRESENTED COUNTRIES"}</div>
            </div>
            <div className="stats-number-card">
              <div className="stats-value">+600</div>
              <div className="stats-label">{language === 'fr' ? "FILMS SOUMIS" : "SUBMITTED FILMS"}</div>
            </div>
          </div>
        </div>
      </Section>
      <Sponsors />

      <SubmitModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal} />
    </div>
  );
};

export default Home;
