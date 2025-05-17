import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import socket from "../lib/socket";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface Notification {
  id: number;
  title: string;
  sender: {
    _id: string;
    fullName: string;
  };
  message: string;
  time: string;
  isRead: boolean;
  type: "order" | "system" | "message";
  conversationId: string;
}

interface User {
  _id: string;
  fullName: string;
  avatar?: string;
}

const NotificationBell: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { showNotification } = useNotification();
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`http://localhost:5000/api/user/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Lắng nghe sự kiện tin nhắn mới
    socket.on("return_new_message", (data) => {
      // Lấy conversationId từ URL hiện tại
      const currentConversationId = location.pathname.split("/").pop();

      // Kiểm tra nếu người nhận là người dùng hiện tại và không ở trong cuộc trò chuyện đó
      if (
        data.receiver._id === user._id &&
        data.conversationId !== currentConversationId
      ) {
        // Thêm thông báo mới
        const newNotification: Notification = {
          id: Date.now(),
          title: "Tin nhắn mới",
          message: data.message,
          sender: data.sender,
          time: data.time,
          isRead: false,
          type: "message",
          conversationId: data.conversationId,
        };

        setNotifications((prev) => [newNotification, ...prev]);

        // Hiển thị thông báo popup
        showNotification(`${data.sender.fullName}: ${data.message}`, "success");
      }
    });

    return () => {
      socket.off("return_new_message");
    };
  }, [user, showNotification, location]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative flex items-center"
      >
        <Bell size={20} />
        {notifications.filter((n) => !n.isRead).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.filter((n) => !n.isRead).length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Thông báo</h3>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notification.isRead ? "bg-gray-50" : "bg-blue-50"
                    } hover:bg-gray-100`}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === notification.id ? { ...n, isRead: true } : n
                        )
                      );
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.sender.fullName}: {notification.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  Không có thông báo mới
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
