import React from 'react';
import '../../../styles/main.css';

/**
 * Card Component
 * 
 * @param {Object} props
 * @param {string} props.type - 'text' or 'image'
 * @param {string} props.title - Main title of the card
 * @param {string} props.description - Description or content (for text card)
 * @param {string} props.subtitle - Subtitle (for image card)
 * @param {string} props.image - Image source URL
 * @param {string} props.className - Additional CSS classes
 */
const Card = ({ type = 'text', title, description, subtitle, image, className = '' }) => {
  if (type === 'image') {
    return (
      <div className={`card ${className}`}>
        <div className="card-image-container">
          <img src={image} alt={title} />
        </div>
        <div className="card-content">
          <h3 className="card-image-title">{title}</h3>
          {subtitle && <p className="card-image-subtitle">{subtitle}</p>}
        </div>
      </div>
    );
  }

  // Default: Text Card
  return (
    <div className={`card card-text ${className}`}>
      <h2 className="card-title-accent">{title}</h2>
      {description && <p className="card-description">{description}</p>}
    </div>
  );
};

export default Card;
