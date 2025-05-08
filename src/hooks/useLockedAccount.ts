import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

interface LockedAccountState {
  isLocked: boolean;
  lockReason: string | null;
  isLoading: boolean;
}

const useLockedAccount = (): LockedAccountState => {
  const [state, setState] = useState<LockedAccountState>({
    isLocked: false,
    lockReason: null,
    isLoading: true
  });
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const checkAccountLockStatus = async () => {
      if (!isSignedIn) {
        setState({
          isLocked: false,
          lockReason: null,
          isLoading: false
        });
        return;
      }

      // Kiểm tra cache trong localStorage để tránh gọi API không cần thiết
      const cachedLockedStatus = localStorage.getItem('account_locked') === 'true';
      const cachedReason = localStorage.getItem('account_locked_reason');
      
      if (cachedLockedStatus) {
        setState({
          isLocked: true,
          lockReason: cachedReason,
          isLoading: false
        });
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const response = await axios.get('http://localhost:5000/api/user/me', {
          withCredentials: true
        });

        const userLockedStatus = response.data?.user?.isLocked || false;
        
        // Lưu trạng thái vào localStorage
        if (userLockedStatus) {
          localStorage.setItem('account_locked', 'true');
          localStorage.setItem('account_locked_reason', 'Tài khoản của bạn đã bị khóa.');
        } else {
          localStorage.removeItem('account_locked');
          localStorage.removeItem('account_locked_reason');
        }

        setState({
          isLocked: userLockedStatus,
          lockReason: userLockedStatus ? 'Tài khoản của bạn đã bị khóa.' : null,
          isLoading: false
        });
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái khóa tài khoản:', error);
        setState({
          isLocked: false,
          lockReason: null,
          isLoading: false
        });
      }
    };

    checkAccountLockStatus();
  }, [isSignedIn, user?.id]);

  return state;
};

export default useLockedAccount;