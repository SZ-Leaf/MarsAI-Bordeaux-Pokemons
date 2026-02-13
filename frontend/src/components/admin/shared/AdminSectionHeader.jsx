import React from 'react';

const AdminSectionHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && (
        <button 
          onClick={action.onClick}
          className={`px-6 py-3 rounded-xl flex items-center font-bold transition-all shadow-lg ${
            action.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' :
            action.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' :
            action.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20' :
            action.color === 'pink' ? 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/20' :
            'bg-gray-800 hover:bg-gray-700 shadow-gray-900/20'
          } text-white`}
        >
          {action.icon && <action.icon size={18} className="mr-2" />}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default AdminSectionHeader;
