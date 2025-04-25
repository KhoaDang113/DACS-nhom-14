import { useState, useEffect } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Clock, CheckCircle, ShoppingBag, AlertCircle, Search, Filter } from "lucide-react";
import axios from "axios";

// Định nghĩa type cho đơn hàng
interface Order {
  _id: string;
  title: string;
  price: number;
  status: string;
  createdAt: string;
}

// Định nghĩa type cho dữ liệu phân trang
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  ordersPerPage: number;
}

export default function BuyerOrdersPage() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/order/get-list", {
          withCredentials: true,
          params: { page: pagination?.currentPage || 1 }
        });

        if (response.data.error === false) {
          setOrders(response.data.orders);
          setPagination(response.data.pagination);
        } else {
          setError("Có lỗi khi tải danh sách đơn hàng.");
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách đơn hàng:", err);
        setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination?.currentPage]);

  // Lọc đơn hàng theo trạng thái và từ khóa tìm kiếm
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Icon và màu sắc cho trạng thái
  const getStatusInfo = (status: string) => {
    switch(status) {
      case "pending":
        return { 
          icon: <Clock className="h-5 w-5" />, 
          text: "Đang xử lý", 
          color: "bg-yellow-100 text-yellow-800"
        };
      case "completed":
        return { 
          icon: <CheckCircle className="h-5 w-5" />, 
          text: "Hoàn tất", 
          color: "bg-green-100 text-green-800"
        };
      case "cancelled":
        return { 
          icon: <AlertCircle className="h-5 w-5" />, 
          text: "Đã hủy", 
          color: "bg-red-100 text-red-800"
        };
      default:
        return { 
          icon: <Clock className="h-5 w-5" />, 
          text: "Đang xử lý", 
          color: "bg-gray-100 text-gray-800"
        };
    }
  };

  // Chuyển đến trang khác
  const handlePageChange = (page: number) => {
    setPagination(prev => prev ? {...prev, currentPage: page} : null);
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn hàng</h1>
            
            {/* Tìm kiếm và bộ lọc */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-grow">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, ID hoặc người bán..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500 mr-2">Lọc:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "all"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setFilter("processing")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "processing"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Đang xử lý
                    </button>
                    <button
                      onClick={() => setFilter("completed")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "completed"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Hoàn tất
                    </button>
                    <button
                      onClick={() => setFilter("cancelled")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "cancelled"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Đã hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách đơn hàng */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Đã xảy ra lỗi</h3>
                  <p className="text-gray-500">{error}</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng nào</h3>
                  <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const { icon, text, color } = getStatusInfo(order.status);
                  return (
                    <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{order.title}</h3>
                            <p className="text-sm text-gray-500">ID Đơn hàng: {order._id}</p>
                          </div>
                          <div className={`flex items-center px-3 py-1 rounded-full ${color}`}>
                            {icon}
                            <span className="ml-1 text-sm font-medium">{text}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Ngày đặt hàng</p>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Tổng giá</p>
                            <p className="text-lg font-bold text-[#1dbf73]">{formatPrice(order.price)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Chi tiết
                          </button>
                          
                          {order.status === "pending" && (
                            <button className="px-4 py-2 bg-red-50 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-100">
                              Hủy đơn hàng
                            </button>
                          )}
                          
                          {order.status === "completed" && (
                            <button className="px-4 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100">
                              Đánh giá
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              {/* Phân trang */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          page === pagination.currentPage
                            ? "bg-[#1dbf73] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}