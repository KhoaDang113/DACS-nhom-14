import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAccount } from "../contexts/AccountContext";

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isLocked, isAccountNotFound, showLockedMessage } = useAccount();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Nếu tài khoản đã bị khóa, không cần kiểm tra quyền admin
        if (isLocked || isAccountNotFound) {
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/user/me", {
          withCredentials: true,
        });
        if (res.data.user.role === "admin") {
          setIsAdmin(true);
        } else {
          toast.error(
            (t) => (
              <div className="flex flex-col gap-3">
                <div>Bạn không có quyền truy cập vào trang này</div>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate("/dashboard");
                  }}
                >
                  OK
                </button>
              </div>
            ),
            {
              duration: Infinity,
              position: "top-center",
              style: {
                background: "#FEE2E2",
                color: "#991B1B",
                border: "1px solid #FCA5A5",
                borderRadius: "8px",
                padding: "16px",
                fontSize: "14px",
                fontWeight: "500",
              },
              icon: "🚫",
            }
          );
        }
      } catch (err) {
        toast.error(
          (t) => (
            <div className="flex flex-col gap-3">
              <div>Vui lòng đăng nhập để tiếp tục</div>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/sign-in");
                }}
              >
                OK
              </button>
            </div>
          ),
          {
            duration: Infinity,
            position: "top-center",
            style: {
              background: "#FEE2E2",
              color: "#991B1B",
              border: "1px solid #FCA5A5",
              borderRadius: "8px",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "500",
            },
            icon: "🔒",
          }
        );
        console.log("error:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate, isLocked, isAccountNotFound]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Nếu tài khoản bị khóa, hiển thị thông báo
  if (isLocked || isAccountNotFound) {
    return showLockedMessage();
  }

  return (
    <>
      <Toaster />
      {isAdmin ? children : null}
    </>
  );
};

export default RequireAdmin;
