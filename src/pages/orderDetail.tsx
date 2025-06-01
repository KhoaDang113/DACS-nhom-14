import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import axios from "axios";
import { Clock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

// Định nghĩa các trạng thái có thể có của đơn hàng
type OrderStatus = "pending" | "approved" | "completed" | "canceled";

// Định nghĩa type cho đơn hàng
interface Order {
  _id: string;
  title: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelRequestId?: string;
  price:
    | number
    | {
        $numberDecimal?: number | string;
        _id?: string;
      };
  gigId?: string;
  sellerId?: string;
  buyerId?: string;
  description?: string;
  deadline?: string | Date;
  deliveryTime?: number;
  sellerInfo?: {
    name?: string;
    avatar?: string;
  };
  isReviewed?: boolean;
  reviewId?: string;
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch đơn hàng từ API
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/order/${orderId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.error === false) {
          console.log("Chi tiết đơn hàng:", response.data.order);
          setOrder(response.data.order);
        } else {
          setError("Có lỗi khi tải thông tin đơn hàng.");
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin đơn hàng:", err);
        setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa có thông tin";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format price
  const formatPrice = (price: number | string | undefined) => {
    if (price === undefined || price === null) {
      return "Không có thông tin";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  // Tính thời gian hoàn thành
  const calculateCompletionDuration = () => {
    if (!order?.createdAt || !order?.completedAt) return null;
    
    const createdDate = new Date(order.createdAt);
    const completedDate = new Date(order.completedAt);
    const diffTime = Math.abs(completedDate.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Icon và màu sắc cho trạng thái
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-5 w-5" />,
          text: "Đang xử lý",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "approved":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          text: "Đã xác nhận",
          color: "bg-blue-100 text-blue-800",
        };
      case "completed":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          text: "Hoàn tất",
          color: "bg-green-100 text-green-800",
        };
      case "canceled":
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          text: "Đã hủy",
          color: "bg-red-100 text-red-800",
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          text: "Đang xử lý",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  // Lấy giá từ đối tượng order
  const getPrice = () => {
    if (!order) return "Không có thông tin";
    
    if (typeof order.price === "number") {
      return formatPrice(order.price);
    } else if (order.price && typeof order.price === "object") {
      if (order.price.$numberDecimal) {
        return formatPrice(order.price.$numberDecimal);
      }
    }
    return "Không có thông tin";
  };

  // Quay lại trang trước
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Chi Tiết Đơn Hàng
            </h1>

            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Đã xảy ra lỗi
                </h3>
                <p className="text-gray-500">{error}</p>
              </div>
            ) : order ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Phần header của đơn hàng */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {order.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Mã đơn hàng: {order._id}
                      </p>
                    </div>
                    {order.status && (
                      <div
                        className={`flex items-center px-4 py-2 rounded-full ${
                          getStatusInfo(order.status).color
                        }`}
                      >
                        {getStatusInfo(order.status).icon}
                        <span className="ml-2 font-medium">
                          {getStatusInfo(order.status).text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thông tin chính */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Thông tin đơn hàng
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                          <p className="font-medium">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        
                        {order.status === "completed" && order.completedAt && (
                          <div>
                            <p className="text-sm text-gray-500">Ngày hoàn thành</p>
                            <p className="font-medium">
                              {formatDate(order.completedAt)}
                            </p>
                          </div>
                        )}
                        
                        {order.deadline && (
                          <div>
                            <p className="text-sm text-gray-500">Thời hạn giao hàng</p>
                            <p className="font-medium">
                              {formatDate(order.deadline.toString())}
                            </p>
                          </div>
                        )}
                        
                        {order.deliveryTime && (
                          <div>
                            <p className="text-sm text-gray-500">Thời gian giao hàng</p>
                            <p className="font-medium">{order.deliveryTime} ngày</p>
                          </div>
                        )}
                        
                        {order.status === "completed" && calculateCompletionDuration() && (
                          <div>
                            <p className="text-sm text-gray-500">Thời gian hoàn thành</p>
                            <p className="font-medium">{calculateCompletionDuration()} ngày</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Thông tin thanh toán
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Tổng giá</p>
                          <p className="text-xl font-bold text-[#1dbf73]">
                            {getPrice()}
                          </p>
                        </div>
                        
                        {order.sellerInfo && (
                          <div>
                            <p className="text-sm text-gray-500">Người bán</p>
                            <p className="font-medium">{order.sellerInfo.name || "Không có thông tin"}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.description && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Mô tả đơn hàng
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {order.description}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                    {(order.status === "completed" && !order.isReviewed) && (
                      <button 
                        onClick={() => navigate(`/review-gig/${order._id}`)}
                        className="px-4 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100"
                      >
                        Đánh giá
                      </button>
                    )}
                    
                    {(order.status === "completed" && order.isReviewed && order.reviewId && order.gigId) && (
                      <button 
                        onClick={() => navigate(`/gig/${order.gigId}?reviewId=${order.reviewId}`)}
                        className="px-4 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100"
                      >
                        Xem đánh giá
                      </button>
                    )}
                    
                    {order.gigId && (
                      <button 
                        onClick={() => navigate(`/gig/${order.gigId}`)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Xem dịch vụ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy đơn hàng
                </h3>
                <p className="text-gray-500">
                  Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập.
                </p>
              </div>
            )}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
} 