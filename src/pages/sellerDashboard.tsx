import React from "react";
import { mockData } from "../data/mockData";
import { FaDollarSign, FaShoppingCart, FaStar, FaBell } from "react-icons/fa";

const SellerDashboard: React.FC = () => {
  const { revenue, completedOrders, averageRating, newOrders, notifications } =
    mockData;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">Tổng quan kinh doanh</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow">
          <FaDollarSign className="text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Doanh thu</h2>
            <p className="text-2xl font-bold">{revenue.amount}</p>
            <p className="text-sm">{revenue.period}</p>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow">
          <FaShoppingCart className="text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Đơn hoàn thành</h2>
            <p className="text-2xl font-bold">{completedOrders.count}</p>
            <p className="text-sm">
              Tỷ lệ hoàn thành: {completedOrders.completionRate}
            </p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow">
          <FaStar className="text-4xl" />
          <div>
            <h2 className="text-lg font-semibold">Rating trung bình</h2>
            <p className="text-2xl font-bold">
              {averageRating.score}/{averageRating.maxScore}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Biểu đồ doanh thu
        </h2>
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Biểu đồ sẽ được hiển thị ở đây</p>
        </div>
      </div>

      {/* Widgets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Orders Widget */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <FaShoppingCart className="text-blue-500" />
            <span>Đơn hàng mới</span>
          </h2>
          <ul className="space-y-2 mt-4">
            {newOrders.map((order) => (
              <li
                key={order.id}
                className="text-sm bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Đơn hàng {order.id} - {order.amount}
              </li>
            ))}
          </ul>
        </div>

        {/* Notifications Widget */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <FaBell className="text-yellow-500" />
            <span>Thông báo</span>
          </h2>
          <ul className="space-y-2 mt-4">
            {notifications.map((notification, index) => (
              <li
                key={index}
                className="text-sm bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {notification}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
