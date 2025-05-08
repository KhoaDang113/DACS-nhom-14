import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';

export interface UserRoleState {
  isFreelancer: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useUserRole = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [roleState, setRoleState] = useState<UserRoleState>({
    isFreelancer: false,
    isAdmin: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isSignedIn || !user) {
        setRoleState({
          isFreelancer: false,
          isAdmin: false,
          isLoading: false,
          error: null
        });
        localStorage.removeItem('isFreelancer');
        localStorage.removeItem('isAdmin');
        return;
      }

      // Trước tiên kiểm tra localStorage để tránh gọi API không cần thiết
      const savedFreelancerStatus = localStorage.getItem('isFreelancer') === 'true';
      const savedAdminStatus = localStorage.getItem('isAdmin') === 'true';

      if (savedFreelancerStatus || savedAdminStatus) {
        setRoleState({
          isFreelancer: savedFreelancerStatus,
          isAdmin: savedAdminStatus,
          isLoading: false,
          error: null
        });
        return;
      }

      // Nếu không có trong localStorage, tiến hành kiểm tra từ API
      try {
        setRoleState(prev => ({ ...prev, isLoading: true, error: null }));
        const token = await getToken();
        const response = await axios.get('http://localhost:5000/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userRole = response.data?.user?.role;
        const isFreelancer = userRole === 'freelancer';
        const isAdmin = userRole === 'admin';

        // Cập nhật state và localStorage
        setRoleState({
          isFreelancer,
          isAdmin,
          isLoading: false,
          error: null
        });

        if (isFreelancer) localStorage.setItem('isFreelancer', 'true');
        if (isAdmin) localStorage.setItem('isAdmin', 'true');

      } catch (error) {
        console.error("Lỗi khi kiểm tra vai trò người dùng:", error);
        setRoleState({
          isFreelancer: false,
          isAdmin: false,
          isLoading: false,
          error: "Không thể xác định vai trò người dùng"
        });
      }
    };

    checkUserRole();
  }, [isSignedIn, user, getToken]);

  // Hàm cập nhật role khi người dùng trở thành freelancer
  const setAsFreelancer = () => {
    setRoleState(prev => ({ ...prev, isFreelancer: true }));
    localStorage.setItem('isFreelancer', 'true');
  };

  return {
    ...roleState,
    setAsFreelancer
  };
};

export default useUserRole;