import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  value = 0, 
  onChange, 
  maxStars = 10, 
  size = 25,
  readOnly = false,
  showLabel = false 
}) => {
  const [hoveredValue, setHoveredValue] = useState(0);

  const handleClick = (starValue) => {
    if (!readOnly && onChange) {
      onChange(starValue);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (!readOnly) {
      setHoveredValue(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoveredValue(0);
    }
  };

  const displayValue = hoveredValue || value;

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-center">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayValue;

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readOnly}
              className={`transition-transform focus:outline-none ${
                readOnly ? 'cursor-default' : 'hover:scale-110 cursor-pointer'
              }`}
            >
              <Star
                size={size}
                fill={isFilled ? '#FFD700' : 'none'}
                stroke={isFilled ? '#FFD700' : '#999'}
                className="transition-colors"
              />
            </button>
          );
        })}
      </div>
      {showLabel && value > 0 && (
        <p className="text-center text-sm text-white/60">
          Note sélectionnée : {value}/{maxStars}
        </p>
      )}
    </div>
  );
};

export default StarRating;
