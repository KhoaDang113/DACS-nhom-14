import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AccountContextType {
  isLocked: boolean;
  isAccountNotFound: boolean;
  lockReason: string | null;
  isLoading: boolean;
  checkAccountStatus: () => Promise<void>;
  showLockedMessage: () => JSX.Element;
}

const AccountContext = createContext<AccountContextType>({
  isLocked: false,
  isAccountNotFound: false,
  lockReason: null,
  isLoading: true,
  checkAccountStatus: async () => {},
  showLockedMessage: () => <></>,
});

export const useAccount = () => useContext(AccountContext);

export const AccountProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isAccountNotFound, setIsAccountNotFound] = useState<boolean>(false);
  const [lockReason, setLockReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isSignedIn, user } = useUser();

  // Kiểm tra trạng thái tài khoản
  const checkAccountStatus = async () => {
    if (!isSignedIn || !user) {
      setIsLocked(false);
      setIsAccountNotFound(false);
      setLockReason(null);
      setIsLoading(false);
      localStorage.removeItem('account_locked');
      localStorage.removeItem('account_locked_reason');
      return;
    }

    // Kiểm tra cache trong localStorage để tránh gọi API không cần thiết
    const cachedLockedStatus = localStorage.getItem('account_locked') === 'true';
    const cachedReason = localStorage.getItem('account_locked_reason');
    
    if (cachedLockedStatus) {
      setIsLocked(true);
      setLockReason(cachedReason);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/user/me', {
        withCredentials: true
      });

      const userLockedStatus = response.data?.user?.isLocked || false;
      
      // Lưu trạng thái vào localStorage
      if (userLockedStatus) {
        localStorage.setItem('account_locked', 'true');
        localStorage.setItem('account_locked_reason', 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.');
        setLockReason('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.');
      } else {
        localStorage.removeItem('account_locked');
        localStorage.removeItem('account_locked_reason');
        setLockReason(null);
      }

      setIsLocked(userLockedStatus);
      setIsAccountNotFound(false);
    } catch (error: any) {
      console.error("Lỗi khi kiểm tra trạng thái tài khoản:", error);
      if (error.response?.status === 404) {
        setIsAccountNotFound(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAccountStatus();
  }, [isSignedIn, user?.id]);

  // Hiển thị thông báo khi tài khoản bị khóa
  const showLockedMessage = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-orange-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isAccountNotFound ? 'Tài khoản không tồn tại' : 'Tài khoản bị khóa'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isAccountNotFound 
              ? 'Tài khoản của bạn không tồn tại trong hệ thống. Vui lòng đăng nhập lại hoặc liên hệ quản trị viên.'
              : lockReason || 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.'}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                // Điều hướng về trang chủ
                window.location.href = '/';
              }}
              className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AccountContext.Provider 
      value={{
        isLocked,
        isAccountNotFound,
        lockReason,
        isLoading,
        checkAccountStatus,
        showLockedMessage
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};