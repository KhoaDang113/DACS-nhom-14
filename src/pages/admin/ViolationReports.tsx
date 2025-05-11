"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
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
import Badge from "../../components/ui/admin/Badge";
import { Dropdown, DropdownItem } from "../../components/ui/admin/Dropdown";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Check,
  X,
  Loader,
} from "lucide-react";

// Định nghĩa interface cho dữ liệu báo cáo vi phạm từ API
interface Violation {
  _id: string;
  gigId: {
    _id: string;
    title: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  description: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
  resolvedAt: string | null;
}

const ViolationReports: React.FC = () => {
  // State
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Hàm lấy dữ liệu báo cáo vi phạm từ API
  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/complaint/get",
        {
          withCredentials: true,
        }
      );

      if (!response.data.error && response.data.complaints) {
        setViolations(response.data.complaints);
        setError(null);
      } else {
        setError(
          response.data.message || "Không thể tải dữ liệu báo cáo vi phạm"
        );
      }
    } catch (err: any) {
      console.error("Lỗi khi tải dữ liệu báo cáo vi phạm:", err);
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchViolations();
  }, []);

  // Hàm xử lý báo cáo vi phạm (phê duyệt/từ chối)
  const handleViolation = async (
    id: string,
    status: "resolved" | "rejected"
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/complaint/${id}/handle-complaint`,
        { status },
        { withCredentials: true }
      );

      if (!response.data.error) {
        toast.success(
          status === "resolved"
            ? "Đã xử lý báo cáo vi phạm thành công"
            : "Đã bỏ qua báo cáo vi phạm"
        );

        // Cập nhật dữ liệu trên UI
        setViolations((prevViolations) =>
          prevViolations.map((violation) =>
            violation._id === id
              ? { ...violation, status, resolvedAt: new Date().toISOString() }
              : violation
          )
        );
      } else {
        toast.error(response.data.message || "Không thể xử lý báo cáo vi phạm");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Đã xảy ra lỗi khi xử lý báo cáo vi phạm"
      );
    }
  };

  // Hàm xem chi tiết báo cáo vi phạm
  const viewViolationDetail = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/complaint/${id}/get`,
        {
          withCredentials: true,
        }
      );

      if (!response.data.error) {
        // Hiển thị thông tin chi tiết báo cáo trong modal hoặc trang mới
        toast.success("Đã tải chi tiết báo cáo vi phạm");
        console.log("Chi tiết báo cáo vi phạm:", response.data.complaint);

        // Đoạn này có thể mở modal hiển thị chi tiết báo cáo
        // hoặc chuyển hướng đến trang chi tiết
      } else {
        toast.error(
          response.data.message || "Không thể tải chi tiết báo cáo vi phạm"
        );
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Đã xảy ra lỗi khi tải chi tiết báo cáo vi phạm"
      );
    }
  };

  // Lọc báo cáo vi phạm theo từ khóa tìm kiếm và trạng thái
  const filteredViolations = violations.filter((violation) => {
    const matchesSearch =
      violation.gigId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter
      ? violation.status === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });

  // Định dạng ngày giờ từ chuỗi ISO
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Lấy variant cho badge trạng thái
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "resolved":
        return "success";
      case "rejected":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Dịch trạng thái sang tiếng Việt
  const translateStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "resolved":
        return "Đã xử lý";
      case "rejected":
        return "Đã bỏ qua";
      default:
        return status;
    }
  };

  // Dịch lý do báo cáo sang tiếng Việt
  const translateReason = (reason: string) => {
    switch (reason) {
      case "dịch vụ bị cấm":
        return "Dịch vụ bị cấm";
      case "nội dung không phù hợp":
        return "Nội dung không phù hợp";
      case "không nguyên bản":
        return "Không nguyên bản";
      case "vi phạm quyền sở hữu trí tuệ":
        return "Vi phạm quyền sở hữu trí tuệ";
      case "khác":
        return "Lý do khác";
      default:
        return reason;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Báo Cáo Vi Phạm</h1>
        <p className="text-gray-500 mt-1">
          Xem xét và quản lý các báo cáo vi phạm trên nền tảng.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm báo cáo..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Dropdown
            trigger={
              <Button
                variant="outline"
                size="sm"
                icon={<Filter className="h-4 w-4" />}
              >
                {statusFilter ? translateStatus(statusFilter) : "Lọc"}
              </Button>
            }
            align="right"
          >
            <DropdownItem onClick={() => setStatusFilter(null)}>
              Tất cả
            </DropdownItem>
            <DropdownItem onClick={() => setStatusFilter("pending")}>
              Chờ xử lý
            </DropdownItem>
            <DropdownItem onClick={() => setStatusFilter("resolved")}>
              Đã xử lý
            </DropdownItem>
            <DropdownItem onClick={() => setStatusFilter("rejected")}>
              Đã bỏ qua
            </DropdownItem>
          </Dropdown>
          <Dropdown
            trigger={
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowUpDown className="h-4 w-4" />}
              >
                Sắp xếp
              </Button>
            }
            align="right"
          >
            <DropdownItem
              onClick={() => {
                setSortField("createdAt");
                setSortOrder("desc");
              }}
            >
              Mới nhất
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setSortField("createdAt");
                setSortOrder("asc");
              }}
            >
              Cũ nhất
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : filteredViolations.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 p-8 rounded-lg text-center">
          Không có báo cáo vi phạm nào
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredViolations.map((violation) => (
                <TableRow key={violation._id}>
                  <TableCell className="font-medium">
                    {violation._id.substring(0, 6)}...
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {violation.gigId.title}
                  </TableCell>
                  <TableCell>{violation.userId?.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {translateReason(violation.reason)}
                  </TableCell>
                  <TableCell>{formatDate(violation.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(violation.status)}
                      className="capitalize"
                    >
                      {translateStatus(violation.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => viewViolationDetail(violation._id)}
                      >
                        <span className="sr-only">Xem</span>
                      </Button>

                      {violation.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                            icon={<Check className="h-4 w-4" />}
                            onClick={() =>
                              handleViolation(violation._id, "resolved")
                            }
                          >
                            <span className="sr-only">Phê duyệt</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            icon={<X className="h-4 w-4" />}
                            onClick={() =>
                              handleViolation(violation._id, "rejected")
                            }
                          >
                            <span className="sr-only">Từ chối</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && !error && filteredViolations.length > 0 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Trước
          </Button>
          <span className="text-sm text-gray-500">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          >
            Tiếp
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViolationReports;
