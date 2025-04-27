import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import OrderSummary from '../components/Review/OrderSummary';
import GigReviewForm from '../components/Review/GigReviewForm';
import { sampleCompletedOrders, CompletedOrder } from '../lib/reviewData';

const ReviewGigPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<CompletedOrder | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  console.log("ReviewGigPage - orderId from params:", orderId);
  console.log("ReviewGigPage - sampleCompletedOrders:", sampleCompletedOrders);

  useEffect(() => {
    // Mô phỏng việc tải dữ liệu đơn hàng từ API
    const fetchOrderData = () => {
      setIsLoading(true);
      
      // Giả lập API call với dữ liệu mẫu
      setTimeout(() => {
        // Tìm đơn hàng từ dữ liệu mẫu
        const foundOrder = sampleCompletedOrders.find(order => order.id === orderId);
        console.log("ReviewGigPage - foundOrder:", foundOrder);
        
        if (foundOrder) {
          if (foundOrder.isReviewed) {
            // Đơn hàng đã được đánh giá trước đó
            toast.error('Đơn hàng này đã được đánh giá trước đó!');
            navigate('/orderManagement'); // Chuyển về trang quản lý đơn hàng
          } else {
            setOrder(foundOrder);
          }
        } else {
          // Không tìm thấy đơn hàng - Tạo một đơn hàng mẫu để hiển thị với id từ URL
          const mockOrder: CompletedOrder = {
            id: orderId || 'unknown',
            gigId: "gig-sample",
            gigTitle: "Dịch vụ mẫu",
            sellerId: "seller-sample",
            sellerName: "Người bán mẫu",
            sellerAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
            completedDate: new Date(),
            price: 500000,
            orderDuration: 3,
            isReviewed: false
          };
          setOrder(mockOrder);
          
          // Thông báo để debug
          console.log("Không tìm thấy đơn hàng với ID:", orderId, "- Sử dụng đơn hàng mẫu");
        }
        
        setIsLoading(false);
      }, 800);
    };

    fetchOrderData();
  }, [orderId, navigate]);

  const handleReviewSubmitSuccess = () => {
    setReviewSubmitted(true);
    
    // Hiển thị thông báo thành công và chuyển hướng sau 3 giây
    setTimeout(() => {
      navigate('/orderManagement');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đánh giá dịch vụ của bạn</h1>
          <p className="mt-2 text-gray-600">
            Chia sẻ trải nghiệm của bạn về dịch vụ này sẽ giúp cộng đồng tìm được những dịch vụ chất lượng.
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
        ) : order ? (
          <>
            {/* Thông tin đơn hàng */}
            <OrderSummary order={order} />
            
            {/* Form đánh giá */}
            <GigReviewForm order={order} onSubmitSuccess={handleReviewSubmitSuccess} />
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