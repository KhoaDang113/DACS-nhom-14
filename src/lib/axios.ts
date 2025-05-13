import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// Tạo một instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm request interceptor để thêm token xác thực vào mỗi request
apiClient.interceptors.request.use(async (config) => {
  try {
    // Lấy token từ localStorage (được lưu bởi AuthenticatedLayout)
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error adding auth token to request:", error);
  }
  return config;
});

// Thêm response interceptor toàn cục
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Lưu thông tin lỗi 403 vào localStorage để sử dụng trong AccountContext
      localStorage.setItem("account_locked", "true");
      localStorage.setItem(
        "account_locked_reason",
        error.response.data?.message || "Tài khoản của bạn đang bị khóa"
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
