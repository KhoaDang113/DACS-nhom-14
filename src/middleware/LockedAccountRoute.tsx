import React from 'react';
import { Navigate } from 'react-router-dom';
import useLockedAccount from '../hooks/useLockedAccount';
import toast, { Toaster } from 'react-hot-toast';

interface LockedAccountRouteProps {
  children: React.ReactNode;
}

const LockedAccountRoute: React.FC<LockedAccountRouteProps> = ({ children }) => {
  const { isLocked, isLoading } = useLockedAccount();

  // Hiển thị thông báo lỗi nếu tài khoản bị khóa
  React.useEffect(() => {
    if (isLocked && !isLoading) {
      toast.error(
        'Tài khoản của bạn đã bị khóa. Bạn không thể truy cập các chức năng này.',
        {
          duration: 5000,
          position: 'top-center',
        }
      );
    }
  }, [isLocked, isLoading]);

  // Khi đang tải, hiển thị màn hình loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Chuyển hướng về trang chủ nếu tài khoản bị khóa
  if (isLocked) {
    return <Navigate to="/" replace />;
  }

  // Nếu không bị khóa, cho phép truy cập
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default LockedAccountRoute;