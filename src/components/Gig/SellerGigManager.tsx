import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import {
  Eye,
  Package,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";

interface Gig {
  _id: string;
  title: string;
  description: string;
  media: [{ url: string; type: string }];
  status: "approved" | "hidden" | "pending" | "rejected";
  views: number;
  orders: number;
}

interface ErrorResponse {
  message: string;
}

const ITEMS_PER_PAGE = 10;

const SellerGigManager: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleEdit = async (id: string) => {
    try {
      navigate(`/edit-gig/${id}`);
    } catch (err) {
      setError(err as string);
    }
  };

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/gigs/get-list",
          {
            withCredentials: true,
            params: {
              page: currentPage,
              limit: ITEMS_PER_PAGE,
            },
          }
        );
        if (response.data.error) {
          setError(response.data.message);
        } else {
          setGigs(response.data.gigs);
          setTotalPages(
            Math.max(1, Math.ceil(response.data.total / ITEMS_PER_PAGE))
          );
        }
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa dịch vụ này?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/gigs/delete/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.error) {
          showNotification(response.data.message, "error");
        } else {
          // Cập nhật danh sách gigs sau khi xóa thành công
          setGigs(gigs.filter((gig) => gig._id !== id));
          showNotification("Xóa dịch vụ thành công!", "success");
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        showNotification(
          error.response?.data?.message || "Lỗi khi xóa dịch vụ",
          "error"
        );
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Đang hoạt động
          </span>
        );
      case "hidden":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Tạm dừng
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Bị từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Đang chờ duyệt
          </span>
        );
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="flex items-center justify-center">
          <span className="mr-2">⚠️</span> {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop/Tablet View */}
      <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                STT
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Dịch vụ
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mô tả
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Lượt xem
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center justify-center">
                  <Package className="w-4 h-4 mr-1" />
                  Đơn hàng
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gigs.map((gig, index) => (
              <tr key={gig._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 pl-4 pr-3 text-sm text-gray-500">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="py-4 pl-4 pr-3">
                  <div className="flex items-center">
                    <div className="h-14 w-14 flex-shrink-0">
                      <img
                        className="h-14 w-14 rounded-md object-cover shadow-sm"
                        src={gig.media[0]?.url}
                        alt={gig.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div
                        className="font-medium text-gray-900 line-clamp-1 truncate max-w-[180px]"
                        title={gig.title}
                      >
                        {gig.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div
                    className="text-sm text-gray-500 line-clamp-2 max-w-[250px]"
                    title={gig.description}
                  >
                    {gig.description}
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 text-center">
                  {gig.views || 0}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 text-center">
                  {gig.orders || 0}
                </td>
                <td className="px-3 py-4 text-center">
                  {getStatusBadge(gig.status)}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 text-right">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => handleEdit(gig._id)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none transition"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(gig._id)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none transition"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden w-full">
        {gigs.map((gig) => (
          <div
            key={gig._id}
            className="bg-white p-4 rounded-lg shadow space-y-3 w-full"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-20 w-20 flex-shrink-0">
                  <img
                    className="h-20 w-20 rounded-md object-cover"
                    src={gig.media[0]?.url}
                    alt={gig.title}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {gig.title}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {gig.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center p-2 bg-gray-50 rounded">
                <Eye className="w-4 h-4 mr-1 text-gray-500" />
                <span>{gig.views || 0} lượt xem</span>
              </div>
              <div className="flex items-center justify-center p-2 bg-gray-50 rounded">
                <Package className="w-4 h-4 mr-1 text-gray-500" />
                <span>{gig.orders || 0} đơn hàng</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>{getStatusBadge(gig.status)}</div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(gig._id)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(gig._id)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gigs.length > 0 && renderPagination()}
    </div>
  );
};

export default SellerGigManager;
