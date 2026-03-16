import React from 'react';
import '../../../../../styles/main.css';

const AdminSectionHeader = ({ title, subtitle, action }) => {
  return (
    <div className="admin-section-header">
      <div>
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && (
        <button 
          onClick={action.onClick}
          className={`admin-action-btn admin-action-btn-${action.color || 'gray'} flex items-center justify-center p-3 md:px-6 md:py-3`}
          title={action.label}
        >
          {action.icon && <action.icon size={20} className="md:mr-2" />}
          <span className="hidden md:inline">{action.label}</span>
        </button>
      )}
    </div>
  );
};

export default AdminSectionHeader;
