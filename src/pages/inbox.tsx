import Sidebar from "../components/Chat/Sidebar";
import ChatBody from "../components/Chat/ChatBody";
import MobileChat from "../components/Chat/MobileChat";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../lib/socket";

type UserData = {
  user?: {
    _id?: string;
    name?: string;
  };
};

export default function Inbox() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Gọi lần đầu khi component mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/me`, {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Hiển thị MobileChat nếu là màn hình di động
  if (isMobile) {
    return <MobileChat currentUser={currentUser} />;
  }

  // Hiển thị Desktop view
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full relative">
          {/* Sidebar - luôn hiển thị trên desktop */}
          <div className="w-1/3 lg:w-1/4 h-full">
            <Sidebar socket={socket} currentUser={currentUser} />
          </div>

          {/* Chat Body - hiển thị khi có id khác "null" */}
          <div className="flex-1 w-2/3 lg:w-3/4 p-4 mt-[-12px] bg-gray-50 flex items-center justify-center">
            {!id || id === "null" ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 italic text-center">
                  <p>Chưa chọn cuộc hội thoại...</p>
                  <p className="text-sm mt-2">Hãy chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu</p>
                </div>
              </div>
            ) : (
              <ChatBody 
                socket={socket} 
                isMobile={false} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
