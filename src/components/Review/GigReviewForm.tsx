import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaInfoCircle, FaStar } from 'react-icons/fa';
import axios from 'axios';
import RatingStars from './RatingStars';

// Import interface từ trang ReviewGig
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

interface GigReviewFormProps {
  order: CompletedOrder;
  onSubmitSuccess: () => void;
}

const GigReviewForm: React.FC<GigReviewFormProps> = ({ order, onSubmitSuccess }) => {
  const [overallRating, setOverallRating] = useState<number>(5);
  const [speedRating, setSpeedRating] = useState<number>(5);
  const [communicationRating, setCommunicationRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Kiểm tra nội dung đánh giá có đủ dài không
    if (comment.length < 20) {
      setError('Vui lòng nhập đánh giá chi tiết (ít nhất 20 ký tự)');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Chuẩn bị dữ liệu đánh giá đúng định dạng mà backend yêu cầu
      const reviewData = {
        orderId: order.id,
        star: overallRating,
        title: title || `Đánh giá dịch vụ ${order.gigTitle}`,
        description: comment
        // Chi tiết về tốc độ, giao tiếp, chất lượng có thể được lưu trong mô tả
        // hoặc mở rộng backend để lưu trữ thêm các thông tin này
      };
      
      console.log("Sending review data:", reviewData);
      
      // Gọi API để gửi đánh giá với endpoint đúng
      const response = await axios.post(
        `http://localhost:5000/api/review/${order.gigId}/create`,
        reviewData,
        { withCredentials: true }
      );

      // Kiểm tra kết quả từ API
      if (response.data && !response.data.error) {
        // Thông báo thành công
        toast.success('Đánh giá của bạn đã được gửi thành công!', {
          duration: 3000,
          position: 'top-center',
          icon: '👍'
        });
        
        // Gọi callback để thông báo đánh giá thành công
        onSubmitSuccess();
      } else {
        // Hiển thị lỗi từ API
        throw new Error(response.data.message || 'Có lỗi xảy ra khi gửi đánh giá');
      }
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra, vui lòng thử lại sau!');
      console.error('Lỗi khi gửi đánh giá:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Đánh giá tổng thể</h3>
          <RatingStars 
            initialRating={overallRating} 
            onChange={setOverallRating} 
            size={32}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề đánh giá <span className="text-gray-500 text-xs">(không bắt buộc)</span>
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ví dụ: Tuyệt vời! hoặc Đúng yêu cầu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung đánh giá <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Hãy chia sẻ trải nghiệm của bạn về chất lượng, tốc độ, giao tiếp..."
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            minLength={20}
            required
          />
          <div className="flex justify-between mt-1">
            <p className="text-sm text-gray-500">
              Tối thiểu 20 ký tự
            </p>
            <p className={`text-sm ${comment.length < 20 ? 'text-red-500' : 'text-green-500'}`}>
              {comment.length}/20
            </p>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors w-full sm:w-auto font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Đang gửi...
              </div>
            ) : (
              <>
                <FaStar className="inline-block mr-1" /> Gửi đánh giá
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GigReviewForm;