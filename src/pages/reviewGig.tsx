import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import OrderSummary from '../components/Review/OrderSummary';
import GigReviewForm from '../components/Review/GigReviewForm';
import { Star, MessageCircle, Check } from 'lucide-react';

// Interface cho đơn hàng đã hoàn thành cần đánh giá
interface CompletedOrder {
  id: string;
  gigId: string;
  gigTitle: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string; 
  completedDate: Date;
  price: number;
  orderDuration: number;
  isReviewed: boolean;
}

// Interface cho đánh giá đã tồn tại
interface ExistingReview {
  _id: string;
  star: number;
  title: string;
  description: string;
  createdAt: string;
}

const ReviewGigPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<CompletedOrder | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      
      try {
        // Gọi API để lấy thông tin đơn hàng
        const response = await axios.get(
          `http://localhost:5000/api/order/${orderId}`,
          { withCredentials: true }
        );

        // Kiểm tra nếu API trả về lỗi
        if (response.data.error) {
          toast.error(response.data.message || 'Không thể tải thông tin đơn hàng');
          navigate('/orderManagement'); // Chuyển về trang quản lý đơn hàng
          return;
        }

        const orderData = response.data.order;
        
        // Kiểm tra xem đơn hàng đã hoàn thành chưa
        if (orderData.status !== 'completed') {
          toast.error('Chỉ có thể đánh giá đơn hàng đã hoàn thành!');
          navigate('/orderManagement');
          return;
        }

        // Kiểm tra đơn hàng đã được đánh giá chưa
        const reviewCheckResponse = await axios.get(
          `http://localhost:5000/api/review/check/${orderId}`,
          { withCredentials: true }
        );

        // Format dữ liệu đơn hàng nhận từ API để phù hợp với component
        const mappedOrder: CompletedOrder = {
          id: orderData._id,
          gigId: orderData.gigId._id,
          gigTitle: orderData.title,
          sellerId: orderData.freelancerId,
          sellerName: orderData.freelancerName || "Người bán",
          sellerAvatar: orderData.freelancerAvatar || "https://randomuser.me/api/portraits/men/42.jpg",
          completedDate: new Date(orderData.completedAt || orderData.updatedAt),
          price: orderData.gigId.price,
          orderDuration: orderData.duration || 3,
          isReviewed: reviewCheckResponse.data.isReviewed
        };

        setOrder(mappedOrder);

        // Nếu đơn hàng đã được đánh giá, lấy chi tiết đánh giá
        if (reviewCheckResponse.data.isReviewed) {
          try {
            // Gọi API để lấy thông tin chi tiết đánh giá
            const reviewDetailResponse = await axios.get(
              `http://localhost:5000/api/review/${orderData.gigId._id}/get`,
              { withCredentials: true }
            );
            
            const reviews = reviewDetailResponse.data.reviewsWithDetails;
            // Tìm đánh giá của người dùng hiện tại cho đơn hàng này
            const userReview = reviews.find((review: any) => 
              review.orderId === orderId || 
              (review._id && review._id.toString() === reviewCheckResponse.data.reviewId)
            );
            
            if (userReview) {
              setExistingReview({
                _id: userReview._id,
                star: userReview.star,
                title: userReview.title || 'Đánh giá',
                description: userReview.description,
                createdAt: userReview.createdAt
              });
            }
          } catch (error) {
            console.error('Không thể tải thông tin chi tiết đánh giá:', error);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin đơn hàng:', error);
        
        toast.error('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
        
        // Không chuyển hướng ngay, để người dùng có thể thấy thông báo lỗi
        setTimeout(() => {
          navigate('/orderManagement');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId, navigate]);

  const handleReviewSubmitSuccess = () => {
    setReviewSubmitted(true);
    
    // Hiển thị thông báo thành công và chuyển hướng sau 3 giây
    setTimeout(() => {
      navigate('/orderManagement');
    }, 3000);
  };

  // Hàm render sao dựa trên rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={18} 
            className={`${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  // Hàm format ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đánh giá dịch vụ</h1>
          <p className="mt-2 text-gray-600">
            {order?.isReviewed 
              ? 'Xem lại đánh giá của bạn về dịch vụ này' 
              : 'Chia sẻ trải nghiệm của bạn về dịch vụ này sẽ giúp cộng đồng tìm được những dịch vụ chất lượng.'
            }
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>
        ) : reviewSubmitted ? (
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-md">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Cảm ơn bạn đã đánh giá!</h2>
            <p className="text-gray-600 mt-2">Đánh giá của bạn đã được ghi nhận và sẽ giúp cải thiện dịch vụ.</p>
            <p className="text-gray-500 mt-6 text-sm">Đang chuyển hướng về trang quản lý đơn hàng...</p>
          </div>
        ) : order && order.isReviewed && existingReview ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Thông tin đơn hàng */}
            {order && <OrderSummary order={order} />}
            
            {/* Hiển thị đánh giá đã tồn tại */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Đánh giá của bạn</h2>
                <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <Check size={16} className="mr-1" />
                  <span className="text-sm font-medium">Đã đánh giá</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  {renderStars(existingReview.star)}
                  <span className="ml-2 text-gray-700 font-medium">{existingReview.star}/5</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{existingReview.title}</h3>
                <p className="mt-2 text-gray-700">{existingReview.description}</p>
                <p className="mt-4 text-sm text-gray-500">Đã đánh giá vào: {formatDate(existingReview.createdAt)}</p>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={() => navigate('/orderManagement')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Trở về trang quản lý đơn hàng
                </button>
              </div>
            </div>
          </div>
        ) : order ? (
          <>
            {/* Thông tin đơn hàng */}
            <OrderSummary order={order} />
            
            {/* Form đánh giá - Chỉ hiển thị nếu đơn hàng chưa được đánh giá */}
            {!order.isReviewed && <GigReviewForm order={order} onSubmitSuccess={handleReviewSubmitSuccess} />}
          </>
        ) : (
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-red-600">Lỗi tải thông tin đơn hàng</h2>
            <p className="text-gray-600 mt-2">Không thể tìm thấy thông tin đơn hàng. Vui lòng thử lại sau.</p>
            <button 
              onClick={() => navigate('/orderManagement')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Trở về trang quản lý đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewGigPage;