import React from 'react';

interface OrderNotificationPopupProps {
  onClose: () => void;
}

const OrderNotificationPopup: React.FC<OrderNotificationPopupProps> = ({ onClose }) => {
  // Mock data - thay thế bằng dữ liệu thực tế sau
  const notifications = [
    {
      id: 1,
      message: "Đơn hàng mới #12345",
      time: "2 phút trước",
      isRead: false
    },
    {
      id: 2,
      message: "Đơn hàng #12344 đã được xác nhận",
      time: "5 phút trước",
      isRead: true
    }
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Thông báo</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg ${
                notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
              }`}
            >
              <p className="text-sm text-gray-800">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderNotificationPopup;
