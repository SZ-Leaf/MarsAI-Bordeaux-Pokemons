import React from 'react';
import { ArrowRight, Plus, Calendar, Play, Users, Award, Clock, MapPin } from 'lucide-react';
import Card from '../components/cards/Card';
import '../App.css';
import './home.css';

const Home = () => {
  const features = [
    {
      title: "1 MINUTE",
      description: "FORMAT ULTRA-COURT POUR UN IMPACT MAXIMUM.",
      className: "card-purple"
    },
    {
      title: "GRATUITÉ",
      description: "CONFÉRENCES ET WORKSHOPS ACCESSIBLES.",
      className: "card-green"
    },
    {
      title: "POUR TOUS",
      description: "PROFESSIONNELS, ÉTUDIANTS ET CURIEUX.",
      className: "card-pink"
    },
    {
      title: "EXPERTISE",
      description: "LEADERS MONDIAUX DE L'IA GÉNÉRATIVE.",
      className: "card-blue"
    }
  ];

  const films = [
    {
      title: "PROTOCOL ALPHA",
      director: "DIR. STARK",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "NEURAL DREAM",
      director: "DIR. VANCE",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "CYBER MARSEILLE",
      director: "DIR. LUPIN",
      image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const stats = [
    { title: "2 MOIS", subtitle: "DE PRÉPARATION", color: "text-purple-500" },
    { title: "50 FILMS", subtitle: "EN SÉLECTION", color: "text-emerald-400" },
    { title: "WEB 3.0", subtitle: "EXPÉRIENCE", color: "text-pink-500" },
    { title: "J4", subtitle: "MARSEILLE", color: "text-cyan-400" }
  ];

  const conferenceCards = [
    {
      title: "PROJECTIONS",
      description: "Diffusion sur écran géant en présence des réalisateurs.",
      icon: Play,
      className: ""
    },
    {
      title: "WORKSHOPS",
      description: "Sessions pratiques pour maîtriser les outils IA.",
      icon: Users,
      className: ""
    },
    {
      title: "AWARDS",
      description: "Cérémonie de clôture récompensant l'audace.",
      icon: Award,
      className: ""
    }
  ];

  return (
    <div className="home-container">
      <main className="hero-section">
        {/* Badge / Pill */}
        <div className="hero-badge animate-fade-in">
          <span className="sparkle">✨</span>
          LE PROTOCOLE TEMPOREL 2026
        </div>

        {/* Main Title */}
        <h1 className="hero-title">
          MARS<span className="gradient-text">AI</span>
        </h1>

        {/* Subtitle / Catchphrase */}
        <h2 className="hero-subtitle">
          IMAGINEZ DES <span className="gradient-text-alt">FUTURS</span> SOUHAITABLES
        </h2>

        {/* Descriptions */}
        <div className="hero-description-container">
          <p className="hero-description">
            Le festival de courts-métrages de 60 secondes réalisés par IA.
          </p>
          <p className="hero-description">
            2 jours d'immersion au cœur de Marseille.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="hero-actions">
          <button className="btn btn-primary flex items-center gap-2 group">
            VOIR LES FILMS <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button className="btn btn-secondary flex items-center gap-2 group">
            MON ESPACE AI <Plus size={18} className="text-purple-400 transition-transform group-hover:rotate-90" />
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card
              key={index}
              type="text"
              title={feature.title}
              description={feature.description}
              className={`feature-card ${feature.className}`}
            />
          ))}
        </div>
      </section>

      {/* Films Section */}
      <section className="films-section">
        <div className="section-header">
          <div className="section-label">
            <span className="line"></span>
            LE PROJET MARS.A.I
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div className="max-w-2xl">
              <h2 className="section-title">
                FILMS EN<br />
                <span className="fade-text">COMPÉTITION</span>
              </h2>
              <p className="section-description">
                Découvrez une sélection d'œuvres pionnières explorant les 
                nouvelles frontières de l'imaginaire assisté par l'IA.
              </p>
            </div>
            
            <button className="view-selection-btn">
              VOIR LA SÉLECTION
              <div className="arrow-circle">
                <ArrowRight size={20} />
              </div>
            </button>
          </div>
        </div>

        <div className="films-grid">
          {films.map((film, index) => (
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
      </section>

      {/* Protocol Section */}
      <section className="protocol-section">
        <div className="section-header-centered">
          <div className="centered-label">
            <span className="line"></span>
            IMMERSION TOTALE
            <span className="line"></span>
          </div>
          <h2 className="protocol-title">
            LE PROTOCOLE<br />
            TEMPOREL
          </h2>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className={`stat-value ${stat.color}`}>{stat.title}</h3>
              <p className="stat-subtitle">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="protocol-actions">
          <button className="btn btn-adventure">
            REJOINDRE L'AVENTURE
          </button>
        </div>
      </section>

      {/* Conferences Section */}
      <section className="conferences-section">
        <div className="conf-content-top">
          <h2 className="conf-title">
            DEUX JOURNÉES DE<br />
            <span className="purple-underline">CONFÉRENCES GRATUITES</span>
          </h2>

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
          {conferenceCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={`conf-card ${card.className}`}>
                <div className="conf-card-icon">
                  <Icon size={32} />
                </div>
                <h3 className="conf-card-title">{card.title}</h3>
                <p className="conf-card-description">{card.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Night Section */}
      <section className="night-section">
        <div className="night-container">
          <div className="night-content">
            <div className="night-badge">
              SOIRÉE DE CLÔTURE
            </div>
            
            <h2 className="night-title">
              MARS.A.I<br />
              <span className="night-accent">NIGHT</span>
            </h2>

            <div className="night-description">
              <p>Fête Électro mêlant IA et futurs souhaitables.</p>
              <p>Une expérience immersive sonore et visuelle.</p>
            </div>
          </div>

          <div className="night-card">
            <div className="night-card-icon">
              <Clock size={48} />
            </div>
            <div className="night-card-date">13 JUIN</div>
            <div className="night-card-info">DÈS 19H00 • MARSEILLE</div>
            <button className="btn btn-primary w-full mt-6">
              RÉSERVER
            </button>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="venue-section">
        <div className="venue-header">
          <div className="venue-badge">
            <MapPin size={14} className="text-blue" />
            LE LIEU
          </div>
          
          <h2 className="venue-main-title">
            LA<span className="outline-text">PLATEFORME</span>
          </h2>

          <div className="venue-info-bar">
            <div className="info-item-blue">
              MARSEILLE, HUB<br />CRÉATIF
            </div>
            <div className="info-item-white">
              <strong>12 Rue d'Uzes, 13002</strong><br />
              Marseille
            </div>
            <div className="info-item-white">
              ACCÈS TRAM T2/T3 ARRÊT ARENC LE SILO
            </div>
          </div>
        </div>

        <div className="venue-cards-grid">
          <div className="venue-description-card">
            <h3 className="venue-card-title text-blue underline decoration-2 underline-offset-8">SALLE DES SUCRES</h3>
            <p className="venue-card-text">
              Futur sanctuaire des conférences et de la remise des prix de Mars.A.I. Un espace majestueux alliant patrimoine et technologie.
            </p>
          </div>
          <div className="venue-description-card">
            <h3 className="venue-card-title text-purple-500 underline decoration-2 underline-offset-8">SALLE PLAZA</h3>
            <p className="venue-card-text">
              L'épicentre du festival : accueil, animations, workshops et restauration. Le point de rencontre de tous les participants.
            </p>
          </div>
        </div>

        <div className="venue-map-container">
          <img 
            src="/assets/Image_16-02-2026_a__10.57-7af8ed09-5380-46f4-b80c-92927634b0f5.png" 
            alt="Carte Marseille La Plateforme" 
            className="venue-map-image"
          />
        </div>
      </section>

      {/* Stats Numbers Section */}
      <section className="stats-numbers-section">
        <div className="stats-numbers-container">
          <div className="stats-title-block">
            <h2 className="stats-main-title">
              CHIFFRES<br />
              <span className="stats-accent">PROJETÉS</span>
            </h2>
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
      </section>
    </div>
  );
};

export default Home;
