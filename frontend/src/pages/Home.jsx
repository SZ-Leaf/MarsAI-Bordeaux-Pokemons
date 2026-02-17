import React from 'react';
import { ArrowRight, Plus, Calendar, Play, Users, Award, Clock, MapPin, Target, Zap, Rocket } from 'lucide-react';
import Card from '../components/cards/Card';
import '../App.css';
import './home.css';

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

// --- Page Data ---

const FEATURES = [
  { title: "1 MINUTE", description: "FORMAT ULTRA-COURT POUR UN IMPACT MAXIMUM.", className: "card-purple" },
  { title: "GRATUITÉ", description: "CONFÉRENCES ET WORKSHOPS ACCESSIBLES.", className: "card-green" },
  { title: "POUR TOUS", description: "PROFESSIONNELS, ÉTUDIANTS ET CURIEUX.", className: "card-pink" },
  { title: "EXPERTISE", description: "LEADERS MONDIAUX DE L'IA GÉNÉRATIVE.", className: "card-blue" }
];

const FILMS = [
  { title: "PROTOCOL ALPHA", director: "DIR. STARK", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" },
  { title: "NEURAL DREAM", director: "DIR. VANCE", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop" },
  { title: "CYBER MARSEILLE", director: "DIR. LUPIN", image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop" }
];

const STATS = [
  { title: "2 MOIS", subtitle: "DE PRÉPARATION", color: "text-purple-500" },
  { title: "50 FILMS", subtitle: "EN SÉLECTION", color: "text-emerald-400" },
  { title: "WEB 3.0", subtitle: "EXPÉRIENCE", color: "text-pink-500" },
  { title: "J4", subtitle: "MARSEILLE", color: "text-cyan-400" }
];

const CONFERENCES = [
  { title: "PROJECTIONS", description: "Diffusion sur écran géant en présence des réalisateurs.", icon: Play },
  { title: "WORKSHOPS", description: "Sessions pratiques pour maîtriser les outils IA.", icon: Users },
  { title: "AWARDS", description: "Cérémonie de clôture récompensant l'audace.", icon: Award }
];

const OBJECTIVES = [
  {
    title: "L'HUMAIN AU CENTRE",
    description: "METTRE L'HUMAIN AU CŒUR DE LA CRÉATION POUR NE PAS PERDRE L'ÉMOTION.",
    icon: Target,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10"
  },
  {
    title: "CHALLENGE CRÉATIF",
    description: "CHALLENGER LA CRÉATIVITÉ GRÂCE À UN FORMAT ULTRA-COURT DE 60S.",
    icon: Zap,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10"
  },
  {
    title: "FUTURS SOUHAITABLES",
    description: "EXPLORER LES FUTURS DÉSIRABLES VIA LES TECHNOLOGIES ÉMERGENTES.",
    icon: Rocket,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10"
  }
];

// --- Main Component ---

const Home = () => {
  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <main className="hero-section">
        <div className="hero-badge animate-fade-in">
          <span className="sparkle">✨</span>
          LE PROTOCOLE TEMPOREL 2026
        </div>

        <h1 className="hero-title">
          MARS<span className="gradient-text">AI</span>
        </h1>

        <h2 className="hero-subtitle">
          IMAGINEZ DES <span className="gradient-text-alt">FUTURS</span> SOUHAITABLES
        </h2>

        <div className="hero-description-container">
          <p className="hero-description">Le festival de courts-métrages de 60 secondes réalisés par IA.</p>
          <p className="hero-description">2 jours d'immersion au cœur de Marseille.</p>
        </div>

        <div className="hero-actions">
          <button className="btn btn-primary flex items-center gap-2 group">
            VOIR LES FILMS <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button className="btn btn-secondary flex items-center gap-2 group">
            MON ESPACE AI <Plus size={18} className="text-purple-400 transition-transform group-hover:rotate-90" />
          </button>
        </div>
      </main>

      {/* 2. FEATURES SECTION */}
      <Section className="py-20">
        <h2 className="section-title-xl text-center mb-16">
          L'IA SOUS <span className="stats-accent">TOUS SES ANGLES</span>
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
        <SectionLabel>LE PROJET MARS.A.I</SectionLabel>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className="section-title-xl section-title-huge">
              FILMS EN<br />
              <span className="fade-text">COMPÉTITION</span>
            </h2>
            <p className="section-description">
              Découvrez une sélection d'œuvres pionnières explorant les nouvelles frontières de l'imaginaire assisté par l'IA.
            </p>
          </div>

          <button className="view-selection-btn">
            VOIR LA SÉLECTION
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
        <h2 className="section-title-xl text-center mb-24">
          OBJECTIFS DU <span className="stats-accent">FESTIVAL</span>
        </h2>

        <div className="objectives-grid">
          {OBJECTIVES.map((obj, index) => {
            const Icon = obj.icon;
            return (
              <div key={index} className="objective-card">
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
          <SectionLabel centered>IMMERSION TOTALE</SectionLabel>
          <h2 className="section-title-xl">LE PROTOCOLE<br />TEMPOREL</h2>
        </div>

        <div className="stats-grid">
          {STATS.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className={`stat-value ${stat.color}`}>{stat.title}</h3>
              <p className="stat-subtitle">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        <button className="btn btn-adventure">REJOINDRE L'AVENTURE</button>
      </Section>

      {/* 5. CONFERENCES SECTION */}
      <Section id="conferences">
        <div className="conf-content-top">
          <h2 className="section-title-xl">
            DEUX JOURNÉES DE
          </h2>
          <span className="purple-underline">CONFÉRENCES GRATUITES</span>

          <div className="conf-info-container">
            <ol className="conf-list">
              <li>Débats engagés sur l'éthique et le future</li>
              <li>Confrontations d'idées entre artistes et tech</li>
              <li>Interrogations stimulantes sur la création</li>
            </ol>

            <button className="btn-agenda">
              <Calendar size={18} className="text-pink-400" />
              AGENDA COMPLET
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
            <div className="night-badge">SOIRÉE DE CLÔTURE</div>
            <h2 className="night-title">MARS.A.I<br /><span className="night-accent">NIGHT</span></h2>
            <div className="night-description">
              <p>Fête Électro mêlant IA et futurs souhaitables.</p>
              <p>Une expérience immersive sonore et visuelle.</p>
            </div>
          </div>

          <div className="night-card">
            <div className="night-card-icon"><Clock size={48} /></div>
            <div className="night-card-date">13 JUIN</div>
            <div className="night-card-info">DÈS 19H00 • MARSEILLE</div>
            <button className="btn btn-primary w-full mt-6">RÉSERVER</button>
          </div>
        </div>
      </Section>

      {/* 7. LOCATION SECTION */}
      <Section id="venue" className="py-32">
        <div className="venue-header">
          <div className="venue-badge">
            <MapPin size={14} className="text-blue" />
            LE LIEU
          </div>
          <h2 className="venue-main-title">LA<span className="neon-text-blue">PLATEFORME</span></h2>

          <div className="venue-info-bar">
            <div className="info-item-blue">MARSEILLE, HUB<br />CRÉATIF</div>
            <div className="info-item-white"><strong>12 Rue d'Uzes, 13002</strong><br />Marseille</div>
            <div className="info-item-white">ACCÈS TRAM T2/T3 ARRÊT ARENC LE SILO</div>
          </div>
        </div>

        <div className="venue-cards-grid">
          <div className="venue-description-card">
            <h3 className="venue-card-title text-blue underline decoration-2 underline-offset-8">SALLE DES SUCRES</h3>
            <p className="venue-card-text">Futur sanctuaire des conférences et de la remise des prix de Mars.A.I. Un espace majestueux alliant patrimoine et technologie.</p>
          </div>
          <div className="venue-description-card">
            <h3 className="venue-card-title text-purple-500 underline decoration-2 underline-offset-8">SALLE PLAZA</h3>
            <p className="venue-card-text">L'épicentre du festival : accueil, animations, workshops et restauration. Le point de rencontre de tous les participants.</p>
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
              Ouvrir dans Google Maps
            </a>
          </div>
        </div>
      </Section>

      {/* 8. STATS NUMBERS SECTION */}
      <Section className="py-32">
        <div className="stats-numbers-container">
          <div className="stats-title-block">
            <h2 className="section-title-xl">CHIFFRES<br /><span className="stats-accent">PROJETÉS</span></h2>
            <p className="stats-tagline">ÉCHELLE MONDIALE, IMPACT LOCAL.</p>
          </div>

          <div className="stats-cards-wrapper">
            <div className="stats-number-card">
              <div className="stats-value">+120</div>
              <div className="stats-label">PAYS REPRÉSENTÉS</div>
            </div>
            <div className="stats-number-card">
              <div className="stats-value">+600</div>
              <div className="stats-label">FILMS SOUMIS</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
