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
  gigId?:
    | string
    | {
        _id: string;
        title: string;
        price: {
          $numberDecimal?: string | number;
        };
        media: Array<{ url: string; type: string }>;
        duration: number;
        description?: string;
      };
  gigIdValue?: string;
  sellerId?: string;
  buyerId?: string;
  description?: string;
  deadline?: string | Date;
  deliveryTime?: number;
  sellerInfo?: {
    name?: string;
    avatar?: string;
    _id?: string;
  };
  isReviewed?: boolean;
  reviewId?: string;
  gigInfo?: {
    images?: string[];
    title?: string;
    description?: string;
  };
  freelancerInfo?: {
    name: string;
    avatar: string;
    _id: string | null;
  };
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

          // Gán dữ liệu đơn hàng
          const orderData = response.data.order;

          // Nếu có thông tin freelancer từ API, thêm vào sellerInfo
          if (orderData.freelancerInfo) {
            orderData.sellerInfo = {
              name: orderData.freelancerInfo.name,
              avatar: orderData.freelancerInfo.avatar,
              _id: orderData.freelancerInfo._id,
            };
            orderData.sellerId = orderData.freelancerInfo._id;
          }

          // Kiểm tra và xử lý thông tin gig
          if (orderData.gigId) {
            // Nếu gigId là object đã được populate từ server
            if (typeof orderData.gigId === "object" && orderData.gigId._id) {
              orderData.gigInfo = {
                images: orderData.gigId.media
                  ? orderData.gigId.media.map(
                      (item: { url: string }) => item.url || ""
                    )
                  : [],
                title: orderData.gigId.title,
                description: orderData.gigId.description || "",
              };
              // Lưu ID thực của gig để sử dụng sau này
              orderData.gigIdValue = orderData.gigId._id;
            }
            // Nếu gigId là string (chỉ chứa ID)
            else if (typeof orderData.gigId === "string") {
              try {
                const gigResponse = await axios.get(
                  `http://localhost:5000/api/gig/${orderData.gigId}`
                );

                if (!gigResponse.data.error && gigResponse.data.gig) {
                  orderData.gigInfo = {
                    images: gigResponse.data.gig.media
                      ? gigResponse.data.gig.media.map(
                          (item: { url: string }) => item.url || ""
                        )
                      : [],
                    title: gigResponse.data.gig.title,
                    description: gigResponse.data.gig.description || "",
                  };
                  orderData.gigIdValue = orderData.gigId;
                }
              } catch (gigErr) {
                console.error("Lỗi khi lấy thông tin gig:", gigErr);
              }
            }
          }

          // Nếu có ID người bán nhưng chưa có thông tin chi tiết
          if (
            orderData.sellerId &&
            (!orderData.sellerInfo || !orderData.sellerInfo.avatar)
          ) {
            try {
              const sellerResponse = await axios.get(
                `http://localhost:5000/api/user/profile/${orderData.sellerId}`
              );

              if (!sellerResponse.data.error && sellerResponse.data.user) {
                // Thêm hoặc cập nhật thông tin người bán
                orderData.sellerInfo = {
                  name:
                    sellerResponse.data.user.name ||
                    sellerResponse.data.user.username ||
                    orderData.sellerInfo?.name,
                  avatar:
                    sellerResponse.data.user.avatar ||
                    orderData.sellerInfo?.avatar,
                };
              }
            } catch (sellerErr) {
              console.error("Lỗi khi lấy thông tin người bán:", sellerErr);
            }
          }

          setOrder(orderData);
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Đã xảy ra lỗi
          </h3>
          <p className="text-gray-500">{error}</p>
        </div>
      );
    }

    if (!order) {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h3>
          <p className="text-gray-500">
            Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Phần header của đơn hàng */}
        <div className="p-4 sm:p-6 md:p-8 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {order.title}
              </h2>
              <p className="text-sm text-gray-500">Mã đơn hàng: {order._id}</p>
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
        <div className="p-4 sm:p-6 md:p-8">
          {/* Hiển thị ảnh gig và thông tin người bán */}
          {((order.gigInfo &&
            order.gigInfo.images &&
            order.gigInfo.images.length > 0) ||
            order.sellerInfo) && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-6">
                {order.gigInfo &&
                  order.gigInfo.images &&
                  order.gigInfo.images.length > 0 && (
                    <div className="w-full md:w-1/2">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Dịch vụ đã đặt
                      </h3>
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={order.gigInfo.images[0]}
                          alt={order.title}
                          className="w-full h-48 md:h-64 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/400x300?text=Không+có+ảnh";
                          }}
                        />
                      </div>
                      {order.gigIdValue && (
                        <button
                          onClick={() => navigate(`/gig/${order.gigIdValue}`)}
                          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Xem chi tiết dịch vụ
                        </button>
                      )}
                    </div>
                  )}

                {order.sellerInfo && (
                  <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin người bán
                    </h3>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      {order.sellerInfo.avatar ? (
                        <img
                          src={order.sellerInfo.avatar}
                          alt={order.sellerInfo.name || "Người bán"}
                          className="w-16 h-16 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/100x100?text=User";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xl font-medium text-blue-600">
                            {order.sellerInfo.name
                              ? order.sellerInfo.name.charAt(0).toUpperCase()
                              : "U"}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-medium">
                          {order.sellerInfo.name || "Chưa có thông tin"}
                        </h4>
                        {order.sellerId && (
                          <button
                            onClick={() =>
                              navigate(`/profile/${order.sellerId}`)
                            }
                            className="text-sm text-blue-600 hover:underline mt-1 flex items-center gap-1"
                          >
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Xem hồ sơ
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin đơn hàng
              </h3>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
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

                {order.status === "completed" &&
                  calculateCompletionDuration() && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Thời gian hoàn thành
                      </p>
                      <p className="font-medium">
                        {calculateCompletionDuration()} ngày
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin thanh toán
              </h3>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Tổng giá</p>
                  <p className="text-xl font-bold text-[#1dbf73]">
                    {getPrice()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {order.description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Mô tả đơn hàng
              </h3>
              <p className="text-gray-700 whitespace-pre-line p-4 bg-gray-50 rounded-lg">
                {order.description}
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
            {order.status === "completed" && !order.isReviewed && (
              <button
                onClick={() => navigate(`/review-gig/${order._id}`)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Đánh giá
              </button>
            )}

            {order.status === "completed" &&
              order.isReviewed &&
              order.reviewId &&
              order.gigIdValue && (
                <button
                  onClick={() =>
                    navigate(
                      `/gig/${order.gigIdValue}?reviewId=${order.reviewId}`
                    )
                  }
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center gap-2"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Xem đánh giá
                </button>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </button>

            <h1 className="text-2xl font-bold text-blue-700 mb-6">
              Chi Tiết Đơn Hàng
            </h1>

            {renderContent()}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
