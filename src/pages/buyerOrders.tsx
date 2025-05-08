import { useState, useEffect } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Clock, CheckCircle, ShoppingBag, AlertCircle, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Định nghĩa các trạng thái có thể có của đơn hàng
type OrderStatus = "pending" | "approved" | "completed" | "cancelled";

// Định nghĩa type cho đơn hàng
interface Order {
  _id: string;
  title: string;
  // price: number;
  status: OrderStatus;
  createdAt: string;
  cancelRequestId?: string;
  price: number | {
    $numberDecimal?: number | string;
    _id?: string;
  };
  // status: string;
  // createdAt: string;
  gigId?: string; // ID của dịch vụ
  isReviewed?: boolean; // Trạng thái đã đánh giá chưa
  reviewId?: string; // ID của đánh giá nếu đã đánh giá
}

// Định nghĩa type cho dữ liệu phân trang
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  ordersPerPage: number;
}

export default function BuyerOrdersPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

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
          console.log("Đơn hàng:", response.data.orders);
          
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
    // Kiểm tra trạng thái đơn hàng
    let statusMatch = filter === "all";
    
    if (filter === "pending") {
      statusMatch = order.status === "pending";
    } else if (filter === "approved") {
      statusMatch = order.status === "approved";
    } else if (filter === "completed") {
      statusMatch = order.status === "completed";
    } else if (filter === "cancelled") {
      statusMatch = order.status === "cancelled";
    }
    
    // Kiểm tra từ khóa tìm kiếm
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && matchesSearch;
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
  const formatPrice = (price: number | string | undefined) => {
    if (price === undefined || price === null) {
      return "Không có thông tin";
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(price));
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
      case "approved":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          text: "Đã xác nhận",
          color: "bg-blue-100 text-blue-800"
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

  // Hàm điều hướng đến trang đánh giá hoặc xem đánh giá
  const handleReviewClick = (order: Order) => {
    if (order.isReviewed && order.reviewId && order.gigId) {
      // Nếu đã đánh giá rồi, điều hướng đến trang chi tiết gig với param reviewId
      navigate(`/gig/${order.gigId}?reviewId=${order.reviewId}`);
    } else {
      // Nếu chưa đánh giá, điều hướng đến trang đánh giá
      navigate(`/review-gig/${order._id}`);
    }
  };

  // Hàm mở modal hủy đơn hàng
  const openCancelModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
    setCancelReason("");
  };

  // Hàm đóng modal
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
    setCancelReason("");
  };

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!selectedOrderId || !cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    try {
      // Kiểm tra xem đơn hàng đã có yêu cầu hủy chưa
      const orderToCancel = orders.find(order => order._id === selectedOrderId);
      if (orderToCancel?.cancelRequestId) {
        alert("Đơn hàng này đã có yêu cầu hủy");
        closeCancelModal();
        return;
      }

      setCancelLoading(selectedOrderId);
      const response = await axios.post(
        `http://localhost:5000/api/order/request-cancel/${selectedOrderId}`,
        {
          reason: cancelReason.trim()
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.error) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === selectedOrderId
              ? { 
                  ...order, 
                  status: response.data.order.status,
                  cancelRequestId: response.data.order.cancelRequestId 
                }
              : order
          )
        );
        alert(response.data.message);
        closeCancelModal();
      }
    } catch (err: unknown) {
      const error = err as { 
        response?: { 
          data?: { 
            message?: string; 
            error?: boolean 
          }; 
          status?: number 
        } 
      };
      console.error('Error canceling order:', error);
      
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.status === 400) {
        alert("Không thể hủy đơn hàng. Vui lòng kiểm tra lại trạng thái đơn hàng.");
      } else {
        alert("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.");
      }
    } finally {
      setCancelLoading(null);
    }
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
                      onClick={() => setFilter("pending")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "pending"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Đang xử lý
                    </button>
                    <button
                      onClick={() => setFilter("approved")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "approved"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Đã xác nhận
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
                            <p className="text-lg font-bold text-[#1dbf73]">
                              {(() => {
                                if (typeof order.price === 'number') {
                                  return formatPrice(order.price);
                                } else if (order.price && typeof order.price === 'object') {
                                  if (order.price.$numberDecimal) {
                                    return formatPrice(order.price.$numberDecimal);
                                  }
                                }
                                return "Không có thông tin";
                              })()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Chi tiết
                          </button>
                          
                          {(order.status === "pending" || order.status === "approved") && (
                            <div className="flex items-center space-x-2">
                              {order.cancelRequestId ? (
                                <div className="px-4 py-2 bg-orange-50 border border-orange-300 rounded-md text-sm font-medium text-orange-700">
                                  Đã gửi yêu cầu hủy
                                </div>
                              ) : (
                                <button 
                                  onClick={() => openCancelModal(order._id)}
                                  className="px-4 py-2 bg-red-50 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 flex items-center"
                                >
                                  Hủy đơn hàng
                                </button>
                              )}
                            </div>
                          )}
                          
                          {order.status === "completed" && (
                            <button 
                              onClick={() => handleReviewClick(order)}
                              className="px-4 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100"
                            >
                              {order.isReviewed ? "Xem đánh giá" : "Đánh giá"}
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

        {/* Modal hủy đơn hàng */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4">Xác nhận hủy đơn hàng</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy đơn hàng
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeCancelModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelLoading === selectedOrderId}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {cancelLoading === selectedOrderId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận hủy"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}