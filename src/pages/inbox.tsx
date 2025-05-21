import Sidebar from "../components/Chat/Sidebar";
import ChatBody from "../components/Chat/ChatBody";
import MobileChat from "../components/Chat/MobileChat";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../lib/socket";
import { useUser } from "../hooks/useUser";
import axios from "axios";

export default function Inbox() {
  const { id } = useParams();
  const { user, loading, error } = useUser();
  const [isMobile, setIsMobile] = useState(false);

  // Chuyển user từ context sang UserType/UserData cho Sidebar/MobileChat
  const userForChat = user;
  useEffect(() => {
    const getNotification = async () => {
      const response = await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
    };
    getNotification();
  }, [id]);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Gọi lần đầu khi component mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hiển thị loading khi đang lấy user
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Đang tải thông tin người dùng...</div>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Hiển thị MobileChat nếu là màn hình di động
  if (isMobile) {
    return <MobileChat currentUser={userForChat} />;
  }

  // Hiển thị Desktop view
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full relative">
          {/* Sidebar - luôn hiển thị trên desktop */}
          <div className="w-1/3 lg:w-1/4 h-full">
            <Sidebar socket={socket} currentUser={userForChat} />
          </div>

          {/* Chat Body - hiển thị khi có id khác "null" */}
          <div className="flex-1 w-2/3 lg:w-3/4 p-4 mt-[-12px] bg-gray-50 flex items-center justify-center">
            {!id || id === "null" ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 italic text-center">
                  <p>Chưa chọn cuộc hội thoại...</p>
                  <p className="text-sm mt-2">
                    Hãy chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu
                  </p>
                </div>
              </div>
            ) : (
              <ChatBody socket={socket} isMobile={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
