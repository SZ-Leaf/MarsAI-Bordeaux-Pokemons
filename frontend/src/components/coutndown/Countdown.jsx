// frontend/src/components/coutndown/Countdown.jsx
import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import './countdown.css';

const Countdown = ({ targetDate, className = '' }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className={`countdown-container ${className}`}>
        <div className="countdown-expired">
          <h3 className="countdown-expired-title">Le compte à rebours est terminé</h3>
        </div>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Jours', value: days, unit: 'd' },
    { label: 'Heures', value: hours, unit: 'h' },
    { label: 'Minutes', value: minutes, unit: 'm' },
    { label: 'Secondes', value: seconds, unit: 's' }
  ];

  return (
    <div className={`countdown-container ${className}`}>
      <div className="countdown-grid">
        {timeUnits.map(({ label, value, unit }, index) => (
          <div key={index} className="countdown-item">
            <div className="countdown-value-wrapper">
              <span className="countdown-value">{String(value).padStart(2, '0')}</span>
            </div>
            <span className="countdown-label">{label}</span>
            <span className="countdown-unit">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;