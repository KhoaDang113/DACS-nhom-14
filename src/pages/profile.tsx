import { useEffect, useState } from 'react';
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from 'axios';
import ProfileInfo from '../components/Profile/ProfileInfo';
import ProfileTabs from '../components/Profile/ProfileTabs';
import useUserRole from '../hooks/useUserRole';
import { useNotification } from '../contexts/NotificationContext';

// Định nghĩa interface cho dữ liệu người dùng
interface UserData {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  country?: string;
  role: string;
  description?: string;
  hardSkill?: string;
  softSkill?: string;
  languages?: string;
  education?: string;
  certificates?: string;
  createdAt: string;
  updatedAt: string;
  gigs?: any[];
  freelancerProfile?: {
    _id?: string;
    hardSkill?: string;
    softSkill?: string;
    languages?: string;
    education?: string;
    certificates?: string;
    description?: string;
    fullName?: string;
    industry?: string;
    country?: string;
  };
}

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const { isCustomer, isFreelancer, isLoading: roleLoading } = useUserRole();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    if (!clerkUser) return;
    
    try {
      setLoading(true);
      
      // Get basic user info
      const response = await axios.get('http://localhost:5000/api/user/me', {
        withCredentials: true
      });
      
      if (response.data && response.data.user) {
        // Nếu là freelancer, lấy thêm thông tin chi tiết về gigs và profile
        if (response.data.user.role === 'freelancer') {
          // Fetch gigs
          const gigsResponse = await axios.get('http://localhost:5000/api/gigs/get-list', {
            withCredentials: true
          });
          
          // Fetch freelancer profile details
          const token = await getToken();
          const profileResponse = await axios.get('http://localhost:5000/api/profile/get', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (profileResponse.data && !profileResponse.data.error) {
            setUserData({
              ...response.data.user,
              gigs: gigsResponse.data?.gigs || [],
              freelancerProfile: profileResponse.data.data || {}
            });
          } else {
            setUserData({
              ...response.data.user,
              gigs: gigsResponse.data?.gigs || []
            });
          }
        } else {
          // Nếu là customer, chỉ lấy thông tin cơ bản
          setUserData(response.data.user);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
      showNotification('Không thể tải thông tin người dùng. Vui lòng thử lại sau.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load profile data on first render
  useEffect(() => {
    if (clerkUser) {
      fetchUserProfile();
    }
  }, [clerkUser]);

  const handleUpdateUser = async (updatedData: any) => {
    try {
      const response = await axios.put('http://localhost:5000/api/user/update', 
        updatedData,
        { withCredentials: true }
      );
      
      if (response.data && !response.data.error) {
        setUserData(prev => prev ? {...prev, ...updatedData} : null);
        showNotification('Cập nhật thông tin thành công!', 'success');
      } else {
        showNotification('Có lỗi xảy ra khi cập nhật thông tin!', 'error');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      showNotification('Có lỗi xảy ra khi cập nhật thông tin!', 'error');
    }
  };

  if (loading || roleLoading || !userData) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Bao gồm cả avatar và thông tin người dùng */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Header - Đã được đưa xuống đây */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col items-center text-center mb-4">
                {/* Avatar */}
                <div className="w-24 h-24 mb-4">
                  <img 
                    src={userData.avatar || clerkUser?.imageUrl || "/avatar.jpg"}
                    alt={userData.name}
                    className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
                
                {/* Tên và thông tin cơ bản */}
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name ? userData.name.replace(/\s*null\s*/, '') : ''}
                </h1>
               

                {/* Badge cho vai trò - Đã ẩn ID */}
                {isCustomer && (
                  <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Khách hàng
                  </div>
                )}
                {isFreelancer && (
                  <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Freelancer
                  </div>
                )}

                {/* Thông tin bổ sung - Đã sắp xếp lại thứ tự */}
                <div className="flex flex-col items-center gap-2 mt-4">
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Tham gia {new Date(userData.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần thông tin profile */}
            <ProfileInfo 
              user={{
                description: isFreelancer 
                  ? (userData.freelancerProfile?.description || '') 
                  : (userData.description || ''),
                hardSkill: isFreelancer 
                  ? (userData.freelancerProfile?.hardSkill || '') 
                  : '',
                softSkill: isFreelancer 
                  ? (userData.freelancerProfile?.softSkill || '') 
                  : '',
                languages: isFreelancer 
                  ? (userData.freelancerProfile?.languages || '') 
                  : '',
                education: isFreelancer 
                  ? (userData.freelancerProfile?.education || '') 
                  : '',
                certificates: isFreelancer 
                  ? (userData.freelancerProfile?.certificates || '') 
                  : ''
              }}
              isCustomer={isCustomer}
              onUpdateUser={handleUpdateUser}
              fetchUserProfile={fetchUserProfile}
            />            
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Truyền isFreelancer prop vào ProfileTabs */}
            <ProfileTabs gigs={userData.gigs || []} isFreelancer={isFreelancer} />
            
            {/* Hiển thị nội dung cho customer */}
            {isCustomer && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin người dùng</h2>
                <p className="text-gray-600">
                  Chào mừng bạn đến với trang cá nhân của mình. Từ đây bạn có thể xem và cập nhật thông tin cá nhân cơ bản.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}