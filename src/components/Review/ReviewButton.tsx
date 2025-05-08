import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface ReviewButtonProps {
  orderId: string;
  isReviewed: boolean;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({ orderId, isReviewed }) => {
  console.log("ReviewButton rendered with orderId:", orderId, "isReviewed:", isReviewed);
  
  if (isReviewed) {
    return (
      <div className="inline-flex items-center justify-center w-32 h-9 bg-green-100 text-green-600 rounded-lg">
        <FaStar className="mr-1" />
        <span className="text-sm">Đã đánh giá</span>
      </div>
    );
  }

  return (
    <Link
      to={`/review-gig/${orderId}`}
      className="inline-flex items-center justify-center w-32 h-9 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition duration-200 text-sm"
      onClick={() => console.log("Review button clicked for orderId:", orderId)}
    >
      <FaStar className="mr-1" />
      Đánh giá
    </Link>
  );
};

export default ReviewButton;