// src/pages/redirectDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, useClerk } from "@clerk/clerk-react";

// Thêm key để theo dõi số lần thử chuyển hướng
const REDIRECT_ATTEMPT_KEY = "redirect_dashboard_attempts";

const RedirectDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<{
    isLocked?: boolean;
    notFound?: boolean;
    message?: string;
  }>({});
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();

  useEffect(() => {
    const fetchRoleAndRedirect = async () => {
      try {
        // Đợi cho đến khi Clerk đã tải xong trạng thái xác thực
        if (!isLoaded) return;

        // Nếu chưa đăng nhập, chuyển hướng về trang chủ
        if (!isSignedIn) {
          navigate("/", { replace: true });
          return;
        }

        // Kiểm tra số lần thử chuyển hướng
        const redirectAttempts = parseInt(
          localStorage.getItem(REDIRECT_ATTEMPT_KEY) || "0"
        );

        // Nếu đã thử quá nhiều lần, hiển thị thông báo lỗi và không chuyển hướng nữa
        if (redirectAttempts >= 3) {
          setAccountStatus({
            message:
              "Có lỗi xảy ra khi xác thực tài khoản. Vui lòng thử lại sau.",
          });
          setLoading(false);
          // Xóa bộ đếm sau 1 phút
          setTimeout(() => {
            localStorage.removeItem(REDIRECT_ATTEMPT_KEY);
          }, 60000);
          return;
        }

        // Tăng số lần thử
        localStorage.setItem(
          REDIRECT_ATTEMPT_KEY,
          (redirectAttempts + 1).toString()
        );

        try {
          // Gọi API kiểm tra vai trò
          const res = await axios.get("http://localhost:5000/api/user/me", {
            withCredentials: true,
          });

          // Xóa bộ đếm khi thành công
          localStorage.removeItem(REDIRECT_ATTEMPT_KEY);
          const data = res.data.user;
          // Kiểm tra tài khoản bị khóa
          if (data.isLocked === true) {
            console.log("Account is locked, showing notification");
            setAccountStatus({
              isLocked: true,
              message: "Tài khoản của bạn đang bị khóa.",
            });
            setLoading(false);
            return;
          }

          // Chuyển hướng dựa trên vai trò
          if (data.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } catch (err: any) {
          console.error("API error details:", err.response || err);
          if (err.response && err.response.status === 404) {
            // Tài khoản không tồn tại hoặc bị xóa
            console.log("Account not found, showing notification");
            setAccountStatus({
              notFound: true,
              message: "Tài khoản của bạn không tồn tại hoặc đã bị xóa.",
            });
            setLoading(false);
            // Xóa bộ đếm vì đã xác định được vấn đề
            localStorage.removeItem(REDIRECT_ATTEMPT_KEY);
            return;
          } else if (err.response && err.response.status === 403) {
            // Tài khoản bị khóa
            console.log("Account is locked (403), showing notification");
            setAccountStatus({
              isLocked: true,
              message:
                err.response.data?.message || "Tài khoản của bạn đang bị khóa.",
            });
            setLoading(false);
            // Xóa bộ đếm vì đã xác định được vấn đề
            localStorage.removeItem(REDIRECT_ATTEMPT_KEY);
            return;
          } else {
            // Lỗi khác, hiển thị thông báo chung
            setAccountStatus({
              message: "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.",
            });
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        setAccountStatus({
          message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
        });
        setLoading(false);
      }
    };

    fetchRoleAndRedirect();
  }, [navigate, isSignedIn, isLoaded]);

  const handleReturnHome = async () => {
    try {
      // Xóa bộ đếm khi người dùng thực hiện đăng xuất
      localStorage.removeItem(REDIRECT_ATTEMPT_KEY);

      // Đăng xuất người dùng để trở về trạng thái trước khi đăng nhập
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during sign out:", error);
      navigate("/", { replace: true });
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-red-500 text-5xl mb-4 text-center">
          {accountStatus.isLocked || accountStatus.notFound ? "⚠️" : "⚙️"}
        </div>
        <h1 className="text-2xl font-bold text-center text-red-600 mb-4">
          {accountStatus.isLocked
            ? "Tài khoản bị khóa"
            : accountStatus.notFound
            ? "Tài khoản không tồn tại"
            : "Lỗi xác thực"}
        </h1>
        <p className="text-gray-700 text-center mb-6">
          {accountStatus.message || "Có lỗi xảy ra trong quá trình xác thực."}
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleReturnHome}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedirectDashboard;
