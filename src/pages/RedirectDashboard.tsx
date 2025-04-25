// src/pages/redirectDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const RedirectDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const fetchRoleAndRedirect = async () => {
      try {
        // Đợi cho đến khi Clerk đã tải xong trạng thái xác thực
        if (!isLoaded) return;

        // Nếu chưa đăng nhập, chuyển hướng về trang chủ
        if (!isSignedIn) {
          navigate("/");
          return;
        }

        // Thêm retry logic để tránh lỗi 401
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
          try {
            const res = await axios.get("http://localhost:5000/api/user/me", {
              withCredentials: true,
            });

            console.log("User data:", res);
            const data = res.data.user;

            if (data.role === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/dashboard");
            }
            break; // Thoát vòng lặp nếu thành công
          } catch (err) {
            retries++;
            if (retries === maxRetries) {
              console.error(
                "Failed to fetch user after multiple attempts",
                err
              );
              navigate("/");
            } else {
              // Đợi 2 giây trước khi thử lại
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAndRedirect();
  }, [navigate, isSignedIn, isLoaded]);

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  ) : null;
};

export default RedirectDashboard;
