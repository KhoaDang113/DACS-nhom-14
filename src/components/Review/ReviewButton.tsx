import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';

interface ReviewButtonProps {
  orderId: string;
  isReviewed: boolean;
  gigId?: string;
  reviewId?: string;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({ 
  orderId, 
  isReviewed, 
  gigId, 
  reviewId 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isReviewed && gigId && reviewId) {
      // Nếu đã đánh giá, điều hướng đến trang chi tiết gig với reviewId để highlight đánh giá
      navigate(`/gig/${gigId}?reviewId=${reviewId}`);
    } else {
      // Nếu chưa đánh giá, điều hướng đến trang đánh giá
      navigate(`/review-gig/${orderId}`);
    }
  };

  // Trả về nút phù hợp với trạng thái đánh giá
  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1.5 rounded-md text-xs flex items-center ${
        isReviewed
          ? 'bg-green-50 text-green-700 border border-green-300'
          : 'bg-blue-50 text-blue-700 border border-blue-300'
      }`}
    >
      {isReviewed ? (
        <>
          <Eye size={14} className="mr-1" />
          Xem đánh giá
        </>
      ) : (
        <>
          <Star size={14} className="mr-1" />
          Đánh giá
        </>
      )}
    </button>
  );
};

export default ReviewButton;