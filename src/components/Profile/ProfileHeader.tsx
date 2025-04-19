import { useUser } from "@clerk/clerk-react";

interface ProfileHeaderProps {
  user: {
    fullName: string;
    industry: string;
    country: string;
    created_at: string;
  };
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const { user: clerkUser } = useUser();

  return (
    <div className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Avatar - Sử dụng ảnh từ Clerk */}
          <div className="w-24 h-24 relative">
            <img 
              src={clerkUser?.imageUrl || "/avatar.jpg"} // Sử dụng ảnh từ Clerk hoặc fallback
              alt={user.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {clerkUser?.fullName || user.fullName} {/* Có thể sử dụng tên từ Clerk */}
            </h1>
            <p className="text-gray-600 mt-1">{user.industry}</p>
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