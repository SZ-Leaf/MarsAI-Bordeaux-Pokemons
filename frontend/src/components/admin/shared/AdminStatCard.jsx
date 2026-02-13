import React from 'react';

const AdminStatCard = ({ title, value, subtitle, badge, badgeColor, progress, progressColor, buttonText, icon: Icon, iconColor = "text-blue-400" }) => (
  <div className="stat-card">
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg ${iconColor.replace('text', 'bg').replace('-400', '-500')}/10`}>
        {Icon && <Icon size={18} className={iconColor} />}
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

export default AdminStatCard;
