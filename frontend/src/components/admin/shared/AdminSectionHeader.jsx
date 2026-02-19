import React from 'react';
import '../../../styles.css';

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
          className={`admin-action-btn admin-action-btn-${action.color || 'gray'}`}
        >
          {action.icon && <action.icon size={18} className="mr-2" />}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default AdminSectionHeader;
