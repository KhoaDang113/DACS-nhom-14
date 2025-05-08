import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, ThumbsUp, Send } from 'lucide-react';
import { CustomerReview, formatRelativeTime, calculateAverageRating } from '../../lib/reviewData';

interface CustomerReviewsProps {
  reviews: CustomerReview[];
  showGigTitle?: boolean;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  showGigTitle = true,
}) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const averageRating = calculateAverageRating(reviews);

  const handleReplyClick = (reviewId: string) => {
    setActiveReplyId(activeReplyId === reviewId ? null : reviewId);
    setReplyText('');
  };

  const handleSubmitReply = (reviewId: string) => {
    if (replyText.trim()) {
      // Xử lý logic gửi phản hồi ở đây
      console.log('Gửi phản hồi:', { reviewId, replyText });
      setReplyText('');
      setActiveReplyId(null);
    }
  };

  // Tạo JSX render cho số sao
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          let starClass = "text-gray-300";
          if (rating >= star) starClass = "text-yellow-400 fill-yellow-400";
          else if (rating >= star - 0.5) starClass = "text-yellow-400 fill-yellow-400 opacity-90";
          
          return (
            <Star 
              key={star} 
              size={16} 
              className={starClass} 
            />
          );
        })}
        <span className="ml-2 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tiêu đề và thông tin tổng quan */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Đánh giá từ khách hàng</h2>
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={18} 
                  className={`${star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                />
              ))}
            </div>
            <span className="font-medium">{averageRating}/5</span>
            <span className="text-gray-500 ml-2">({reviews.length} đánh giá)</span>
          </div>
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="divide-y divide-gray-100">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex gap-4">
                {/* Phần avatar */}
                <div className="flex-shrink-0">
                  <img 
                    src={review.customerAvatar} 
                    alt={`${review.customerName}`} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                </div>
                
                {/* Phần nội dung */}
                <div className="flex-grow">
                  <div className="flex flex-wrap items-start justify-between mb-2">
                    <div>
                      <Link to={`/user/${review.customerId}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        {review.customerName}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">{formatRelativeTime(review.date)}</div>
                    </div>
                    
                    <div className="mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  {/* Tên dịch vụ */}
                  {showGigTitle && (
                    <Link 
                      to={`/gig/${review.gigId}`}
                      className="inline-block mt-1 mb-3 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {review.gigTitle}
                    </Link>
                  )}
                  
                  {/* Nội dung comment */}
                  <div className="mt-2">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                  
                  {/* Tương tác */}
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <button className="flex items-center mr-4 hover:text-blue-600 transition-colors">
                      <ThumbsUp size={14} className="mr-1" />
                      Yes
                    </button>
                    <button className="flex items-center mr-4 hover:text-blue-600 transition-colors">
                      <ThumbsUp size={14} className="mr-1" />
                      No
                    </button>
                    <button 
                      className="flex items-center hover:text-blue-600 transition-colors"
                      onClick={() => handleReplyClick(review.id)}
                    >
                      <MessageCircle size={14} className="mr-1" />
                      Phản hồi
                    </button>
                  </div>

                  {/* Form phản hồi */}
                  {activeReplyId === review.id && (
                    <div className="mt-4">
                      <div className="flex items-start space-x-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Viết phản hồi của bạn..."
                          className="flex-1 min-h-[80px] p-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        />
                        <button
                          onClick={() => handleSubmitReply(review.id)}
                          disabled={!replyText.trim()}
                          className="px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500">
            <p>Chưa có đánh giá nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;