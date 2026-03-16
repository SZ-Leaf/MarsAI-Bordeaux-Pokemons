import React, { useState, useEffect } from 'react';
import { SideBar } from '../components/features/admin/AdminLayout';
import { Header } from '../components/layout';
import { AdminOverview, AdminUsers, VideoGallery, AdminEvents, AdminNewsletter, AdminInvitations, AdminConfig, AdminReports } from '../components/features/admin';
import { Menu, X } from 'lucide-react';
import '../styles/main.css';

const VALID_VIEWS = ['overview', 'users', 'films', 'reports', 'events', 'newsletter', 'invitations', 'config'];

const getViewFromHash = () => {
  const h = window.location.hash.slice(1);
  return VALID_VIEWS.includes(h) ? h : 'overview';
};

const Dashboard = () => {
  const [activeView, setActiveView] = useState(getViewFromHash);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Map view keys to components
  const viewComponents = {
    overview: AdminOverview,
    users: AdminUsers,
    films: VideoGallery,
    reports: AdminReports,
    events: AdminEvents,
    newsletter: AdminNewsletter,
    invitations: AdminInvitations,
    config: AdminConfig,
  };

  const ActiveComponent = viewComponents[activeView] || AdminOverview;

  
  const handleViewChange = (id) => {
    setActiveView(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
    window.history.replaceState(null, '', `${window.location.pathname}#${id}`);
  };

  useEffect(() => {
    const onHashChange = () => setActiveView(getViewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className={`admin-dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-toggle md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <SideBar
        activeView={activeView}
        onViewChange={handleViewChange}
        isOpen={isSidebarOpen}
      />

      <main className="main-content main-content--dashboard">
        {!isDetailOpen && <Header />}
        <ActiveComponent onDetailToggle={setIsDetailOpen} />
      </main>
    </div>
  );
};

export default Dashboard;
