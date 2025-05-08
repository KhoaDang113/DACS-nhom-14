import { useUser } from "@clerk/clerk-react";
import useUserRole from '../../hooks/useUserRole';

interface ProfileHeaderProps {
  user: {
    fullName: string;
    industry?: string;
    profilePicture?: string;
    country: string;
    created_at: string;
  };
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const { user: clerkUser } = useUser();
  const { isCustomer, isFreelancer } = useUserRole();

  return (
    <div className="bg-white border-b">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Avatar - Sử dụng ảnh từ user data hoặc Clerk */}
          <div className="w-24 h-24 relative">
            <img 
              src={user.profilePicture || clerkUser?.imageUrl || "/avatar.jpg"}
              alt={user.fullName}
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.fullName}
            </h1>
            {user.industry && (
              <p className="text-gray-600 mt-1">{user.industry}</p>
            )}
            {isCustomer && (
              <div className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Khách hàng
              </div>
            )}
            {isFreelancer && (
              <div className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Freelancer
              </div>
            )}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{user.country}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Tham gia {new Date(user.created_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long'
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;