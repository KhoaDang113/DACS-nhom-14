import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReviewCard from '../components/Review/ReviewCard';

const GigDetailsPage: React.FC = () => {
  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  
  const { id: gigId } = useParams<{ id: string }>();
  const location = useLocation();
  const reviewIdRef = useRef<HTMLDivElement>(null);
  const [highlightedReviewId, setHighlightedReviewId] = useState<string | null>(null);
  
  // Lấy reviewId từ URL query parameters khi load trang
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const reviewId = searchParams.get('reviewId');
    
    if (reviewId) {
      setHighlightedReviewId(reviewId);
    }
  }, [location.search]);

  // Fetch dữ liệu gig từ API
  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/gig/${gigId}`);
        
        if (response.data && !response.data.error) {
          setGig(response.data.gig);
          
          // Tính điểm đánh giá trung bình nếu có đánh giá
          if (response.data.gig.reviews && response.data.gig.reviews.length > 0) {
            const total = response.data.gig.reviews.reduce(
              (sum: number, review: any) => sum + review.rating, 0
            );
            setAverageRating(total / response.data.gig.reviews.length);
          }
        } else {
          setError(response.data.message || 'Không thể tải thông tin dịch vụ');
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin dịch vụ:', err);
        setError('Đã xảy ra lỗi khi tải thông tin dịch vụ');
      } finally {
        setLoading(false);
      }
    };

    if (gigId) {
      fetchGigDetails();
    }
  }, [gigId]);

  // Cuộn đến đánh giá đã chọn và làm nổi bật
  useEffect(() => {
    if (highlightedReviewId && !loading && gig?.reviews) {
      setTimeout(() => {
        const reviewElement = document.getElementById(`review-${highlightedReviewId}`);
        if (reviewElement) {
          reviewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          reviewElement.classList.add('bg-yellow-50', 'border-2', 'border-yellow-300');
          
          // Xóa highlight sau 3 giây
          setTimeout(() => {
            reviewElement.classList.remove('bg-yellow-50', 'border-2', 'border-yellow-300');
            reviewElement.classList.add('transition-all', 'duration-1000');
          }, 3000);
        }
      }, 500);
    }
  }, [highlightedReviewId, loading, gig?.reviews]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg text-center max-w-md">
          <h3 className="text-red-700 text-lg font-bold mb-2">Lỗi</h3>
          <p className="text-red-600">{error || 'Không tìm thấy dịch vụ'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Phần thông tin chi tiết gig */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
          
          {/* Ảnh và thông tin dịch vụ */}
          <div className="mb-6">
            {gig.media && gig.media[0] && (
              <img
                src={gig.media[0]}
                alt={gig.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            )}
          </div>
          
          {/* Mô tả chi tiết dịch vụ */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Mô tả dịch vụ</h2>
            <div className="prose max-w-none">
              <p>{gig.description}</p>
            </div>
          </div>
          
          {/* Phần hiển thị đánh giá */}
          <div className="mt-8" ref={reviewIdRef}>
            <h3 className="text-xl font-bold mb-4">Đánh giá từ khách hàng</h3>
            
            {gig?.reviews && gig.reviews.length > 0 ? (
              <div>
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                    <div className="ml-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <svg
                            key={index}
                            className={`w-5 h-5 ${
                              index < Math.floor(averageRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-gray-500 ml-2">
                          ({gig.reviews.length} đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {gig.reviews.map((review: any) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-500">Chưa có đánh giá nào cho dịch vụ này.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar - Thông tin đặt hàng */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-4">Chi tiết đặt hàng</h3>
            
            <div className="mb-4">
              <p className="text-2xl font-bold text-[#1dbf73] mb-2">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(gig.price || 0)}
              </p>
              <p className="text-gray-500 text-sm">Giá cố định</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Thời gian giao hàng:</span>
                <span className="font-medium">{gig.duration || 3} ngày</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Bao gồm:</span>
                <span className="font-medium">{gig.revisions || 1} lần chỉnh sửa</span>
              </div>
            </div>
            
            <button className="w-full bg-[#1dbf73] text-white font-bold py-3 rounded-md hover:bg-[#19a463] transition duration-200">
              Tiếp tục đặt hàng
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                Liên hệ người bán trước khi đặt hàng để biết thêm chi tiết
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetailsPage;