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
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Dropdown, DropdownItem } from "../../components/ui/admin/Dropdown";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// Định nghĩa interface cho Hot Job
interface HotJob {
  _id: string;
  title: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  media: {
    url: string;
    type: string;
  }[];
  freelancer: {
    _id: string;
    name: string;
    avatar?: string;
  };
  isHot: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

const JobHotManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hotJobs, setHotJobs] = useState<HotJob[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(true);
  const { getToken } = useAuth();

  // Lấy danh sách job hot từ API
  const fetchHotJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();

      if (!token) {
        throw new Error("Không thể lấy token xác thực");
      }

      const response = await axios.get(
        `http://localhost:5000/api/admin/gigs/get-hot-jobs?page=${page}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        const { data } = response;
        if (data && Array.isArray(data.hotJobs)) {
          setHotJobs(data.hotJobs);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(Number(data.currentPage || 1));
        } else {
          console.error("Cấu trúc dữ liệu không đúng:", response.data);
          setError("Cấu trúc dữ liệu không đúng định dạng");
          setHotJobs([]);
        }
      } else {
        setError("Không nhận được dữ liệu từ server");
        setHotJobs([]);
      }
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách hot job:", error);
      setError(
        error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải dữ liệu"
      );
      setHotJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý toggle trạng thái hot job
  const handleToggleHot = async (jobId: string, isHot: boolean) => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Không thể lấy token xác thực");
      }

      const response = await axios.patch(
        `http://localhost:5000/api/admin/gigs/toggle-hot/${jobId}`,
        { isHot },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        // Cập nhật state
        setHotJobs((prev) =>
          prev.map((job) => (job._id === jobId ? { ...job, isHot } : job))
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hot job:", error);
      setError("Không thể cập nhật trạng thái job");
    }
  };

  // Xử lý toggle trạng thái ẩn/hiện dịch vụ
  const handleToggleVisibility = async (jobId: string) => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Không thể lấy token xác thực");
      }

      const response = await axios.put(
        `http://localhost:5000/api/admin/gigs/${jobId}/hide`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        // Cập nhật state
        setHotJobs((prev) =>
          prev.map((job) => 
            job._id === jobId 
              ? { ...job, isDeleted: !job.isDeleted } 
              : job
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái ẩn/hiện dịch vụ:", error);
      setError("Không thể cập nhật trạng thái ẩn/hiện dịch vụ");
    }
  };

  // Gọi API khi component mount hoặc khi trang thay đổi
  useEffect(() => {
    fetchHotJobs(currentPage);
  }, [currentPage]);

  // Lọc các job theo từ khóa tìm kiếm và trạng thái ẩn/hiện
  const filteredJobs = hotJobs.filter(
    (job) =>
      (showHidden || !job.isDeleted) && 
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
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

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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

  const handleViewDetails = (jobId: string) => {
    // Chuyển hướng đến trang chi tiết job
    window.open(`/gig/${jobId}`, "_blank");
  };

  return (
    <div className="space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold">Quản lý Job Hot</h1>
        <p className="text-gray-500 mt-1">
          Quản lý các gig nổi bật và dịch vụ job hot trên nền tảng
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm gig..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Hiển thị dịch vụ đã ẩn</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
          <button
            onClick={() => fetchHotJobs(currentPage)}
            className="text-sm underline mt-1"
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Bảng hiển thị trên màn hình lớn */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>THÔNG TIN GIG</TableHead>
                <TableHead>NGƯỜI BÁN</TableHead>
                <TableHead>GIÁ</TableHead>
                <TableHead>TRẠNG THÁI</TableHead>
                <TableHead>THỜI GIAN TẠO</TableHead>
                <TableHead className="text-right">HÀNH ĐỘNG</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">Đang tải dữ liệu...</div>
                  </TableCell>
                </TableRow>
              )}

              {!loading && filteredJobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">Không tìm thấy job nào</div>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredJobs.length > 0 &&
                filteredJobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <img
                            src={job.media[0].url}
                            alt={job.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3
                            className="font-medium text-gray-900 truncate max-w-[250px]"
                            title={job.title}
                          >
                            {job.title}
                          </h3>
                          <p
                            className="text-sm text-gray-500 mt-1 line-clamp-1 truncate max-w-[250px]"
                            title={job.description}
                          >
                            {job.description}
                          </p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {job.category.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src={job.freelancer.avatar}
                            alt={job.freelancer.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder.svg";
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {job.freelancer.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {formatPrice(job.price)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          job.isHot
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.isHot ? "🔥 Job Hot" : "Thường"}
                      </span>
                      {job.isDeleted && (
                        <span className="inline-flex items-center ml-2 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Đã ẩn
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                        <span className="text-sm">
                          {formatDate(job.createdAt)}
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
                        {job.isHot ? (
                          <DropdownItem
                            onClick={() => handleToggleHot(job._id, false)}
                          >
                            <div className="flex items-center text-orange-600">
                              <TrendingDown className="h-4 w-4 mr-2" />
                              Tắt Job Hot
                            </div>
                          </DropdownItem>
                        ) : (
                          <DropdownItem
                            onClick={() => handleToggleHot(job._id, true)}
                          >
                            <div className="flex items-center text-red-600">
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Đẩy lên Job Hot
                            </div>
                          </DropdownItem>
                        )}
                        <DropdownItem onClick={() => handleViewDetails(job._id)}>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết Gig
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => handleToggleVisibility(job._id)}>
                          <div className="flex items-center text-gray-600">
                            <EyeOff className="h-4 w-4 mr-2" />
                            {job.isDeleted ? "Hiện dịch vụ" : "Ẩn dịch vụ"}
                          </div>
                        </DropdownItem>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Hiển thị dạng card trên thiết bị di động */}
        <div className="md:hidden">
          {loading && (
            <div className="text-center py-8">
              <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
          )}

          {!loading && filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">Không tìm thấy job nào</div>
            </div>
          )}

          {!loading &&
            filteredJobs.length > 0 &&
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="border-b border-gray-200 p-4 last:border-b-0"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                    <img
                      src={job.media[0].url}
                      alt={job.title}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium text-gray-900 truncate"
                      title={job.title}
                    >
                      {job.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                        <img
                          src={job.freelancer.avatar}
                          alt={job.freelancer.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 truncate">
                        {job.freelancer.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Giá:</span>
                    <div className="font-medium text-green-600 text-sm">
                      {formatPrice(job.price)}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Ngày tạo:</span>
                    <div className="text-sm flex items-center">
                      <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                      {formatDate(job.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {job.category.name}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      job.isHot
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {job.isHot ? "🔥 Job Hot" : "Thường"}
                  </span>
                  {job.isDeleted && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Đã ẩn
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(job._id)}
                      className="flex items-center text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Chi tiết
                    </Button>
                    <Button
                      size="sm"
                      variant={job.isHot ? "outline" : "primary"}
                      onClick={() => handleToggleHot(job._id, !job.isHot)}
                      className={`flex items-center text-xs ${
                        job.isHot ? "text-orange-600" : ""
                      }`}
                    >
                      {job.isHot ? (
                        <>
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Tắt Hot
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Đẩy Hot
                        </>
                      )}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleVisibility(job._id)}
                    className="flex items-center text-xs"
                  >
                    <EyeOff className="h-3 w-3 mr-1" />
                    {job.isDeleted ? "Hiện dịch vụ" : "Ẩn dịch vụ"}
                  </Button>
                </div>
              </div>
            ))}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="text-sm px-3 py-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
              </Button>
              <div className="flex items-center mx-2">
                <span className="text-sm text-gray-700">
                  {currentPage}/{totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="text-sm px-3 py-1"
              >
                Sau
                <ChevronRight className="h-4 w-4 ml-1" />
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

export default JobHotManagement;
