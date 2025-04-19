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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (status: string) => setFilterStatus(status);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const filteredOrders = orders.filter(order =>
    (filterStatus ? order.status === filterStatus : true) &&
    (searchTerm ? order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  order.gigName.toLowerCase().includes(searchTerm.toLowerCase()) : true)
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      case 'approved':
        return '✅';
      case 'completed':
        return '🏆';
      case 'canceled':
        return '🚫';
      default:
        return '❓';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Quản Lý Đơn Đặt Hàng
          </h1>
          <p className="text-center text-gray-500 mb-8">Theo dõi và xử lý các đơn đặt hàng từ khách hàng</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên khách hàng hoặc dịch vụ..."
                className="pl-10 border border-gray-300 p-3 rounded-xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>
              <select
                className="pl-10 border border-gray-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none w-full bg-white"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-md">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <th className="p-4 text-left font-semibold rounded-tl-xl">Tên Khách Hàng</th>
                    <th className="p-4 text-left font-semibold">Tên Dịch Vụ</th>
                    <th className="p-4 text-left font-semibold">Giá</th>
                    <th className="p-4 text-left font-semibold">Ngày Đặt</th>
                    <th className="p-4 text-left font-semibold">Trạng Thái</th>
                    <th className="p-4 text-left font-semibold rounded-tr-xl">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr 
                        key={order.id} 
                        className={`hover:bg-gray-50 transition duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="p-4 border-t">
                          <div className="font-medium">{order.customerName}</div>
                        </td>
                        <td className="p-4 border-t">
                          <div className="font-medium">{order.gigName}</div>
                        </td>
                        <td className="p-4 border-t">
                          <div className="font-medium text-green-600">{formatPrice(order.price)}</div>
                        </td>
                        <td className="p-4 border-t">
                          <div className="text-gray-600">{order.orderDate}</div>
                        </td>
                        <td className="p-4 border-t">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                            {getStatusIcon(order.status)} {renderStatusText(order.status)}
                          </span>
                        </td>
                        <td className="p-4 border-t">
                          {order.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 text-sm flex items-center"
                                onClick={() => handleAction(order.id, 'approve')}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Xác Nhận
                              </button>
                              <button
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 text-sm flex items-center"
                                onClick={() => handleAction(order.id, 'reject')}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Từ Chối
                              </button>
                            </div>
                          )}
                          {order.status === 'approved' && (
                            <button
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 text-sm flex items-center"
                              onClick={() => handleAction(order.id, 'complete')}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Hoàn Thành
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-lg font-medium">Không tìm thấy đơn hàng nào</p>
                          <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Tổng số đơn hàng: {filteredOrders.length} / {orders.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
