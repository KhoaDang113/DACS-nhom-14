import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

interface UseRestrictedAccessReturn {
  isLocked: boolean;
  isLoading: boolean;
  canAccessOrderFunctions: boolean;
}

export const useRestrictedAccess = (): UseRestrictedAccessReturn => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const checkAccountStatus = async () => {
      if (!isLoaded || !isSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          withCredentials: true,
        });
        
        const userData = res.data.user;
        setIsLocked(userData.isLocked === true);
        setIsLoading(false);
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          // Tài khoản bị khóa
          console.log('Account is locked in useRestrictedAccess');
          setIsLocked(true);
        }
        setIsLoading(false);
      }
    };

    checkAccountStatus();
  }, [isSignedIn, isLoaded]);

  // Tài khoản bị khóa KHÔNG thể truy cập các chức năng đặt dịch vụ
  const canAccessOrderFunctions = !isLocked;

  return {
    isLocked,
    isLoading,
    canAccessOrderFunctions
  };
};

export default useRestrictedAccess;