"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/admin/Table";
import Button from "../../components/ui/admin/Button";
import Input from "../../components/ui/admin/Input";
import {
  Search,
  Plus,
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem } from "../../components/ui/admin/Dropdown";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// Định nghĩa interface cho JobBanner
interface JobBanner {
  _id: string;
  title: string;
  description: string;
  image: {
    type: string;
    url: string;
  };
  cta: string;
  ctaLink: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

const JobBanner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobBanners, setJobBanners] = useState<JobBanner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // Lấy danh sách banner từ API
  const fetchJobBanners = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();

      if (!token) {
        throw new Error("Không thể lấy token xác thực");
      }

      const response = await axios.get(
        `http://localhost:5000/api/admin/job-banner/get-list?page=${page}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        const { data } = response.data;

        if (data && Array.isArray(data.jobBanners)) {
          setJobBanners(data.jobBanners);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(Number(data.currentPage || 1));
        } else {
          console.error("Cấu trúc dữ liệu không đúng:", response.data);
          setError("Cấu trúc dữ liệu không đúng định dạng");
          setJobBanners([]);
        }
      } else {
        setError("Không nhận được dữ liệu từ server");
        setJobBanners([]);
      }
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách job banner:", error);
      setError(
        error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải dữ liệu"
      );
      setJobBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount hoặc khi trang thay đổi
  useEffect(() => {
    fetchJobBanners(currentPage);
  }, [currentPage]);

  // Lọc các banner theo từ khóa tìm kiếm
  const filteredBanners = jobBanners.filter((banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch (err) {
      console.error("Lỗi khi định dạng ngày tháng:", err);
      return "Không xác định";
    }
  };

  // Xử lý chuyển trang
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Xử lý xóa banner
  const handleDeleteBanner = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa banner này không?")) {
      try {
        setIsDeleting(true);
        setDeletingId(id);
        const token = await getToken();

        if (!token) {
          throw new Error("Không thể lấy token xác thực");
        }

        const response = await axios.delete(
          `http://localhost:5000/api/admin/job-banner/delete/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          // Cập nhật lại danh sách sau khi xóa
          setJobBanners(jobBanners.filter((banner) => banner._id !== id));
          alert("Xóa banner thành công");
        } else {
          throw new Error(response.data.message || "Xóa banner thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi xóa banner:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi khi xóa banner"
        );
      } finally {
        setIsDeleting(false);
        setDeletingId(null);
      }
    }
  };

  // Xử lý cập nhật banner (redirect tới trang edit)
  const handleEditBanner = (id: string) => {
    navigate(`/admin/job-banners/edit/${id}`);
  };

  // Xử lý xem chi tiết banner
  const handleViewBannerDetails = (id: string) => {
    navigate(`/admin/job-banners/view/${id}`);
  };

  return (
    <div className="space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold">Job Banners</h1>
        <p className="text-gray-500 mt-1">
          Quản lý các banner job nổi bật trên trang chủ và trang tìm kiếm
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm banner..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link to="/admin/job-banners/create">
          <Button icon={<Plus className="h-4 w-4" />}>Thêm Banner</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => fetchJobBanners(currentPage)}
            className="text-sm underline mt-1"
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề banner</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Thời gian tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell className="text-center py-8" colSpan={4}>
                  <div className="text-gray-500">Đang tải dữ liệu...</div>
                </TableCell>
              </TableRow>
            )}

            {!loading && filteredBanners.length === 0 && (
              <TableRow>
                <TableCell className="text-center py-8" colSpan={4}>
                  <div className="text-gray-500">Không tìm thấy banner nào</div>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              filteredBanners.length > 0 &&
              filteredBanners.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden">
                        <img
                          src={banner.image?.url || "/placeholder.svg"}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {banner.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {banner.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      <a
                        href={banner.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {banner.cta}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                      <span className="text-sm">
                        {formatDate(banner.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dropdown
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<MoreHorizontal className="h-4 w-4" />}
                        >
                          <span className="sr-only">Hành động</span>
                        </Button>
                      }
                      align="right"
                    >
                      <div onWheel={(e) => e.stopPropagation()}>
                        <DropdownItem
                          onClick={() => handleViewBannerDetails(banner._id)}
                        >
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleEditBanner(banner._id)}
                        >
                          <div className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleDeleteBanner(banner._id)}
                        >
                          <div className="flex items-center text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isDeleting && deletingId === banner._id
                              ? "Đang xóa..."
                              : "Xóa"}
                          </div>
                        </DropdownItem>
                      </div>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    trang {currentPage} / {totalPages}
                  </span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBanner;
