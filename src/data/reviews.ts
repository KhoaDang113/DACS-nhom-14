import { ObjectId } from 'mongodb';

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

// Dữ liệu người dùng mẫu để liên kết với đánh giá
export const sampleCustomers = [
  {
    _id: "user101",
    name: "NgọcAnh123",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    _id: "user102",
    name: "MinhTuan87",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    _id: "user103",
    name: "ThuyLinh_Design",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    _id: "user104",
    name: "HoangQuan_CEO",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    _id: "user105",
    name: "VanAnh_1995",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  }
];

// Dữ liệu đánh giá mẫu
export const sampleReviews: Review[] = [
  {
    _id: "review1",
    gigId: "gig1",
    customerId: "user101",
    star: 5,
    description: "Rất hài lòng với dịch vụ. Freelancer chuyên nghiệp, làm việc nhanh chóng và chất lượng cao. Sẽ tiếp tục sử dụng dịch vụ trong tương lai!",
    priceRange: "$40-$60",
    duration: 3,
    created_at: new Date("2025-03-12"),
    updated_at: new Date("2025-03-12"),
    customer: sampleCustomers[0]
  },
  {
    _id: "review2",
    gigId: "gig1",
    customerId: "user102",
    star: 4,
    description: "Dịch vụ tốt, giao tiếp rõ ràng. Tuy nhiên thời gian hoàn thành hơi lâu so với dự kiến.",
    priceRange: "$40-$60",
    duration: 5,
    created_at: new Date("2025-03-05"),
    updated_at: new Date("2025-03-05"),
    customer: sampleCustomers[1]
  },
  {
    _id: "review3",
    gigId: "gig1",
    customerId: "user103",
    star: 4,
    description: "Chất lượng sản phẩm đáp ứng đúng yêu cầu, nhưng cần cải thiện về giao tiếp và phản hồi nhanh hơn.",
    priceRange: "$60-$80",
    duration: 4,
    created_at: new Date("2025-02-28"),
    updated_at: new Date("2025-02-28"),
    customer: sampleCustomers[2]
  },
  {
    _id: "review4",
    gigId: "gig1",
    customerId: "user104",
    star: 5,
    description: "Tuyệt vời! Đây là lần thứ 3 tôi sử dụng dịch vụ này và không bao giờ thất vọng. Đặc biệt ấn tượng với sự sáng tạo và chuyên nghiệp.",
    priceRange: "$80-$100",
    duration: 2,
    created_at: new Date("2025-02-15"),
    updated_at: new Date("2025-02-15"),
    customer: sampleCustomers[3]
  },
  {
    _id: "review5",
    gigId: "gig2",
    customerId: "user105",
    star: 3,
    description: "Sản phẩm đáp ứng được yêu cầu cơ bản, nhưng mình cảm thấy thiếu sáng tạo và một số chi tiết không như mong đợi. Làm việc chuyên nghiệp.",
    priceRange: "$30-$50",
    duration: 3,
    created_at: new Date("2025-03-08"),
    updated_at: new Date("2025-03-08"),
    customer: sampleCustomers[4]
  }
];

// Dữ liệu vote mẫu
export const sampleReviewVotes: ReviewVote[] = [
  {
    _id: "vote1",
    reviewId: "review1",
    userId: "user201",
    isHelpful: true,
    created_at: new Date("2025-03-13")
  },
  {
    _id: "vote2",
    reviewId: "review1",
    userId: "user202",
    isHelpful: true,
    created_at: new Date("2025-03-13")
  },
  {
    _id: "vote3",
    reviewId: "review2",
    userId: "user201",
    isHelpful: false,
    created_at: new Date("2025-03-06")
  },
  {
    _id: "vote4",
    reviewId: "review3",
    userId: "user203",
    isHelpful: true,
    created_at: new Date("2025-03-01")
  }
];

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