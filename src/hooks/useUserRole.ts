import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

interface UserRoleState {
  isFreelancer: boolean;
  isCustomer: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useUserRole = (): UserRoleState => {
  const { isSignedIn, user } = useUser();
  const [state, setState] = useState<UserRoleState>({
    isFreelancer: false,
    isCustomer: false,
    isAdmin: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isSignedIn) {
        setState({
          isFreelancer: false,
          isCustomer: false,
          isAdmin: false,
          isLoading: false,
          error: null
        });
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user/me', {
          withCredentials: true
        });

        if (response.data && response.data.user) {
          const userRole = response.data.user.role;
          
          setState({
            isFreelancer: userRole === 'freelancer',
            isCustomer: userRole === 'customer',
            isAdmin: userRole === 'admin',
            isLoading: false,
            error: null
          });
        } else {
          setState({
            isFreelancer: false,
            isCustomer: true, // Mặc định là customer nếu không xác định được
            isAdmin: false,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra vai trò người dùng:', error);
        setState({
          isFreelancer: false,
          isCustomer: true, // Mặc định là customer nếu có lỗi
          isAdmin: false,
          isLoading: false,
          error: 'Không thể xác định vai trò người dùng'
        });
      }
    };

    if (isSignedIn) {
      checkUserRole();
    } else {
      setState({
        isFreelancer: false,
        isCustomer: false,
        isAdmin: false,
        isLoading: false,
        error: null
      });
    }
  }, [isSignedIn, user?.id]);

  return state;
};

export default useUserRole;