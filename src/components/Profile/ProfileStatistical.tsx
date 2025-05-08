import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseMongoDecimal } from '../../lib/utils'; // Thêm import hàm xử lý Decimal128

// Định nghĩa interface cho dữ liệu
interface Order {
  _id: string;
  gigId: {
    _id: string;
    price: any; // Đổi kiểu dữ liệu thành any để hỗ trợ mọi định dạng giá
  };
  customerId: {
    _id: string;
    name: string;
  };
  title: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface ApiResponse {
  error: boolean;
  message: string;
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    ordersPerPage: number;
  };
}

const ProfileStatistical: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State cho bộ lọc
  const [filterType, setFilterType] = useState<'month' | 'date'>('month');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Lấy dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          'http://localhost:5000/api/order/get-list-freelancer',
          { withCredentials: true } // Thêm withCredentials để gửi cookie xác thực
        );
        
        if (response.data.orders) {
          setOrders(response.data.orders);
          setError(null);
        } else {
          setError('Không có dữ liệu đơn hàng');
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Bạn cần đăng nhập để xem thống kê đơn hàng');
        } else {
          setError('Đã xảy ra lỗi khi tải dữ liệu đơn hàng');
        }
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Tính toán dữ liệu thống kê
  const statistics = useMemo(() => {
    if (!orders.length) return { chartData: [], summary: { total: 0, pending: 0, completed: 0, cancelled: 0, revenue: 0 } };

    let filteredOrders: Order[] = [];
    
    if (filterType === 'month') {
      // Lọc theo tháng
      const [year, month] = selectedMonth.split('-').map(Number);
      const startDate = startOfMonth(new Date(year, month - 1));
      const endDate = endOfMonth(new Date(year, month - 1));

      filteredOrders = orders.filter(order => {
        const orderDate = parseISO(order.createdAt);
        return isWithinInterval(orderDate, { start: startDate, end: endDate });
      });
    } else {
      // Lọc theo ngày cụ thể
      filteredOrders = orders.filter(order => {
        return format(parseISO(order.createdAt), 'yyyy-MM-dd') === selectedDate;
      });
    }

    // Tính toán tổng số liệu
    const summary = filteredOrders.reduce((acc, order) => {
      acc.total += 1;
      
      if (order.status === 'pending') acc.pending += 1;
      else if (order.status === 'completed') acc.completed += 1;
      else if (order.status === 'cancelled') acc.cancelled += 1;
      
      // Tính doanh thu chỉ từ đơn hàng đã hoàn thành và xử lý giá trị Decimal128
      if (order.status === 'completed') {
        acc.revenue += parseMongoDecimal(order.gigId.price);
      }
      
      return acc;
    }, { total: 0, pending: 0, completed: 0, cancelled: 0, revenue: 0 });

    // Tạo dữ liệu cho biểu đồ
    const chartData = [
      { name: 'Đang xử lý', value: summary.pending, fill: '#facc15' },
      { name: 'Hoàn thành', value: summary.completed, fill: '#22c55e' },
      { name: 'Đã hủy', value: summary.cancelled, fill: '#ef4444' }
    ];

    return { chartData, summary };
  }, [orders, filterType, selectedMonth, selectedDate]);

  // Hàm định dạng giá trị tiền
  const formatPrice = (price: any): string => {
    const parsedPrice = parseMongoDecimal(price);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parsedPrice);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1dbf73]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        <p>{error}</p>
        <button 
          className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded transition-colors"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Thống kê đơn hàng</h2>
      
      {/* Bộ chọn thời gian */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium text-gray-700">Loại thống kê</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'month' | 'date')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1dbf73] focus:border-[#1dbf73]"
          >
            <option value="month">Theo tháng</option>
            <option value="date">Theo ngày</option>
          </select>
        </div>
        
        {filterType === 'month' ? (
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">Chọn tháng</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1dbf73] focus:border-[#1dbf73]"
            />
          </div>
        ) : (
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">Chọn ngày</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1dbf73] focus:border-[#1dbf73]"
            />
          </div>
        )}
      </div>

      {/* Thẻ tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Tổng đơn hàng</p>
          <p className="text-2xl font-bold">{statistics.summary.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Đơn đang xử lý</p>
          <p className="text-2xl font-bold text-yellow-500">{statistics.summary.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Đơn hoàn thành</p>
          <p className="text-2xl font-bold text-green-500">{statistics.summary.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Doanh thu (VND)</p>
          <p className="text-2xl font-bold text-blue-500">
            {new Intl.NumberFormat('vi-VN').format(statistics.summary.revenue)}
          </p>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
        <h3 className="text-lg font-medium mb-4">Phân bố trạng thái đơn hàng</h3>
        {statistics.chartData.some(item => item.value > 0) ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statistics.chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} đơn`, 'Số lượng']} />
                <Legend />
                <Bar dataKey="value" name="Số đơn hàng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Không có dữ liệu đơn hàng trong thời gian đã chọn</p>
          </div>
        )}
      </div>

      {/* Danh sách đơn hàng gần đây */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium mb-4">Đơn hàng gần đây</h3>
        
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customerId.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(order.gigId.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {order.status === 'completed' ? 'Hoàn thành' : 
                         order.status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Không có đơn hàng nào</p>
        )}
      </div>
    </div>
  );
};

export default ProfileStatistical;