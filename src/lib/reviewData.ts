export interface CustomerReview {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  gigId: string;
  gigTitle: string;
  rating: number;
  comment: string;
  date: Date;
  priceRange: string;
  duration: number;
}

// Interface cho đơn hàng đã hoàn thành cần đánh giá
export interface CompletedOrder {
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

export const sampleCustomerReviews: CustomerReview[] = [
  {
    id: "rev1",
    customerId: "cust1",
    customerName: "Nguyễn Văn A",
    customerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    gigId: "gig1",
    gigTitle: "Thiết kế logo chuyên nghiệp",
    rating: 5,
    comment: "Tôi rất hài lòng với thiết kế logo. Freelancer làm việc chuyên nghiệp, giao tiếp tốt và hoàn thành đúng hạn. Logo cuối cùng hoàn toàn đáp ứng yêu cầu của tôi và thậm chí còn vượt quá mong đợi!",
    date: new Date("2025-04-20"),
    priceRange: "500.000đ - 800.000đ",
    duration: 3
  },
  {
    id: "rev2",
    customerId: "cust2",
    customerName: "Trần Thị B",
    customerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    gigId: "gig2",
    gigTitle: "Thiết kế website cá nhân",
    rating: 4.5,
    comment: "Website đẹp và chức năng hoạt động tốt. Freelancer sẵn sàng sửa đổi theo yêu cầu. Tuy nhiên, thời gian phản hồi đôi khi hơi chậm nên mình đánh giá 4.5 sao.",
    date: new Date("2025-04-15"),
    priceRange: "1.500.000đ - 2.500.000đ",
    duration: 7
  },
  {
    id: "rev3",
    customerId: "cust3",
    customerName: "Lê Văn C",
    customerAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    gigId: "gig1",
    gigTitle: "Thiết kế logo chuyên nghiệp",
    rating: 5,
    comment: "Tuyệt vời! Đây là lần thứ hai tôi sử dụng dịch vụ và kết quả vẫn xuất sắc như lần trước. Freelancer rất tận tâm, lắng nghe ý kiến và tư vấn chuyên nghiệp. Chắc chắn sẽ quay lại!",
    date: new Date("2025-04-10"),
    priceRange: "500.000đ - 800.000đ",
    duration: 2
  },
  {
    id: "rev4",
    customerId: "cust4",
    customerName: "Phạm Thị D",
    customerAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    gigId: "gig3",
    gigTitle: "Viết content marketing",
    rating: 3.5,
    comment: "Content đáp ứng được yêu cầu cơ bản, nhưng cần cải thiện về độ sáng tạo và thu hút. Tôi phải yêu cầu chỉnh sửa khá nhiều lần. Freelancer có thái độ tốt nhưng kỹ năng còn hạn chế.",
    date: new Date("2025-04-05"),
    priceRange: "400.000đ - 700.000đ",
    duration: 4
  },
  {
    id: "rev5",
    customerId: "cust5",
    customerName: "Hoàng Văn E",
    customerAvatar: "https://randomuser.me/api/portraits/men/54.jpg",
    gigId: "gig2",
    gigTitle: "Thiết kế website cá nhân",
    rating: 5,
    comment: "Website hoàn hảo từ giao diện đến trải nghiệm người dùng! Freelancer luôn lắng nghe ý kiến, tư vấn nhiệt tình và có kiến thức chuyên môn cao. Tôi đặc biệt ấn tượng với khả năng tùy chỉnh theo yêu cầu riêng.",
    date: new Date("2025-04-02"),
    priceRange: "1.500.000đ - 2.500.000đ",
    duration: 5
  },
  {
    id: "rev6",
    customerId: "cust6",
    customerName: "Nguyễn Thị F",
    customerAvatar: "https://randomuser.me/api/portraits/women/89.jpg",
    gigId: "gig4",
    gigTitle: "Chỉnh sửa ảnh chuyên nghiệp",
    rating: 4,
    comment: "Chất lượng ảnh sau chỉnh sửa rất tốt. Freelancer có kỹ năng photoshop chuyên nghiệp. Tôi chỉ trừ 1 sao vì thời gian hoàn thành hơi chậm so với thỏa thuận ban đầu.",
    date: new Date("2025-03-28"),
    priceRange: "300.000đ - 500.000đ",
    duration: 2
  }
];

// Dữ liệu mẫu cho các đơn hàng đã hoàn thành cần đánh giá
export const sampleCompletedOrders: CompletedOrder[] = [
  {
    id: "order1",
    gigId: "gig1",
    gigTitle: "Thiết kế logo chuyên nghiệp",
    sellerId: "seller1",
    sellerName: "Đinh Văn Design",
    sellerAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    completedDate: new Date("2025-04-25"),
    price: 650000,
    orderDuration: 3,
    isReviewed: false
  },
  {
    id: "order2",
    gigId: "gig2", 
    gigTitle: "Thiết kế website cá nhân",
    sellerId: "seller2",
    sellerName: "Tech Solutions",
    sellerAvatar: "https://randomuser.me/api/portraits/women/63.jpg",
    completedDate: new Date("2025-04-22"),
    price: 2200000,
    orderDuration: 7,
    isReviewed: false
  },
  {
    id: "order3",
    gigId: "gig3",
    gigTitle: "Viết content marketing",
    sellerId: "seller3",
    sellerName: "Content Pro",
    sellerAvatar: "https://randomuser.me/api/portraits/men/29.jpg",
    completedDate: new Date("2025-04-19"),
    price: 550000,
    orderDuration: 2,
    isReviewed: true
  }
];

// Helper function để định dạng thời gian tương đối
export const formatRelativeTime = (dateInput: Date | string): string => {
  // Đảm bảo dateInput là một đối tượng Date hợp lệ
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  
  // Kiểm tra xem date có hợp lệ không
  if (isNaN(date.getTime())) {
    return "Không xác định";
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Hôm nay';
  } else if (diffInDays === 1) {
    return 'Hôm qua';
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} tuần trước`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} tháng trước`;
  } else {
    return new Intl.DateTimeFormat('vi-VN').format(date);
  }
};

// Helper function để tính điểm trung bình
export const calculateAverageRating = (reviews: CustomerReview[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

// Format giá tiền theo định dạng VND
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Format ngày tháng theo định dạng Việt Nam
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};