import React, { useState } from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'system' | 'message';
}

interface NotificationBellProps {
  unreadCount?: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount = 0 }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock data
  const notifications: Notification[] = [
    {
      id: 1,
      title: "Đơn hàng mới",
      message: "Bạn có đơn hàng mới #123 cần xử lý",
      time: "5 phút trước",
      isRead: false,
      type: 'order'
    },
    {
      id: 3,
      title: "Tin nhắn mới",
      message: "Bạn có tin nhắn mới từ Nguyễn Văn A",
      time: "2 giờ trước",
      isRead: false,
      type: 'message'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative flex items-center"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
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
                      notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                    } hover:bg-gray-100`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
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
