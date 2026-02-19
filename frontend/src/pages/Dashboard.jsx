import React, { useState } from 'react';
import SideBar from '../components/admin/SideBar';
import Header from '../components/layout/header/Header';
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import VideoGallery from '../components/admin/VideoGallery';
import AdminEvents from '../components/admin/AdminEvents';
import AdminNewsletter from '../components/admin/AdminNewsletter';
import '../styles.css';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Map view keys to components
  const viewComponents = {
    overview: AdminOverview,
    users: AdminUsers,
    films: VideoGallery,
    events: AdminEvents,
    newsletter: AdminNewsletter,
    config: () => (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="section-title">Configuration</h1>
        <p className="section-subtitle">
          Les paramètres généraux du festival seront bientôt disponibles ici.
        </p>
      </div>
    ),
  };

  const ActiveComponent =
    viewComponents[activeView] || AdminOverview;

  return (
    <div className="admin-dashboard-container">
      <SideBar
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <main className="main-content">
        {!isDetailOpen && <Header />}
        <ActiveComponent onDetailToggle={setIsDetailOpen} />
      </main>
    </div>
  );
};

export default Dashboard;
