import React from 'react';
import { 
  Play, 
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  Globe,
  Users as UsersIcon,
  Film
} from 'lucide-react';
import SideBar from '../components/admin/SideBar';
import Header from '../components/layout/header/Header';
import '../components/admin/admin.css';

const StatCard = ({ title, value, subtitle, badge, badgeColor, progress, progressColor, buttonText }) => (
  <div className="stat-card">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-blue-500/10 rounded-lg">
        <Film size={18} className="text-blue-400" />
      </div>
      {badge && (
        <span className={`stat-badge ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    
    <div className="mt-4">
      <h2 className="stat-value">{value}</h2>
      <p className="stat-label">{title}</p>
      {subtitle && <p className="text-[10px] text-gray-500 font-bold mb-2">{subtitle}</p>}
    </div>

    {progress !== undefined && (
      <div className="progress-container">
        <div 
          className={`progress-fill ${progressColor}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    )}

    {buttonText && (
      <button className="mt-4 w-full border border-gray-700 hover:bg-white/5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors">
        {buttonText}
      </button>
    )}
  </div>
);

const FilmItem = ({ rank, title, likes, comments, imageUrl }) => (
  <div className="film-item">
    <div className="flex items-center">
      <span className="top-film-rank">#{rank}</span>
      <img src={imageUrl} alt={title} className="film-thumbnail" />
      <div>
        <h4 className="text-sm font-bold text-blue-400">{title}</h4>
        <div className="flex mt-1">
          <div className="film-stat-item">
            <ThumbsUp size={12} className="mr-1" />
            {likes}
          </div>
          {comments && (
            <div className="film-stat-item">
              <MessageSquare size={12} className="mr-1" />
              {comments}
            </div>
          )}
        </div>
      </div>
    </div>
    <button className="play-btn">
      <Play size={14} fill="currentColor" />
    </button>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <SideBar />
      
      <main className="main-content">
        {/* Header */}
        <Header />

        {/* Banner */}
        <div className="relative group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200" 
            alt="Festival Banner" 
            className="banner-img"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl"></div>
        </div>

        {/* Title Section */}
        <div className="mt-10 mb-8">
          <h1 className="section-title">Vue d'ensemble</h1>
          <p className="section-subtitle">
            Analyse détaillée de la progression du festival et des indicateurs de performance.
          </p>
        </div>

        {/* First Row of Stats */}
        <div className="stats-grid">
          <StatCard 
            title="Films évalués par le jury"
            value="482"
            subtitle="80.3% COMPLETE"
            badge="OBJECTIF: 600"
            badgeColor="text-green-400 bg-green-400/10"
            progress={80.3}
            progressColor="bg-blue-500"
          />
          <StatCard 
            title="Jurés ayant finalisé leur lot"
            value="08/12"
            subtitle="EN COURS DE LIBERATION"
            badge="QUOTA: 100/JURE"
            badgeColor="text-orange-400 bg-orange-400/10"
            progress={65}
            progressColor="bg-orange-500"
          />
          <StatCard 
            title="Pays représentés"
            value="124"
            subtitle="TOP ZONE: EUROPE"
            badge={<Globe size={14} />}
            badgeColor="text-blue-400 bg-blue-400/10"
          />
          <StatCard 
            title="Taux d'occupation workshops"
            value="86%"
            badge={<div className="w-4 h-3 bg-green-500 rounded-sm"></div>}
            buttonText="Voir les evenements"
          />
        </div>

        {/* Second Row: Submissions and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <UsersIcon size={18} className="text-blue-400" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-green-400/10 text-green-400">
                + 8 aujourd'hui
              </span>
            </div>
            <div className="mt-10">
              <h2 className="text-5xl font-bold mb-2">182</h2>
              <p className="stat-label">Comptes réalisateur actifs</p>
            </div>
          </div>

          <div className="chart-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Vues & Votes</h3>
              <div className="flex items-center text-[10px] text-gray-500 bg-[#0a0a0a] px-3 py-1 rounded-full border border-gray-800 cursor-pointer">
                7 derniers jours <ChevronRight size={12} className="ml-1 rotate-90" />
              </div>
            </div>
            
            <div className="h-32 w-full relative mt-4">
              {/* Mock SVG Chart */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,60 C40,70 60,80 100,50 C140,20 160,50 200,40 C240,30 260,60 300,50 C340,40 360,30 400,20 L400,100 L0,100 Z" 
                  fill="url(#chartGradient)"
                />
                <path 
                  d="M0,60 C40,70 60,80 100,50 C140,20 160,50 200,40 C240,30 260,60 300,50 C340,40 360,30 400,20" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2"
                />
                {/* Dots */}
                {[0, 100, 200, 300, 400].map((x, i) => {
                    const y = [60, 50, 40, 50, 20][i];
                    return <circle key={i} cx={x} cy={y} r="3" fill="white" />;
                })}
              </svg>
              <div className="flex justify-between mt-4 text-[8px] text-gray-500 uppercase font-bold px-1">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mer</span>
                <span>Jeu</span>
                <span>Ven</span>
                <span>Sam</span>
                <span>Dim</span>
              </div>
              
              {/* Grid lines placeholder */}
              <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between opacity-5 pointer-events-none">
                <div className="border-t border-white w-full"></div>
                <div className="border-t border-white w-full"></div>
                <div className="border-t border-white w-full"></div>
                <div className="border-t border-white w-full"></div>
              </div>
              <div className="absolute -left-6 top-0 bottom-6 flex flex-col justify-between text-[8px] text-gray-700 font-bold pr-2">
                <span>120</span>
                <span>80</span>
                <span>40</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Films Section */}
        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Top Films (Communauté)</h3>
          </div>
          
          <div className="space-y-4">
            <FilmItem 
              rank={1} 
              title="Red Horizon" 
              likes="4.2k" 
              comments="342" 
              imageUrl="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=200"
            />
            <FilmItem 
              rank={2} 
              title="The Signal" 
              likes="3.8k" 
              imageUrl="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=200"
            />
            <FilmItem 
              rank={3} 
              title="Synthetic Dreams" 
              likes="2.1k" 
              imageUrl="https://images.unsplash.com/photo-1535016120720-40c646bebbbb?auto=format&fit=crop&q=80&w=200"
            />
          </div>

          <div className="flex justify-center mt-8">
            <button className="flex items-center text-xs text-gray-500 hover:text-white transition-colors">
              Voir tout le classement <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
