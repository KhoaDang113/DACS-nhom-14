import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface Order {
  id: string;
  customerName: string;
  gigName: string;
  price: number;
  orderDate: string;
  status: 'pending' | 'approved' | 'completed' | 'canceled' | 'rejected';
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/order/get-list-freelancer', {
          withCredentials: true,
        });

        const mappedOrders: Order[] = response.data.orders.map((order: any) => ({
          id: order._id,
          customerName: order.customerId?.name || 'Không rõ',
          gigName: order.title,
          price: parseFloat(order.gigId?.price?.$numberDecimal || '0'),
          orderDate: new Date(order.createdAt).toLocaleDateString('vi-VN'),
          status: order.status,
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (status: string) => setFilterStatus(status);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const filteredOrders = orders.filter(order =>
    (filterStatus ? order.status === filterStatus : true) &&
    (searchTerm ? order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  const handleAction = (id: string, action: 'approve' | 'reject' | 'complete') => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id
          ? {
              ...order,
              status:
                action === 'approve'
                  ? 'approved'
                  : action === 'reject'
                  ? 'rejected'
                  : action === 'complete'
                  ? 'completed'
                  : order.status,
            }
          : order
      )
    );
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'rejected':
        return 'text-blue-500';
      case 'approved':
        return 'text-green-500';
      case 'completed':
        return 'text-gray-500';
      case 'canceled':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const renderStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'rejected':
        return 'Đã từ chối';
      case 'approved':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'canceled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">Quản Lý Đơn Hàng</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên khách hàng..."
          className="border p-3 rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select
          className="border p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="approved">Đã xác nhận</option>
          <option value="completed">Hoàn thành</option>
          <option value="rejected">Đã từ chối</option>
          <option value="canceled">Đã hủy</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg min-w-[800px]">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-gray-300 p-4 text-left">Tên Khách Hàng</th>
              <th className="border border-gray-300 p-4 text-left">Tên Dịch Vụ</th>
              <th className="border border-gray-300 p-4 text-left">Giá</th>
              <th className="border border-gray-300 p-4 text-left">Ngày Đặt</th>
              <th className="border border-gray-300 p-4 text-left">Trạng Thái</th>
              <th className="border border-gray-300 p-4 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100 transition duration-200">
                  <td className="border border-gray-300 p-4">{order.customerName}</td>
                  <td className="border border-gray-300 p-4">{order.gigName}</td>
                  <td className="border border-gray-300 p-4">${order.price}</td>
                  <td className="border border-gray-300 p-4">{order.orderDate}</td>
                  <td className={`border border-gray-300 p-4 ${getStatusClass(order.status)}`}>
                    {renderStatusText(order.status)}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {order.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                          onClick={() => handleAction(order.id, 'approve')}
                        >
                          Xác Nhận
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                          onClick={() => handleAction(order.id, 'reject')}
                        >
                          Từ Chối
                        </button>
                      </div>
                    )}
                    {order.status === 'approved' && (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={() => handleAction(order.id, 'complete')}
                      >
                        Hoàn Thành
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border border-gray-300 p-4 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
