// Định nghĩa kiểu dữ liệu dựa trên schema của bạn
export interface Review {
  _id: string; // Sử dụng string thay vì ObjectId để dễ sử dụng trong frontend
  gigId: string;
  customerId: string;
  star: number;
  description: string;
  priceRange: string;
  duration: number;
  created_at: Date;
  updated_at: Date;
  // Thêm các trường cần thiết cho hiển thị UI
  customer?: {
    name: string;
    avatar: string;
  };
}

export interface ReviewVote {
  _id: string;
  reviewId: string;
  userId: string;
  isHelpful: boolean;
  created_at: Date;
}



// Hàm helper để chuyển đổi dữ liệu từ database schema sang định dạng cho component SellerReview
export function mapReviewsForComponent(reviews: Review[]) {
  return reviews.map(review => ({
    id: review._id,
    avatar: review.customer?.avatar || 'https://via.placeholder.com/40',
    username: review.customer?.name || 'Người dùng ẩn danh',
    comment: review.description,
    rating: review.star,
    date: new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(review.created_at)
  }));
}

// Dữ liệu đã được chuyển đổi sẵn sàng để sử dụng trong component
export const formattedReviews = mapReviewsForComponent(sampleReviews);