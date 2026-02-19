// frontend/src/components/coutndown/Countdown.jsx
import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import '../../styles.css';

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
    { label: 'Jours', value: days },
    { label: 'Heures', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Secondes', value: seconds }
  ];

  return (
    <div className={`countdown-container ${className}`}>
      <div className="countdown-grid">
        {timeUnits.map(({ label, value }, index) => (
          <div key={index} className="countdown-item">
            <div className="countdown-value-wrapper">
              <span className="countdown-value">{String(value).padStart(2, '0')}</span>
            </div>
            <span className="countdown-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;