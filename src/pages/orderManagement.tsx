import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Thêm import useNavigate
import { Eye } from 'lucide-react'; // Thêm import Eye icon
import ReviewButton from "../components/Review/ReviewButton";
import { parseMongoDecimal } from "../lib/utils";

export interface Order {
  id: string;
  customerName: string;
  gigName: string;
  price: number;
  orderDate: string;
  status: "pending" | "approved" | "completed" | "canceled" | "rejected";
  isReviewed?: boolean;
  gigId?: string; // ID để xác định gig cụ thể khi xem đánh giá
  reviewId?: string; // ID để xác định đánh giá cụ thể khi xem đánh giá
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Sử dụng useNavigate

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Lấy danh sách đơn hàng
        const response = await axios.get(
          "http://localhost:5000/api/order/get-list-freelancer",
          {
            withCredentials: true,
          }
        );
        
        // Debug: In ra dữ liệu đơn hàng từ API
        console.log("Orders API Response:", response.data);

        // Tạo một map từ gigId đến orderId cho các đơn hàng đã hoàn thành
        // để sau này có thể dễ dàng tra cứu orderId khi có thông tin đánh giá
        const gigToOrderMap: Record<string, string> = {};
        response.data.orders.forEach((order: any) => {
          if (order.status === "completed" && order.gigId && order.gigId._id) {
            gigToOrderMap[order.gigId._id] = order._id;
          }
        });
        
        console.log("Gig to Order mapping:", gigToOrderMap);

        // Lấy danh sách đánh giá để kiểm tra những đơn hàng đã được đánh giá
        const reviewsResponse = await axios.get(
          "http://localhost:5000/api/review/freelancer",
          {
            withCredentials: true,
          }
        );

        // Debug: In ra dữ liệu reviews từ API
        console.log("Reviews API Response:", reviewsResponse.data);

        // Tạo map đánh dấu các đơn hàng đã được đánh giá và lưu reviewId
        const reviewedOrdersMap: Record<string, {isReviewed: boolean, reviewId?: string, gigId?: string}> = {};
        
        if (reviewsResponse.data && reviewsResponse.data.reviews) {
          reviewsResponse.data.reviews.forEach((review: any) => {
            console.log("Processing review:", review);
            
            let orderId = null;
            
            // Kiểm tra nếu review trực tiếp có orderId
            if (review.orderId && typeof review.orderId === 'string') {
              orderId = review.orderId;
            } 
            // Kiểm tra nếu review.orderId là object và có _id
            else if (review.orderId && typeof review.orderId === 'object' && review.orderId._id) {
              orderId = review.orderId._id;
            }
            // Thử tìm orderId dựa vào gigId
            else if (review.gigId) {
              const gigId = typeof review.gigId === 'string' ? review.gigId : 
                           (review.gigId._id ? review.gigId._id : null);
              
              if (gigId && gigToOrderMap[gigId]) {
                orderId = gigToOrderMap[gigId];
              }
            }
            
            if (orderId) {
              // Lấy reviewId từ review
              const reviewId = review._id || review.id;
              
              // Lấy gigId từ review
              const gigId = review.gigId && (typeof review.gigId === 'object' ? 
                (review.gigId._id || review.gigId.id) : review.gigId);
              
              reviewedOrdersMap[orderId] = {
                isReviewed: true,
                reviewId: reviewId,
                gigId: gigId
              };
              
              console.log(`Mapped review: orderId=${orderId}, reviewId=${reviewId}, gigId=${gigId}`);
            }
          });
        }

        const mappedOrders: Order[] = response.data.orders.map(
          (order: any) => {
            const orderId = order._id;
            const reviewInfo = reviewedOrdersMap[orderId] || { isReviewed: false };
            
            // Đảm bảo gigId luôn có giá trị, lấy từ order.gigId hoặc từ reviewInfo
            const gigId = order.gigId && order.gigId._id ? 
                         order.gigId._id : 
                         (reviewInfo.gigId || undefined);
            
            return {
              id: orderId,
              customerName: order.customerId?.name || "Không rõ",
              gigName: order.title,
              price: parseMongoDecimal(order.gigId?.price),
              orderDate: new Date(order.createdAt).toLocaleDateString("vi-VN"),
              status: order.status,
              gigId: gigId,
              isReviewed: reviewInfo.isReviewed,
              reviewId: reviewInfo.reviewId
            };
          }
        );

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        
        // Dữ liệu mẫu cho môi trường phát triển
        const mockOrders: Order[] = [
          {
            id: "order1",
            customerName: "Nguyễn Văn A",
            gigName: "Thiết kế logo chuyên nghiệp",
            price: 650000,
            orderDate: "25/04/2025",
            status: "completed",
            isReviewed: false
          },
          {
            id: "order2",
            customerName: "Trần Thị B",
            gigName: "Thiết kế website cá nhân",
            price: 2200000,
            orderDate: "22/04/2025",
            status: "completed",
            isReviewed: false
          },
          {
            id: "order3",
            customerName: "Lê Văn C",
            gigName: "Viết content marketing",
            price: 550000,
            orderDate: "19/04/2025",
            status: "completed",
            isReviewed: true
          },
          {
            id: "order4",
            customerName: "Phạm Thị D",
            gigName: "Chỉnh sửa video",
            price: 800000,
            orderDate: "15/04/2025",
            status: "pending",
            isReviewed: false
          },
          {
            id: "order5",
            customerName: "Hoàng Văn E",
            gigName: "Dịch thuật tài liệu",
            price: 350000,
            orderDate: "12/04/2025",
            status: "approved",
            isReviewed: false
          }
        ];
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Xử lý thay đổi trạng thái đơn hàng thông qua API
  const handleAction = async (
    id: string,
    action: "approve" | "reject" | "complete"
  ) => {
    try {
      // Xác định endpoint và status dựa trên action
      let endpoint = '';
      let newStatus = '';

      switch(action) {
        case "approve":
          endpoint = `http://localhost:5000/api/order/${id}/approve`;
          newStatus = "approved";
          break;
        case "reject":
          endpoint = `http://localhost:5000/api/order/${id}/reject`;
          newStatus = "rejected";
          break;
        case "complete":
          endpoint = `http://localhost:5000/api/order/${id}/complete`;
          newStatus = "completed";
          break;
      }

      // Gọi API cập nhật trạng thái đơn hàng
      const response = await axios.put(endpoint, {}, {
        withCredentials: true
      });

      if (response.data && !response.data.error) {
        // Cập nhật trạng thái đơn hàng trong state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id
              ? { ...order, status: newStatus }
              : order
          )
        );
      } else {
        console.error("Lỗi cập nhật đơn hàng:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  const handleFilterChange = (status: string) => setFilterStatus(status);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const filteredOrders = orders.filter(
    (order) =>
      (filterStatus ? order.status === filterStatus : true) &&
      (searchTerm
        ? order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.gigName.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "";
    }
  };

  const renderStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "rejected":
        return "Đã từ chối";
      case "approved":
        return "Đã xác nhận";
      case "completed":
        return "Hoàn thành";
      case "canceled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "rejected":
        return "❌";
      case "approved":
        return "✅";
      case "completed":
        return "🏆";
      case "canceled":
        return "🚫";
      default:
        return "❓";
    }
  };

  const formatPrice = (price: number | any) => {
    // Xử lý giá trị MongoDB Decimal128
    const parsedPrice = parseMongoDecimal(price);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parsedPrice);
  };

  // Thêm hàm xử lý click vào nút xem đánh giá
  const handleViewReview = (order: Order) => {
    if (order.isReviewed && order.reviewId && order.gigId) {
      // Điều hướng đến trang chi tiết gig với reviewId là param để highlight đánh giá đó
      navigate(`/gig/${order.gigId}?reviewId=${order.reviewId}`);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Quản Lý Đơn Đặt Hàng
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Theo dõi và xử lý các đơn đặt hàng từ khách hàng
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
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
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
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
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
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
                    <th className="p-4 text-left font-semibold rounded-tl-xl">
                      Tên Khách Hàng
                    </th>
                    <th className="p-4 text-left font-semibold">Tên Dịch Vụ</th>
                    <th className="p-4 text-left font-semibold">Giá</th>
                    <th className="p-4 text-left font-semibold">Ngày Đặt</th>
                    <th className="p-4 text-left font-semibold">Trạng Thái</th>
                    <th className="p-4 text-left font-semibold">Đánh Giá</th>
                    <th className="p-4 text-left font-semibold rounded-tr-xl">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50 transition duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-4 border-t">
                          <div className="font-medium">
                            {order.customerName}
                          </div>
                        </td>
                        <td className="p-4 border-t">
                          <div className="font-medium">{order.gigName}</div>
                        </td>
                        <td className="p-4 border-t">
                          <div className="font-medium text-green-600">
                            {formatPrice(order.price)}
                          </div>
                        </td>
                        <td className="p-4 border-t">
                          <div className="text-gray-600">{order.orderDate}</div>
                        </td>
                        <td className="p-4 border-t">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}{" "}
                            {renderStatusText(order.status)}
                          </span>
                        </td>
                        <td className="p-4 border-t">
                          {order.status === "completed" && (
                            <>
                              {console.log("Order with completed status:", order)}
                              <ReviewButton 
                                orderId={order.id} 
                                isReviewed={order.isReviewed || false}
                                gigId={order.gigId}
                                reviewId={order.reviewId}
                              />
                              {order.isReviewed && (
                                <button
                                  onClick={() => handleViewReview(order)}
                                  className="px-3 py-1.5 bg-green-50 border border-green-300 text-green-700 text-xs rounded-md flex items-center"
                                >
                                  <Eye size={14} className="mr-1" />
                                  Xem đánh giá
                                </button>
                              )}
                            </>
                          )}
                        </td>
                        <td className="p-4 border-t">
                          {order.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 text-sm flex items-center"
                                onClick={() =>
                                  handleAction(order.id, "approve")
                                }
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Xác Nhận
                              </button>
                              <button
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 text-sm flex items-center"
                                onClick={() => handleAction(order.id, "reject")}
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Từ Chối
                              </button>
                            </div>
                          )}
                          {order.status === "approved" && (
                            <button
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 text-sm flex items-center"
                              onClick={() => handleAction(order.id, "complete")}
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Hoàn Thành
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-300 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <p className="text-lg font-medium">
                            Không tìm thấy đơn hàng nào
                          </p>
                          <p className="text-sm">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              Tổng số đơn hàng: {filteredOrders.length} / {orders.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
