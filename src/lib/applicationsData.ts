// Dữ liệu mẫu cho danh sách ứng tuyển việc làm

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  salary: number;
  applyDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  location: string;
  category: string;
  coverLetter?: string;
  resume?: string;
  viewed: boolean;
  interviewDate?: string;
}

export const sampleApplications: JobApplication[] = [
  {
    id: "app1",
    jobId: "job101",
    jobTitle: "Senior Frontend Developer",
    companyName: "TechNova Solutions",
    companyLogo: "https://randomuser.me/api/portraits/men/32.jpg",
    salary: 3000000,
    applyDate: "2025-04-22T08:30:00Z",
    status: "pending",
    location: "Tp. Hồ Chí Minh",
    category: "Lập trình & Công nghệ",
    coverLetter: "Tôi mong muốn được ứng tuyển vị trí này vì đam mê phát triển frontend...",
    viewed: true
  },
  {
    id: "app2",
    jobId: "job102",
    jobTitle: "UX/UI Designer",
    companyName: "CreativeCraft Studio",
    companyLogo: "https://randomuser.me/api/portraits/women/44.jpg",
    salary: 2500000,
    applyDate: "2025-04-20T10:15:00Z",
    status: "accepted",
    location: "Hà Nội",
    category: "Thiết kế đồ họa",
    viewed: true,
    interviewDate: "2025-04-28T14:00:00Z"
  },
  {
    id: "app3",
    jobId: "job103",
    jobTitle: "Backend Developer (NodeJS)",
    companyName: "DataPro Systems",
    companyLogo: "https://randomuser.me/api/portraits/men/67.jpg",
    salary: 2800000,
    applyDate: "2025-04-18T15:45:00Z",
    status: "rejected",
    location: "Tp. Hồ Chí Minh",
    category: "Lập trình & Công nghệ",
    coverLetter: "Với kinh nghiệm 3 năm làm việc với NodeJS...",
    viewed: true
  },
  {
    id: "app4",
    jobId: "job104",
    jobTitle: "Content Writer",
    companyName: "MediaVerse Group",
    companyLogo: "https://randomuser.me/api/portraits/women/22.jpg",
    salary: 1800000,
    applyDate: "2025-04-15T09:00:00Z",
    status: "pending",
    location: "Đà Nẵng",
    category: "Viết & Dịch thuật",
    viewed: false
  },
  {
    id: "app5",
    jobId: "job105",
    jobTitle: "Mobile App Developer (React Native)",
    companyName: "AppGenius Technologies",
    companyLogo: "https://randomuser.me/api/portraits/men/89.jpg", 
    salary: 3200000,
    applyDate: "2025-04-10T13:20:00Z",
    status: "accepted",
    location: "Tp. Hồ Chí Minh",
    category: "Lập trình & Công nghệ",
    interviewDate: "2025-04-18T10:30:00Z",
    viewed: true
  },
  {
    id: "app6",
    jobId: "job106",
    jobTitle: "SEO Specialist",
    companyName: "Digital Growth Agency",
    companyLogo: "https://randomuser.me/api/portraits/women/54.jpg",
    salary: 2200000,
    applyDate: "2025-04-05T11:30:00Z",
    status: "rejected",
    location: "Hà Nội",
    category: "Tiếp thị số",
    viewed: true
  },
  {
    id: "app7",
    jobId: "job107", 
    jobTitle: "DevOps Engineer",
    companyName: "CloudSphere Solutions",
    companyLogo: "https://randomuser.me/api/portraits/men/45.jpg",
    salary: 3500000,
    applyDate: "2025-04-03T08:45:00Z",
    status: "accepted",
    location: "Tp. Hồ Chí Minh",
    category: "Lập trình & Công nghệ",
    interviewDate: "2025-04-12T15:00:00Z",
    viewed: true
  },
  {
    id: "app8",
    jobId: "job108",
    jobTitle: "Product Designer",
    companyName: "InnovateTech",
    companyLogo: "https://randomuser.me/api/portraits/women/33.jpg",
    salary: 2800000,
    applyDate: "2025-03-28T14:15:00Z",
    status: "pending",
    location: "Hà Nội",
    category: "Thiết kế đồ họa",
    viewed: false
  },
  {
    id: "app9",
    jobId: "job109",
    jobTitle: "Data Analyst",
    companyName: "InsightAnalytics",
    companyLogo: "https://randomuser.me/api/portraits/men/12.jpg",
    salary: 2600000,
    applyDate: "2025-03-25T10:00:00Z", 
    status: "pending",
    location: "Đà Nẵng",
    category: "Data Science & ML",
    coverLetter: "Tôi có kỹ năng phân tích dữ liệu sử dụng Python và SQL...",
    viewed: true
  },
  {
    id: "app10",
    jobId: "job110",
    jobTitle: "Social Media Manager",
    companyName: "BrandConnect",
    companyLogo: "https://randomuser.me/api/portraits/women/68.jpg",
    salary: 2000000,
    applyDate: "2025-03-20T09:30:00Z",
    status: "rejected",
    location: "Tp. Hồ Chí Minh",
    category: "Tiếp thị số",
    viewed: true
  }
];

export const getApplicationsStats = () => {
  const total = sampleApplications.length;
  const pending = sampleApplications.filter(app => app.status === 'pending').length;
  const accepted = sampleApplications.filter(app => app.status === 'accepted').length;
  const rejected = sampleApplications.filter(app => app.status === 'rejected').length;
  const unviewed = sampleApplications.filter(app => !app.viewed).length;
  
  // Tính tỷ lệ thành công (được chấp nhận / tổng số)
  const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
  
  // Thống kê theo ngành nghề
  const categories = Array.from(new Set(sampleApplications.map(app => app.category)));
  const categoryStats = categories.map(category => {
    const appsInCategory = sampleApplications.filter(app => app.category === category);
    return {
      name: category,
      count: appsInCategory.length,
      accepted: appsInCategory.filter(app => app.status === 'accepted').length
    };
  });
  
  // Thống kê theo địa điểm
  const locations = Array.from(new Set(sampleApplications.map(app => app.location)));
  const locationStats = locations.map(location => {
    return {
      name: location,
      count: sampleApplications.filter(app => app.location === location).length
    };
  });
  
  return {
    total,
    pending,
    accepted,
    rejected,
    unviewed,
    successRate,
    categoryStats,
    locationStats
  };
};