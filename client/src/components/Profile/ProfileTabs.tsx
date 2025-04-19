import { useState } from 'react';
import ProfileGigs from './ProfileGigs';

interface ProfileTabsProps {
  gigs: Gig[];
}

const ProfileTabs = ({ gigs }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState('gigs');

  const tabs = [
    { id: 'gigs', label: 'Dịch vụ' },
    { id: 'reviews', label: 'Đánh giá' },
    { id: 'portfolio', label: 'Portfolio' }
  ];

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
        {activeTab === 'reviews' && <div>Reviews content</div>}
        {activeTab === 'portfolio' && <div>Portfolio content</div>}
      </div>
    </div>
  );
};

export default ProfileTabs;