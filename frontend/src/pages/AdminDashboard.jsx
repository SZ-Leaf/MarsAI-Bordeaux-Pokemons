import React, { useState } from 'react';
import { SideBar } from '../components/features/admin/AdminLayout';
import { Header } from '../components/layout';
import { AdminOverview, AdminUsers, AdminVideos, AdminEvents, AdminNewsletter } from '../components/features/admin';
import '../styles.css';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <AdminUsers />;
      case 'films':
        return <AdminVideos />;
      case 'events':
        return <AdminEvents />;
      case 'newsletter':
        return <AdminNewsletter />;
      case 'config':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h1 className="section-title">Configuration</h1>
            <p className="section-subtitle">Les paramètres généraux du festival seront bientôt disponibles ici.</p>
          </div>
        );
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <SideBar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="main-content">
        <Header />
        <div className="mt-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
