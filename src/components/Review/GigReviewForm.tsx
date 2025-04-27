import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaInfoCircle, FaStar } from 'react-icons/fa';
import RatingStars from './RatingStars';
import { CompletedOrder } from '../../lib/reviewData';

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
      
      // Log dữ liệu đánh giá để debug
      console.log("Đang gửi đánh giá cho đơn hàng:", order.id, {
        rating: overallRating,
        title,
        comment,
        speedRating,
        communicationRating,
        qualityRating
      });

      // Frontend giả lập gửi đánh giá thành công
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Đánh giá của bạn đã được gửi thành công!', {
          duration: 3000,
          position: 'top-center',
          icon: '👍'
        });
        onSubmitSuccess();
      }, 1500);

      // Trong thực tế, đây là nơi gọi API để gửi đánh giá
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: order.id,
      //     gigId: order.gigId,
      //     sellerId: order.sellerId,
      //     rating: overallRating,
      //     title,
      //     comment,
      //     speedRating,
      //     communicationRating,
      //     qualityRating
      //   })
      // });
      // 
      // if (!response.ok) throw new Error('Không thể gửi đánh giá');
      // 
      // const data = await response.json();
      // onSubmitSuccess();
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
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

        <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium">Đánh giá chi tiết</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Tốc độ giao hàng</span>
              <div className="tooltip cursor-help relative group">
                <FaInfoCircle className="text-gray-400" />
                <div className="tooltip-text invisible group-hover:visible absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded-md -left-28 bottom-full">
                  Người bán có giao hàng đúng hẹn không?
                </div>
              </div>
            </div>
            <RatingStars initialRating={speedRating} onChange={setSpeedRating} size={20} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Giao tiếp</span>
              <div className="tooltip cursor-help relative group">
                <FaInfoCircle className="text-gray-400" />
                <div className="tooltip-text invisible group-hover:visible absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded-md -left-28 bottom-full">
                  Người bán có phản hồi nhanh và rõ ràng không?
                </div>
              </div>
            </div>
            <RatingStars initialRating={communicationRating} onChange={setCommunicationRating} size={20} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Chất lượng dịch vụ</span>
              <div className="tooltip cursor-help relative group">
                <FaInfoCircle className="text-gray-400" />
                <div className="tooltip-text invisible group-hover:visible absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded-md -left-28 bottom-full">
                  Chất lượng kết quả có đáp ứng được kỳ vọng của bạn không?
                </div>
              </div>
            </div>
            <RatingStars initialRating={qualityRating} onChange={setQualityRating} size={20} />
          </div>
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