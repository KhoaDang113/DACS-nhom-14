import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import socket from "../lib/socket";
import { useNotification } from "../contexts/NotificationContext";
import { useUser } from "../hooks/useUser";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

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
  isNotification: boolean;
  type: "order" | "system" | "message";
  conversationId: string;
}

const NotificationBell: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { showNotification } = useNotification();
  const { user, loading } = useUser();
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);
  const audio = new Audio("./notification.mp3");
  const { getToken } = useAuth();

  // Thêm state để kiểm soát việc đã fetch thông báo chưa
  const [hasFetchedNotifications, setHasFetchedNotifications] = useState(false);

  // Hàm fetch thông báo riêng để có thể gọi lại nhiều lần
  const fetchNotifications = async () => {
    try {
      const token = await getToken();
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allNotifications = res.data.notifications;
      const allNotificationsRead = allNotifications.filter(
        (n: Notification) => n.isRead === false
      );
      if (allNotificationsRead.length === allNotifications.length) {
        setShowNotifications(false);
      }
      setNotifications(allNotificationsRead);
      setHasFetchedNotifications(true);

      // Hiển thị thông báo cho tin nhắn chưa đọc
      const unNotification = allNotifications.filter(
        (n: Notification) =>
          !n.isRead && n.type === "message" && !n.isNotification
      );
      unNotification.forEach((notification: Notification, index: number) => {
        setTimeout(() => {
          showNotification(
            `${notification.sender.fullName}: ${notification.message}`,
            "message",
            notification.conversationId
          );
        }, index * 1000);
      });
      await axios.post(
        `http://localhost:5000/api/notifications/update-notification/${user.user._id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    }
  };

  // Effect để fetch thông báo khi đăng nhập
  useEffect(() => {
    // Chỉ fetch khi đã có user, chưa fetch trước đó, và đã hoàn tất loading
    if (user && !hasFetchedNotifications && !loading) {
      fetchNotifications();
    }
  }, [user, isSignedIn, loading, hasFetchedNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    socket.on("return_new_message", async (data) => {
      const currentConversationId = location.pathname.split("/").pop();
      if (
        data.receiver._id === user.user._id &&
        data.conversationId !== currentConversationId
      ) {
        try {
          const newNotification: Notification = {
            id: Date.now(),
            title: "Tin nhắn mới",
            message: data.message,
            sender: data.sender,
            time: data.time,
            isRead: false,
            isNotification: false,
            type: "message",
            conversationId: data.conversationId,
          };
          setNotifications((prev) => [newNotification, ...prev]);
          showNotification(
            `${data.sender.fullName}: ${data.message}`,
            "message",
            newNotification.conversationId
          );
          audio.play();
          const token = await getToken();

          await axios.post(
            `http://localhost:5000/api/notifications/update-notification/${user.user._id}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (err) {
          console.log("error:", err);
        }
      }
      if (
        data.receiver._id === user.user._id &&
        data.conversationId === currentConversationId
      ) {
        await axios.put(
          "http://localhost:5000/api/notifications/update-read",
          {
            notificationId: data.notificationId,
          },
          {
            withCredentials: true,
          }
        );
      }
    });

    return () => {
      socket.off("return_new_message");
    };
  }, [user, showNotification, location]);

  return (
    <div className="relative" ref={notificationRef}>
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
                  <Link
                    key={notification.id}
                    to={`/inbox/${notification.conversationId}`}
                    className={`block p-3 rounded-lg cursor-pointer transition-colors ${
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
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {notification.sender.fullName}: {notification.message}
                    </p>
                  </Link>
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
