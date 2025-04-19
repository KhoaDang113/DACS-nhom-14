import { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileInfo from '../components/Profile/ProfileInfo';
import ProfileTabs from '../components/Profile/ProfileTabs';

const mockGigs = [
  {
    _id: "1",
    freelancerId: "user123",
    title: "Thiết kế website full-stack với React và Node.js",
    description: "Xây dựng website full-stack hoàn chỉnh với React và Node.js",
    price: 500,
    media: [{
        url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },

      {
        url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },],
    duration: 14,
    keywords: ["react", "nodejs", "fullstack"],
    status: 'approved' as const
  },
  {
    _id: "2",
    freelancerId: "user123",
    title: "Phát triển ứng dụng mobile với React Native",
    description: "Phát triển ứng dụng di động đa nền tảng với React Native",
    price: 450,
    media: [
      {
        url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },

      {
        url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
    ],
    duration: 21,
    keywords: ["react-native", "mobile", "ios", "android"],
    status: 'approved'
  },
  {
    _id: "3",
    freelancerId: "user123",
    title: "Xây dựng API với Node.js và Express",
    description: "Thiết kế và phát triển REST API với Node.js và Express",
    price: 300,
    media: [{
        url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },

      {
        url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },],
    duration: 7,
    keywords: ["api", "nodejs", "express"],
    status: 'pending'
  },
  {
    _id: "4",
    freelancerId: "user123",
    title: "Tối ưu hóa hiệu suất website",
    description: "Cải thiện tốc độ và hiệu suất website của bạn",
    price: 250,
    media: [{
        url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },

      {
        url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },],
    duration: 5,
    keywords: ["optimization", "performance", "speed"],
    status: 'hidden'
  }
];

const mockUser = {
  fullName: "Nguyễn Văn A",
  profilePicture: "/avatar.jpg",
  industry: "Công nghệ thông tin",
  hardSkill: "React, Node.js, TypeScript, MongoDB",
  softSkill: "Giao tiếp, Làm việc nhóm, Quản lý thời gian",
  languages: "Tiếng Việt (Bản ngữ), Tiếng Anh (Thành thạo)",
  country: "Việt Nam",
  education: "Đại học ABC - Kỹ sư Công nghệ thông tin (2018-2022)",
  description: "Full stack developer với hơn 5 năm kinh nghiệm...",
  certificates: "AWS Certified Developer, MongoDB Certified Developer",
  created_at: "2024-03-01T00:00:00.000Z",
  updated_at: "2024-03-15T00:00:00.000Z",
  stats: {
    completedProjects: 85,
    ongoingProjects: 3,
    totalEarnings: 50000,
    responseTime: "2 giờ"
  },
  gigs: mockGigs
};

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const [loading, setLoading] = useState(true);

  // Kết hợp dữ liệu từ Clerk với mockUser
  const userData = {
    ...mockUser,
    fullName: clerkUser?.fullName || mockUser.fullName,
    profilePicture: clerkUser?.imageUrl || mockUser.profilePicture,
  };

  useEffect(() => {
    if (clerkUser) {
      setLoading(false);
    }
  }, [clerkUser]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader user={userData} />     
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileInfo user={userData} />            
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ProfileTabs gigs={userData.gigs} />
          </div>
        </div>
      </div>
    </div>
  );
}