"use client";

import React, { useState, useEffect } from "react";
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
import Avatar from "../../components/ui/admin/Avatar";
import { ConfirmDialog } from "../../components/ui/admin/Dialog";
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "../../components/ui/admin/Dropdown";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  User,
  Mail,
  Key,
  Trash2,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Định nghĩa interface cho dữ liệu người bán từ API
interface Seller {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isLocked: boolean;
  createdAt: string;
  gigsCount?: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalSellers: number;
}

const SellerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State cho dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
    variant: 'danger' | 'primary' | 'success';
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
    variant: 'primary'
  });
  
  // Phân trang
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalSellers: 0
  });
  
  // Sắp xếp
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  
  // Lọc
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Hàm để fetch danh sách người bán từ API
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/admin/user/get`, 
        {
          withCredentials: true,
          params: {
            page: pagination.currentPage,
            limit: 10,
            sort: sortField,
            order: sortOrder,
            role: "freelancer",
            status: filterStatus !== "all" ? filterStatus : undefined
          }
        }
      );

      if (!response.data.error) {
        setSellers(response.data.users || []);
        
        // Cập nhật thông tin phân trang
        setPagination({
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalSellers: response.data.pagination?.totalUsers || 0
        });
        
        setError(null);
      } else {
        setError(response.data.message || "Không thể tải danh sách người bán");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người bán:", err);
      setError("Đã có lỗi xảy ra khi tải danh sách người bán");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật lại danh sách người bán đã lọc khi có thay đổi
  useEffect(() => {
    if (!sellers.length) return;
    
    const filtered = sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredSellers(filtered);
  }, [sellers, searchTerm]);

  // Fetch dữ liệu khi component mount hoặc khi thay đổi các tham số tìm kiếm
  useEffect(() => {
    fetchSellers();
  }, [pagination.currentPage, sortField, sortOrder, filterStatus]);

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: page }));
  };
  
  // Xử lý sắp xếp
  const handleSort = (field: string) => {
    if (field === sortField) {
      // Nếu đã sắp xếp theo field này, thay đổi hướng sắp xếp
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Nếu chưa sắp xếp theo field này, mặc định là asc
      setSortField(field);
      setSortOrder("asc");
    }
  };
  
  // Xử lý thay đổi trạng thái người bán (khóa/mở khóa)
  const handleToggleLock = (seller: Seller) => {
    const action = seller.isLocked ? "mở khóa" : "khóa";
    
    setConfirmDialog({
      isOpen: true,
      title: `Xác nhận ${action} tài khoản`,
      description: `Bạn có chắc chắn muốn ${action} tài khoản "${seller.name}" không?`,
      variant: seller.isLocked ? 'success' : 'primary',
      action: async () => {
        try {
          const response = await axios.put(
            `http://localhost:5000/api/admin/user/${seller._id}/is-locked`,
            {},
            { withCredentials: true }
          );
          
          if (!response.data.error) {
            // Cập nhật danh sách người bán với trạng thái mới
            setSellers(prevSellers => 
              prevSellers.map(s => 
                s._id === seller._id 
                  ? { ...s, isLocked: !s.isLocked } 
                  : s
              )
            );
            
            toast.success(`Đã ${action} tài khoản ${seller.name} thành công`);
          } else {
            toast.error(response.data.message || `Không thể ${action} tài khoản`);
          }
        } catch (err) {
          console.error(`Lỗi khi ${action} tài khoản:`, err);
          toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
      }
    });
  };
  
  // Xử lý xóa tài khoản người bán
  const handleDeleteAccount = (seller: Seller) => {
    setConfirmDialog({
      isOpen: true,
      title: "Xác nhận xóa tài khoản",
      description: `Bạn có chắc chắn muốn xóa tài khoản "${seller.name}" không? Hành động này không thể hoàn tác.`,
      variant: 'danger',
      action: async () => {
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/admin/user/${seller._id}`,
            { withCredentials: true }
          );
          
          if (!response.data.error) {
            // Xóa người bán khỏi danh sách
            setSellers(prevSellers => prevSellers.filter(s => s._id !== seller._id));
            toast.success(`Đã xóa tài khoản ${seller.name} thành công`);
          } else {
            toast.error(response.data.message || "Không thể xóa tài khoản");
          }
        } catch (err) {
          console.error("Lỗi khi xóa tài khoản:", err);
          toast.error("Đã có lỗi xảy ra khi xóa tài khoản, vui lòng thử lại sau");
        }
      }
    });
  };
  
  // Xử lý xem chi tiết người bán
  const handleViewProfile = (seller: Seller) => {
    // Sử dụng API admin để tải thông tin chi tiết người dùng
    axios.get(`http://localhost:5000/api/admin/user/${seller._id}/profile`, { withCredentials: true })
      .then(response => {
        if (!response.data.error) {
          // Mở tab mới để hiển thị trang profile
          window.open(`/profile/${seller._id}`, "_blank");
        } else {
          // Hiển thị thông báo lỗi nếu không lấy được thông tin
          toast.error(response.data.message || "Không thể tải thông tin chi tiết người dùng");
        }
      })
      .catch(err => {
        // Xử lý lỗi khi gọi API
        console.error("Lỗi khi tải thông tin chi tiết người dùng:", err);
        toast.error("Đã có lỗi xảy ra khi tải thông tin người dùng");
      });
  };
  
  // Định dạng ngày tham gia
  const formatJoinDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "dd MMM, yyyy", { locale: vi });
    } catch (error) {
      return "Không rõ";
    }
  };

  // Hiển thị trang loading
  if (loading && !sellers.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500">Đang tải danh sách người bán...</p>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error && !sellers.length) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p className="font-medium mb-1">Đã có lỗi xảy ra!</p>
        <p>{error}</p>
        <button 
          onClick={fetchSellers} 
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-visible w-full">
      {/* Dialog xác nhận */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText="Đồng ý"
        cancelText="Không"
        confirmVariant={confirmDialog.variant}
      />
      
      <div>
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <p className="text-gray-500 mt-1">
          Quản lý và điều hành người dùng trên nền tảng của bạn.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm người bán..."
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
                {filterStatus === "all" 
                  ? "Tất cả" 
                  : filterStatus === "true" 
                    ? "Đã khóa" 
                    : "Đang hoạt động"}
              </Button>
            }
            align="right"
          >
            <DropdownItem onClick={() => setFilterStatus("all")}>Tất cả</DropdownItem>
            <DropdownItem onClick={() => setFilterStatus("false")}>Đang hoạt động</DropdownItem>
            <DropdownItem onClick={() => setFilterStatus("true")}>Đã khóa</DropdownItem>
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
            <DropdownItem onClick={() => handleSort("name")}>Tên (A-Z)</DropdownItem>
            <DropdownItem onClick={() => handleSort("-name")}>Tên (Z-A)</DropdownItem>
            <DropdownItem onClick={() => handleSort("createdAt")}>Cũ nhất</DropdownItem>
            <DropdownItem onClick={() => handleSort("-createdAt")}>Mới nhất</DropdownItem>
            <DropdownItem onClick={() => handleSort("gigsCount")}>Số lượng dịch vụ (tăng dần)</DropdownItem>
            <DropdownItem onClick={() => handleSort("-gigsCount")}>Số lượng dịch vụ (giảm dần)</DropdownItem>
          </Dropdown>
        </div>
      </div>

      {loading && sellers.length > 0 && (
        <div className="w-full py-2 flex justify-center">
          <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
          <span className="sr-only">Đang tải...</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Người bán</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  {searchTerm ? (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="h-8 w-8 mb-2 text-gray-400" />
                      <p>Không tìm thấy kết quả phù hợp</p>
                      <p className="text-sm">Hãy thử tìm kiếm với từ khóa khác</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <User className="h-8 w-8 mb-2 text-gray-400" />
                      <p>Không có người bán nào trong hệ thống</p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredSellers.map((seller) => (
                <TableRow key={seller._id}>
                  <TableCell className="font-medium">{seller._id.substring(0, 6)}...</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={seller.avatar}
                        alt={seller.name}
                        size="sm"
                        fallback={seller.name.substring(0, 2)}
                      />
                      <span>{seller.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>{seller.gigsCount || 0}</TableCell>
                  <TableCell>{formatJoinDate(seller.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={!seller.isLocked ? "success" : "danger"}
                      className="capitalize"
                    >
                      {!seller.isLocked ? "Hoạt động" : "Bị khóa"}
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
                          <span className="sr-only">Hành động</span>
                        </Button>
                      }
                      align="right"
                      sideOffset={5}
                      alignOffset={-5}
                      className="z-[100]"
                      avoidCollisions={true}
                      // Sử dụng portal để đảm bảo dropdown luôn hiển thị đúng vị trí
                      portal={true}
                      // Cấu hình các vị trí hiển thị ưu tiên theo thứ tự
                      placement={["top-end", "bottom-end", "right-start", "left-start"]}
                      // Đặt kích thước tối đa để tránh tràn màn hình
                      style={{ maxHeight: "300px" }}
                    >
                      <div className="overflow-hidden rounded-md shadow-md border border-gray-200 bg-white">
                        <DropdownItem onClick={() => handleViewProfile(seller)}>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Xem hồ sơ
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => handleToggleLock(seller)}>
                          <div className="flex items-center">
                            {seller.isLocked ? (
                              <>
                                <Unlock className="h-4 w-4 mr-2 text-green-600" />
                                <span className="text-green-600">Mở khóa tài khoản</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2 text-amber-600" />
                                <span className="text-amber-600">Khóa tài khoản</span>
                              </>
                            )}
                          </div>
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem className="text-red-600" onClick={() => handleDeleteAccount(seller)}>
                          <div className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa tài khoản
                          </div>
                        </DropdownItem>
                      </div>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {((pagination.currentPage - 1) * 10) + 1} - {Math.min(pagination.currentPage * 10, pagination.totalSellers)} trong {pagination.totalSellers} người bán
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Trước
            </Button>
            
            {/* Hiển thị phân trang */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // Logic để hiển thị 5 trang gần nhất với trang hiện tại
                let pageToShow: number;
                
                if (pagination.totalPages <= 5) {
                  // Nếu tổng số trang <= 5, hiển thị tất cả các trang
                  pageToShow = i + 1;
                } else if (pagination.currentPage <= 3) {
                  // Nếu đang ở 3 trang đầu tiên
                  pageToShow = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  // Nếu đang ở 3 trang cuối cùng
                  pageToShow = pagination.totalPages - 4 + i;
                } else {
                  // Nếu đang ở giữa
                  pageToShow = pagination.currentPage - 2 + i;
                }
                
                // Chỉ hiển thị nút nếu pageToShow hợp lệ
                if (pageToShow > 0 && pageToShow <= pagination.totalPages) {
                  return (
                    <Button
                      key={pageToShow}
                      variant={pagination.currentPage === pageToShow ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageToShow)}
                    >
                      {pageToShow}
                    </Button>
                  );
                }
                return null;
              })}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              icon={<ChevronRight className="h-4 w-4" />}
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManagement;
