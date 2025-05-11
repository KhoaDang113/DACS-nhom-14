import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { Briefcase } from 'lucide-react';

interface APIOrder {
  _id: string;
  customerId?: {
    name: string;
  };
  title: string;
  gigId?: {
    price: {
      $numberDecimal: string;
    };
  };
  createdAt: string;
  status: "pending" | "approved" | "completed" | "canceled" | "rejected";
}

export interface Order {
  id: string;
  customerName: string;
  gigName: string;
  price: number;
  orderDate: string;
  status: OrderStatus;
}

type OrderStatus = "pending" | "approved" | "completed" | "canceled" | "rejected";

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ orders: APIOrder[] }>(
          "http://localhost:5000/api/order/get-list-freelancer",
          {
            withCredentials: true,
          }
        );

        const mappedOrders: Order[] = response.data.orders.map(
          (order: APIOrder) => {
            const orderId = order._id;
            return {
              id: orderId,
              customerName: order.customerId?.name || "Không rõ",
              gigName: order.title,
              price: parseFloat(order.gigId?.price?.$numberDecimal || "0"),
              orderDate: new Date(order.createdAt).toLocaleDateString("vi-VN"),
              status: order.status,
            };
          }
        );

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const handleResponseOrder = async (orderId: string, response: 'approve' | 'reject') => {
    try {
      const result = await axios.post(
        `http://localhost:5000/api/order/response-request-create/${orderId}`,
        {
          response: response
        },
        {
          withCredentials: true
        }
      );

      if (result.data.error === false) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: result.data.order.status,
                }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi phản hồi đơn hàng:", error);
      alert("Có lỗi xảy ra khi phản hồi đơn hàng. Vui lòng thử lại sau.");
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const result = await axios.post(
        `http://localhost:5000/api/order/completed/${orderId}`,
        {},
        {
          withCredentials: true
        }
      );

      if (!result.data.error) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "completed",
                }
              : order
          )
        );
        toast.success('Đơn hàng đã được hoàn thành thành công!', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Lỗi khi hoàn thành đơn hàng:", error);
      toast.error('Có lỗi xảy ra khi hoàn thành đơn hàng. Vui lòng thử lại sau.', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleAction = async (
    id: string,
    action: "approve" | "reject" | "complete"
  ) => {
    if (action === "approve" || action === "reject") {
      await handleResponseOrder(id, action);
    } else if (action === "complete") {
      await handleCompleteOrder(id);
    }
  };

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-blue-100 w-full">
      <ToastContainer />
      <div className="w-full px-2 sm:max-w-[1400px] sm:mx-auto sm:px-0">
        <div className="w-full px-2 sm:px-8 py-4">
          <div className="flex items-center h-10">
            <div className="bg-blue-50 hover:bg-blue-100 rounded-md transition duration-300">
              <Link to="/dashboard" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                <FaArrowLeft className="mr-2" />
                <span className="font-medium">Quay lại</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full px-2 sm:px-8 py-4">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 sm:p-3 rounded-full">
                  <Briefcase className="w-5 h-5 sm:w-7 sm:h-7 text-indigo-600" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Quản Lý Đơn Đặt Hàng</h1>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl border border-gray-100">
              <div className="border-b border-gray-100 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Theo dõi và xử lý các đơn đặt hàng của khách hàng</p>
              </div>
              <div className="p-4 sm:p-5">
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
                      className="pl-10 border border-gray-300 p-3 rounded-xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      className="border border-gray-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 appearance-none w-full bg-white"
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
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl shadow-md">
                    <table className="w-full border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-indigo-600 text-white">
                          <th className="p-4 text-left font-semibold rounded-tl-xl w-[200px]">Tên Khách Hàng</th>
                          <th className="p-4 text-left font-semibold w-[250px]">Tên Dịch Vụ</th>
                          <th className="p-4 text-center font-semibold w-[150px]">Giá</th>
                          <th className="p-4 text-center font-semibold w-[120px]">Ngày Đặt</th>
                          <th className="p-4 text-center font-semibold w-[150px]">Trạng Thái</th>
                          <th className="p-4 text-center font-semibold rounded-tr-xl w-[300px]">Hành Động</th>
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
                              <td className="p-4 border-t w-[200px]">
                                <div className="font-medium truncate">
                                  {order.customerName}
                                </div>
                              </td>
                              <td className="p-4 border-t w-[250px]">
                                <div className="font-medium truncate">{order.gigName}</div>
                              </td>
                              <td className="p-4 border-t text-center w-[150px]">
                                <div className="font-medium text-green-600">
                                  {formatPrice(order.price)}
                                </div>
                              </td>
                              <td className="p-4 border-t text-center w-[120px]">
                                <div className="text-gray-600">{order.orderDate}</div>
                              </td>
                              <td className="p-4 border-t text-center w-[150px]">
                                <span
                                  className={`inline-flex items-center whitespace-nowrap justify-center min-w-[140px] px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(
                                    order.status
                                  )}`}
                                >
                                  {getStatusIcon(order.status)}{" "}
                                  {renderStatusText(order.status)}
                                </span>
                              </td>
                              <td className="p-4 border-t text-center w-[300px]">
                                {order.status === "pending" && (
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      className="flex items-center justify-center w-32 h-9 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 text-sm"
                                      onClick={async () => {
                                        await handleAction(order.id, "approve");
                                        toast.success('Đơn hàng đã được xác nhận! Bây giờ bạn có thể hoàn thành đơn hàng khi xong.', {
                                          position: "top-right",
                                          autoClose: 2000,
                                        });
                                      }}
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
                                      className="flex items-center justify-center w-32 h-9 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 text-sm"
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
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      className="inline-flex items-center justify-center w-32 h-9 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition duration-200 text-sm whitespace-nowrap"
                                      onClick={async () => {
                                        await handleAction(order.id, "complete");
                                        toast.success('Đơn hàng đã được hoàn thành và xác nhận thành công!', {
                                          position: "top-right",
                                          autoClose: 2000,
                                        });
                                      }}
                                    >
                                      <div className="flex items-center justify-center gap-1.5">
                                        <svg
                                          className="w-4 h-4 flex-shrink-0"
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
                                        <span className="flex-shrink-0">Hoàn thành</span>
                                      </div>
                                    </button>
                                  </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
