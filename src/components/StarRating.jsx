import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, size = 18, onClick }) => {
  // Round to nearest half (e.g., 3.2 -> 3.0, 4.6 -> 4.5)
  const roundedRating = Math.round(rating * 2) / 2;

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (roundedRating >= i) {
      stars.push(<FaStar key={i} size={size} color="#ffc107" />);
    } else if (roundedRating + 0.5 === i) {
      stars.push(<FaStarHalfAlt key={i} size={size} color="#ffc107" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} color="#ccc" />);
    }
  }

  return (
    <div
      className="d-flex align-items-center"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      title={`Average rating: ${rating.toFixed(1)}`}
    >
      {stars}
    </div>
  );
};

export default StarRating;
