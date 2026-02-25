import React, { useState, useEffect } from 'react';
import { SideBar } from '../components/features/admin/AdminLayout';
import { Header } from '../components/layout';
import { AdminOverview, AdminUsers, VideoGallery, AdminEvents, AdminNewsletter, AdminInvitations, AdminConfig } from '../components/features/admin';
import '../styles/main.css';

const VALID_VIEWS = ['overview', 'users', 'films', 'events', 'newsletter', 'invitations', 'config'];

const getViewFromHash = () => {
  const h = window.location.hash.slice(1);
  return VALID_VIEWS.includes(h) ? h : 'overview';
};

const Dashboard = () => {
  const [activeView, setActiveView] = useState(getViewFromHash);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Map view keys to components
  const viewComponents = {
    overview: AdminOverview,
    users: AdminUsers,
    films: VideoGallery,
    events: AdminEvents,
    newsletter: AdminNewsletter,
    invitations: AdminInvitations,
    config: AdminConfig,
  };

  const ActiveComponent = viewComponents[activeView] || AdminOverview;

  
  const handleViewChange = (id) => {
    setActiveView(id);
    window.history.replaceState(null, '', `${window.location.pathname}#${id}`);
  };

  useEffect(() => {
    const onHashChange = () => setActiveView(getViewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="admin-dashboard-container">
      <SideBar
        activeView={activeView}
        onViewChange={handleViewChange}
      />

      <main className="main-content main-content--dashboard">
        {!isDetailOpen && <Header />}
        <ActiveComponent onDetailToggle={setIsDetailOpen} />
      </main>
    </div>
  );
};

export default Dashboard;
