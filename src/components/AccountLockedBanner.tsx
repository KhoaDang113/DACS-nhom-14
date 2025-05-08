import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../contexts/AccountContext';

interface AccountLockedBannerProps {
  reason?: string;
}

const AccountLockedBanner: React.FC<AccountLockedBannerProps> = ({ reason }) => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { lockReason } = useAccount();

  const handleSignOut = async () => {
    try {
      // Xóa trạng thái khóa trong localStorage khi logout
      localStorage.removeItem('account_locked');
      localStorage.removeItem('account_locked_reason');
      
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error during sign out:", error);
      navigate("/");
    }
  };

  const displayReason = reason || lockReason || 'Bạn chỉ có thể xem và tìm kiếm dịch vụ.';

  return (
    <div className="bg-orange-50 border-y border-orange-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-500" />
            <span className="font-medium text-orange-700">
              Tài khoản của bạn đã bị khóa. {displayReason}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Trang chủ
            </button>
            <button 
              onClick={handleSignOut}
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded text-sm font-medium"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLockedBanner;