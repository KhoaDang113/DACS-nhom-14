import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface RatingStarsProps {
  initialRating: number;
  onChange: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  initialRating = 0, 
  onChange, 
  size = 24,
  interactive = true
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(initialRating);

  const handleClick = (value: number) => {
    if (!interactive) return;
    
    // Hỗ trợ đánh giá nửa sao
    if (value === rating) {
      const newRating = value - 0.5;
      setRating(newRating);
      onChange(newRating);
    } else {
      setRating(value);
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!interactive) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(null);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating !== null ? hoverRating : rating;

    for (let i = 1; i <= 5; i++) {
      const starValue = i;

      stars.push(
        <div 
          key={i}
          className="star-container relative"
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          {/* Ngôi sao màu xám (nền) */}
          <FaStar 
            className="text-gray-300" 
            size={size}
          />
          
          {/* Ngôi sao màu vàng (overlay) với chiều rộng dựa trên đánh giá */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              overflow: 'hidden',
              width: `${displayRating >= starValue 
                ? '100%' 
                : displayRating > starValue - 1 
                  ? `${(displayRating - (starValue - 1)) * 100}%` 
                  : '0%'
              }`
            }}
          >
            <FaStar 
              className="text-yellow-400" 
              size={size}
            />
          </div>
        </div>
      );
    }
    
    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      {renderStars()}
      {interactive && (
        <span className="ml-2 text-gray-700 font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default RatingStars;