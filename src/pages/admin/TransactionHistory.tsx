"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "../../components/ui/admin/Dropdown";
import {
  Search,
  Filter,
  Calendar,
  Download,
  MoreHorizontal,
  Eye,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import apiClient from "../../lib/axios";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import DatePicker from "react-datepicker";
import Modal from "../../components/ui/admin/Modal";
import "react-datepicker/dist/react-datepicker.css";

interface Transaction {
  _id: string;
  gigId: {
    title: string;
    media: string[];
  };
  amount: number;
  status: "Completed" | "Pending" | "Refunded" | "Failed";
  createdAt: string;
  user: {
    name: string;
    email: string;
    _id: string;
  };
  userId?: {
    name: string;
    email: string;
    _id: string;
  };
}

interface TransactionResponse {
  error: boolean;
  message: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  transactions: Transaction[];
}

const TransactionHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const url = `/payment/admin/all-payments?page=${currentPage}&limit=10`;
      const response = await apiClient.get<TransactionResponse>(url);
      console.log("Dữ liệu giao dịch nhận được:", response.data);
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu giao dịch:", err);
      setError("Không thể tải dữ liệu giao dịch. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.user?.name || transaction.userId?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.gigId?.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.status || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || transaction.status === statusFilter;

    // Kiểm tra khoảng thời gian
    const transactionDate = new Date(transaction.createdAt);
    const matchesDateRange =
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= endDate);

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const statusCounts = useMemo(() => {
    return {
      total: transactions.length,
      completed: transactions.filter((t) => t.status === "Completed").length,
      pending: transactions.filter((t) => t.status === "Pending").length,
      refunded: transactions.filter((t) => t.status === "Refunded").length,
      failed: transactions.filter((t) => t.status === "Failed").length,
    };
  }, [transactions]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Refunded":
        return "secondary";
      case "Failed":
        return "danger";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} thg ${
      date.getMonth() + 1
    }, ${date.getFullYear()}`;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterStatus = (status: string | null) => {
    setStatusFilter(status);
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "Completed":
        return "Hoàn Thành";
      case "Pending":
        return "Đang Xử Lý";
      case "Refunded":
        return "Hoàn Tiền";
      case "Failed":
        return "Thất Bại";
      default:
        return status;
    }
  };
  const exportToExcel = () => {
    // Tạo tên file có khoảng thời gian nếu có lọc theo khoảng ngày
    let fileName = "Lich-Su-Giao-Dich";
    if (startDate && endDate) {
      const startStr = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      const endStr = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;
      fileName += `_${startStr}_den_${endStr}`;
    } else if (startDate) {
      const startStr = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      fileName += `_Tu-${startStr}`;
    } else if (endDate) {
      const endStr = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;
      fileName += `_Den-${endStr}`;
    }
    fileName += ".xlsx";

    // Chuẩn bị dữ liệu cho file Excel
    const data = filteredTransactions.map((transaction) => ({
      ID: transaction._id,
      "Người Dùng": transaction.user?.name || transaction.userId?.name || "N/A",
      Email: transaction.user?.email || transaction.userId?.email || "N/A",
      "Dịch Vụ": transaction.gigId?.title || "N/A",
      Ngày: formatDate(transaction.createdAt),
      "Số Tiền": transaction.amount.toFixed(2),
      "Trạng Thái": translateStatus(transaction.status),
    }));

    // Tạo workbook và worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Giao Dịch");

    // Điều chỉnh độ rộng của các cột
    const columnWidths = [
      { wch: 25 }, // ID
      { wch: 20 }, // Người Dùng
      { wch: 25 }, // Email
      { wch: 30 }, // Dịch Vụ
      { wch: 15 }, // Ngày
      { wch: 10 }, // Số Tiền
      { wch: 15 }, // Trạng Thái
    ];
    worksheet["!cols"] = columnWidths; // Xuất file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, fileName);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lịch Sử Giao Dịch</h1>{" "}
        <p className="text-gray-500 mt-1">
          Xem và quản lý tất cả các giao dịch của người dùng trên nền tảng.
          {(statusFilter || startDate || endDate) && (
            <button
              className="text-blue-500 ml-2 inline-flex items-center hover:underline"
              onClick={() => {
                setStatusFilter(null);
                setStartDate(null);
                setEndDate(null);
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Xóa bộ lọc
            </button>
          )}
        </p>
        {(startDate || endDate) && (
          <div className="mt-2 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm text-blue-700 font-medium">
              {startDate
                ? `Từ ${startDate.getDate()}/${
                    startDate.getMonth() + 1
                  }/${startDate.getFullYear()}`
                : "Tất cả ngày"}
              {endDate
                ? ` đến ${endDate.getDate()}/${
                    endDate.getMonth() + 1
                  }/${endDate.getFullYear()}`
                : ""}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm giao dịch..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {" "}
          <Button
            variant="outline"
            size="sm"
            icon={<Calendar className="h-4 w-4" />}
            onClick={() => setIsDatePickerOpen(true)}
          >
            {startDate || endDate ? "Lọc Theo Ngày" : "Khoảng Ngày"}
          </Button>
          <Dropdown
            trigger={
              <Button
                variant="outline"
                size="sm"
                icon={<Filter className="h-4 w-4" />}
              >
                {statusFilter
                  ? statusFilter === "Completed"
                    ? "Hoàn Thành"
                    : statusFilter === "Pending"
                    ? "Đang Xử Lý"
                    : statusFilter === "Refunded"
                    ? "Hoàn Tiền"
                    : "Thất Bại"
                  : "Trạng Thái"}
              </Button>
            }
            align="right"
          >
            <DropdownItem onClick={() => handleFilterStatus(null)}>
              <div className="flex justify-between w-full">
                <span>Tất Cả</span>
                <span className="bg-gray-100 px-1.5 rounded-full text-xs">
                  {statusCounts.total}
                </span>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterStatus("Completed")}>
              <div className="flex justify-between w-full">
                <span>Hoàn Thành</span>
                <span className="bg-green-100 text-green-800 px-1.5 rounded-full text-xs">
                  {statusCounts.completed}
                </span>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterStatus("Pending")}>
              <div className="flex justify-between w-full">
                <span>Đang Xử Lý</span>
                <span className="bg-yellow-100 text-yellow-800 px-1.5 rounded-full text-xs">
                  {statusCounts.pending}
                </span>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterStatus("Refunded")}>
              <div className="flex justify-between w-full">
                <span>Hoàn Tiền</span>
                <span className="bg-blue-100 text-blue-800 px-1.5 rounded-full text-xs">
                  {statusCounts.refunded}
                </span>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterStatus("Failed")}>
              <div className="flex justify-between w-full">
                <span>Thất Bại</span>
                <span className="bg-red-100 text-red-800 px-1.5 rounded-full text-xs">
                  {statusCounts.failed}
                </span>
              </div>
            </DropdownItem>
          </Dropdown>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="h-4 w-4" />}
            onClick={exportToExcel}
          >
            Xuất File
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Đang tải dữ liệu...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-6 text-center">Không tìm thấy giao dịch nào</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người Dùng</TableHead>
                <TableHead>Dịch Vụ</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Số Tiền</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-medium">
                    {transaction._id.substring(0, 8)}
                  </TableCell>
                  <TableCell>
                    {transaction.user?.name ||
                      transaction.userId?.name ||
                      "N/A"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.gigId?.title || "N/A"}
                  </TableCell>
                  <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                      {transaction.amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(transaction.status)}>
                      {transaction.status === "Completed" && "Hoàn Thành"}
                      {transaction.status === "Pending" && "Đang Xử Lý"}
                      {transaction.status === "Refunded" && "Hoàn Tiền"}
                      {transaction.status === "Failed" && "Thất Bại"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dropdown
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<MoreHorizontal className="h-4 w-4" />}
                        >
                          <span className="sr-only">Thao tác</span>
                        </Button>
                      }
                      align="right"
                    >
                      <DropdownItem>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </div>
                      </DropdownItem>
                      <DropdownItem>Xem người dùng</DropdownItem>
                      <DropdownItem>Xem dịch vụ</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Tải hóa đơn</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          {!loading && (
            <p className="text-sm text-gray-500">
              {statusFilter
                ? `Hiển thị ${filteredTransactions.length} giao dịch ${
                    statusFilter === "Completed"
                      ? "Hoàn Thành"
                      : statusFilter === "Pending"
                      ? "Đang Xử Lý"
                      : statusFilter === "Refunded"
                      ? "Hoàn Tiền"
                      : "Thất Bại"
                  }`
                : `Hiển thị trang ${currentPage} trên ${totalPages}`}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={statusFilter ? true : currentPage <= 1 || loading}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={
              statusFilter ? true : currentPage >= totalPages || loading
            }
          >
            Tiếp
          </Button>{" "}
        </div>
      </div>

      {/* Modal cho DatePicker */}
      <Modal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        title="Chọn Khoảng Thời Gian"
        size="md"
      >
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày Bắt Đầu
            </label>{" "}
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate || undefined}
              endDate={endDate || undefined}
              dateFormat="dd/MM/yyyy"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholderText="Chọn ngày bắt đầu"
              isClearable
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày Kết Thúc
            </label>{" "}
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate || undefined}
              endDate={endDate || undefined}
              minDate={startDate || undefined}
              dateFormat="dd/MM/yyyy"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholderText="Chọn ngày kết thúc"
              isClearable
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-between">
            {(startDate || endDate) && (
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-800"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                Xóa Bộ Lọc
              </button>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDatePickerOpen(false)}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsDatePickerOpen(false)}
              >
                Áp Dụng
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionHistory;
