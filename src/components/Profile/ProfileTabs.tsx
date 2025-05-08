import { useState } from 'react';
import ProfileGigs from './ProfileGigs';
import ProfileStatistical from './ProfileStatistical';
import ProfileApplications from './ProfileApplications';
import useUserRole from '../../hooks/useUserRole';

interface Gig {
  _id: string;
  freelancerId: string;
  title: string;
  description: string;
  price: number;
  media: Array<{
    url: string;
    type: string;
    thumbnailUrl?: string;
  }>;
  duration: number;
  keywords: string[];
  status: 'approved' | 'pending' | 'hidden';
}

interface ProfileTabsProps {
  gigs: Gig[];
  isFreelancer?: boolean;
}

const ProfileTabs = ({ gigs, isFreelancer = true }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState('gigs');

  // Định nghĩa các tab dành cho freelancer
  const tabs = [
    { id: 'gigs', label: 'Dịch vụ' },
    // { id: 'applications', label: 'Ứng tuyển' },
    // { id: 'reviews', label: 'Đánh giá' },
    { id: 'statistical', label: 'Thống kê' }
  ];

  // Nếu không phải là freelancer, không hiển thị các tab
  if (!isFreelancer) {
    return null;
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative -mb-px ${
                activeTab === tab.id
                  ? 'border-[#1dbf73] text-[#1dbf73]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'gigs' && <ProfileGigs gigs={gigs} />}
        {activeTab === 'applications' && <ProfileApplications />}
        {activeTab === 'reviews' && <div>Reviews content</div>}
        {activeTab === 'statistical' && <ProfileStatistical />}
      </div>
    </div>
  );
};

export default ProfileTabs;