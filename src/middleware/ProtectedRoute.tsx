import { useAccount } from "../contexts/AccountContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLocked, isAccountNotFound, isLoading, showLockedMessage, canAccessCurrentRoute } = useAccount();

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo nếu tài khoản bị khóa hoặc bị xóa
  // Trừ khi đang ở các trang được phép như tìm kiếm hoặc chi tiết gig
  if ((isLocked || isAccountNotFound) && !canAccessCurrentRoute) {
    return showLockedMessage();
  }

  // Tài khoản hợp lệ hoặc đang ở trang được phép, hiển thị nội dung
  return children;
};

export default ProtectedRoute;