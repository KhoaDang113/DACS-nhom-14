import { Star } from "lucide-react";

interface ReviewProps {
  id: string;
  avatar: string;
  username: string;
  comment: string;
  rating: number;
  date: string;
}

interface SellerReviewsProps {
  reviews: ReviewProps[];
}

const ReviewItem = ({ avatar, username, comment, rating, date }: ReviewProps) => {
  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img 
          src={avatar} 
          alt={`${username}'s avatar`} 
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{username}</h4>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        
        {/* Rating Stars */}
        <div className="flex items-center mb-3">
          {Array(5).fill(0).map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={`${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} 
            />
          ))}
        </div>
        
        {/* Comment */}
        <p className="text-gray-700">{comment}</p>
      </div>
    </div>
  );
};

const SellerReviews = ({ reviews }: SellerReviewsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Đánh giá của khách hàng</h3>
      
      {/* Reviews list */}
      <div className="divide-y divide-gray-100">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewItem
              key={review.id}
              id={review.id}
              avatar={review.avatar}
              username={review.username}
              comment={review.comment}
              rating={review.rating}
              date={review.date}
            />
          ))
        ) : (
          <p className="py-4 text-gray-500 text-center">Chưa có đánh giá nào</p>
        )}
      </div>
    </div>
  );
};

export default SellerReviews;