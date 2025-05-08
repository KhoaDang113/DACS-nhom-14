import React from 'react';

interface ReviewCardProps {
  review: {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user?: {
      name?: string;
      avatar?: string;
    };
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div id={`review-${review._id}`} className="bg-white p-4 rounded-lg shadow mb-4 transition-all duration-300">
      {/* ...existing code... */}
    </div>
  );
};

export default ReviewCard;