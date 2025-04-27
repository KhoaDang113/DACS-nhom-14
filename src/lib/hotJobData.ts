// Dữ liệu mẫu cho quảng cáo job hot
export interface Job {
  _id: string;
  title: string;
  description: string;
  price: number;
  freelancerId: string;
  freelancer: {
    name: string;
    avatar?: string;
  };
}

export interface HotJobPackage {
  id: string;
  name: string;
  duration: number; // Số ngày
  price: number;
}

export interface HotJobAd {
  id: string;
  jobId: string;
  job: Job;
  title: string;
  description: string;
  bannerImage: string;
  startDate: Date;
  endDate: Date;
  packageId: string;
  status: 'active' | 'pending' | 'expired';
  createdAt: Date;
}

// Các gói quảng cáo job hot
export const hotJobPackages: HotJobPackage[] = [
  {
    id: "pkg1",
    name: "Gói 7 ngày",
    duration: 7,
    price: 199000,
  },
  {
    id: "pkg2",
    name: "Gói 14 ngày",
    duration: 14,
    price: 349000,
  },
  {
    id: "pkg3", 
    name: "Gói 30 ngày",
    duration: 30,
    price: 599000,
  },
];

// Dữ liệu mẫu danh sách job của user
export const userJobs: Job[] = [
  {
    _id: "job1",
    title: "Thiết kế logo chuyên nghiệp",
    description: "Tôi sẽ thiết kế logo độc đáo và sáng tạo cho thương hiệu của bạn",
    price: 500000,
    freelancerId: "user1",
    freelancer: {
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    _id: "job2",
    title: "Thiết kế website responsive",
    description: "Tôi sẽ thiết kế website chuyên nghiệp, tương thích mọi thiết bị",
    price: 2500000,
    freelancerId: "user1",
    freelancer: {
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    _id: "job3",
    title: "Viết nội dung blog SEO",
    description: "Tôi sẽ viết bài blog chất lượng cao giúp SEO tốt cho website của bạn",
    price: 350000,
    freelancerId: "user1",
    freelancer: {
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    _id: "job4",
    title: "Chỉnh sửa ảnh chuyên nghiệp",
    description: "Tôi sẽ chỉnh sửa, retouch ảnh của bạn với chất lượng cao",
    price: 150000,
    freelancerId: "user1",
    freelancer: {
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    _id: "job5",
    title: "Thiết kế banner quảng cáo",
    description: "Tôi sẽ thiết kế banner quảng cáo thu hút người xem",
    price: 250000,
    freelancerId: "user1",
    freelancer: {
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
];

// Dữ liệu mẫu các quảng cáo job hot
export const hotJobAds: HotJobAd[] = [
  {
    id: "ad1",
    jobId: "job1",
    job: userJobs[0],
    title: "Logo độc đáo chỉ từ 500k",
    description: "Thiết kế logo chuyên nghiệp với giá tốt nhất thị trường",
    bannerImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
    startDate: new Date(2025, 3, 20),
    endDate: new Date(2025, 3, 27),
    packageId: "pkg1",
    status: 'active',
    createdAt: new Date(2025, 3, 20),
  },
  {
    id: "ad2",
    jobId: "job2",
    job: userJobs[1],
    title: "Website chuyên nghiệp cho doanh nghiệp",
    description: "Thiết kế website responsive với đầy đủ tính năng",
    bannerImage: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop",
    startDate: new Date(2025, 3, 15),
    endDate: new Date(2025, 4, 15),
    packageId: "pkg3",
    status: 'active',
    createdAt: new Date(2025, 3, 15),
  },
];

// Chuyển đổi số tiền sang định dạng tiền tệ Việt Nam
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(amount);
};