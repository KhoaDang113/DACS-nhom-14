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
  EyeOff,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Tooltip from "@radix-ui/react-tooltip";

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
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [gigToDelete, setGigToDelete] = useState<string | null>(null);

  const handleEdit = async (id: string) => {
    try {
      navigate(`/edit-gig/${id}`);
    } catch (err) {
      setError(err as string);
    }
  };

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
          Math.max(1, Math.ceil(response.data.pagination.totalPages))
        );
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [currentPage]);

  const openDeleteModal = (id: string) => {
    setGigToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setGigToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!gigToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/gigs/delete/${gigToDelete}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.error) {
        toast.error("Có lỗi xảy ra khi xóa dịch vụ", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.success("Xóa dịch vụ thành công!", {
          position: "top-right",
          autoClose: 2000,
        });
        await fetchGigs();
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Lỗi khi xóa dịch vụ", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      closeDeleteModal();
    }
  };

  const handleHideGig = async (id: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/gigs/hidden/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.error) {
        const errorMessage =
          response.data.message === "Cannot hide gig with existing orders"
            ? "Không thể ẩn dịch vụ khi đang có đơn hàng tồn tại"
            : "Có lỗi xảy ra khi cập nhật trạng thái dịch vụ";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        setGigs(
          gigs.map((gig) =>
            gig._id === id ? { ...gig, status: response.data.gig.status } : gig
          )
        );
        toast.success(
          response.data.gig.status === "hidden"
            ? "Đã ẩn dịch vụ thành công!"
            : "Đã hiện dịch vụ thành công!",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const errorMessage =
        error.response?.data?.message === "Cannot hide gig with existing orders"
          ? "Không thể ẩn dịch vụ khi đang có đơn hàng tồn tại"
          : "Lỗi khi cập nhật trạng thái dịch vụ";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center justify-center w-32 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Đang hoạt động
          </span>
        );
      case "hidden":
        return (
          <span className="inline-flex items-center justify-center w-32 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Tạm dừng
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center justify-center w-32 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Bị từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center w-32 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
      <ToastContainer />
      <Tooltip.Provider>
        {/* Desktop/Tablet View */}
        <div className="hidden md:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]"
                  >
                    STT
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]"
                  >
                    Dịch vụ
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]"
                  >
                    Mô tả
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
                  >
                    <div className="flex items-center justify-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Lượt xem
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
                  >
                    <div className="flex items-center justify-center">
                      <Package className="w-4 h-4 mr-1" />
                      Đơn hàng
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[18%]"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gigs.map((gig, index) => (
                  <tr
                    key={gig._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 pl-4 pr-3 text-sm text-gray-500 whitespace-nowrap">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="py-4 pl-4 pr-3">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-md object-cover shadow-sm"
                            src={gig.media[0]?.url}
                            alt={gig.title}
                          />
                        </div>
                        <div className="ml-3 max-w-[200px]">
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <div className="font-medium text-gray-900 line-clamp-1 cursor-default">
                                {gig.title}
                              </div>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="bg-black text-white px-2 py-1 rounded text-xs max-w-md"
                                side="top"
                                sideOffset={4}
                              >
                                {gig.title}
                                <Tooltip.Arrow className="fill-black" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-[250px] cursor-default">
                            {gig.description}
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="bg-black text-white px-2 py-1 rounded text-xs max-w-md"
                            side="top"
                            sideOffset={4}
                          >
                            {gig.description}
                            <Tooltip.Arrow className="fill-black" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 text-center whitespace-nowrap">
                      {gig.views || 0}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 text-center whitespace-nowrap">
                      {gig.orders || 0}
                    </td>
                    <td className="px-3 py-4 text-center whitespace-nowrap">
                      {getStatusBadge(gig.status)}
                    </td>
                    <td className="px-3 py-4 text-sm text-right whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleEdit(gig._id)}
                          className="inline-flex items-center justify-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none transition"
                          title="Sửa"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleHideGig(gig._id)}
                          className="inline-flex items-center justify-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none transition"
                          title={gig.status === "hidden" ? "Hiện" : "Ẩn"}
                        >
                          {gig.status === "hidden" ? (
                            <Eye className="w-3 h-3 mr-1" />
                          ) : (
                            <EyeOff className="w-3 h-3 mr-1" />
                          )}
                          {gig.status === "hidden" ? "Hiện" : "Ẩn"}
                        </button>
                        <button
                          onClick={() => openDeleteModal(gig._id)}
                          className="inline-flex items-center justify-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden">
          <div className="grid grid-cols-1 gap-4 w-full">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="bg-white p-4 rounded-lg shadow w-full"
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="h-20 w-20 flex-shrink-0">
                      <img
                        className="h-20 w-20 rounded-md object-cover"
                        src={gig.media[0]?.url}
                        alt={gig.title}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2 cursor-default">
                            {gig.title}
                          </p>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="bg-black text-white px-2 py-1 rounded text-xs max-w-xs"
                            side="top"
                            sideOffset={4}
                          >
                            {gig.title}
                            <Tooltip.Arrow className="fill-black" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1 cursor-default">
                            {gig.description}
                          </p>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="bg-black text-white px-2 py-1 rounded text-xs max-w-xs"
                            side="top"
                            sideOffset={4}
                          >
                            {gig.description}
                            <Tooltip.Arrow className="fill-black" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <Eye className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{gig.views || 0} lượt xem</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <Package className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{gig.orders || 0} đơn hàng</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div>{getStatusBadge(gig.status)}</div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(gig._id)}
                        className="inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleHideGig(gig._id)}
                        className="inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                      >
                        {gig.status === "hidden" ? (
                          <Eye className="w-3 h-3 mr-1" />
                        ) : (
                          <EyeOff className="w-3 h-3 mr-1" />
                        )}
                        {gig.status === "hidden" ? "Hiện" : "Ẩn"}
                      </button>
                      <button
                        onClick={() => openDeleteModal(gig._id)}
                        className="inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Tooltip.Provider>

      {gigs.length > 0 && renderPagination()}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể
              hoàn tác.
            </p>
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerGigManager;
