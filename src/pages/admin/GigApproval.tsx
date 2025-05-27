"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/admin/Table";
import Button from "../../components/ui/admin/Button";
import Input from "../../components/ui/admin/Input";
import Badge from "../../components/ui/admin/Badge";
import Avatar from "../../components/ui/admin/Avatar";
import { Dropdown, DropdownItem } from "../../components/ui/admin/Dropdown";
import { Search, Filter, ArrowUpDown, Eye, Check, X, Loader, XCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define MediaItem to match backend data structure
interface MediaItem {
  url: string;
  type: "image" | "video";
  thumbnailUrl?: string;
}

// Define User to match backend data structure
interface User {
  _id: string;
  name: string;
  avatar: string;
}

// Define Gig to match backend data structure
interface Gig {
  _id: string;
  title: string;
  description?: string;
  price: number;
  media: MediaItem[];
  duration: number;
  views: number;
  ordersCompleted: number;
  category_id: string;
  createdAt: string;
  freelancer: string;
  user: User | null;
  isDeleted: boolean;
  name: string | null;
  avatar: string | null;
  email: string | null;
  status: "pending" | "approved" | "rejected" | "hidden";
  keywords?: string[];
}

// GigDetailModal component for showing gig details
interface GigDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: Gig | null;
}

const GigDetailModal: React.FC<GigDetailModalProps> = ({ isOpen, onClose, gig }) => {
  if (!isOpen || !gig) return null;

  // Function to handle approving gig directly from modal
  const handleApprove = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/gigs/${gig._id}/response-create`, {
        status: "approved"
      }, {
        withCredentials: true
      });
      
      if (!response.data.error) {
        toast.success("Gig được phê duyệt thành công");
        onClose();
      } else {
        toast.error(response.data.message || "Không thể phê duyệt dịch vụ");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể phê duyệt dịch vụ");
    }
  };

  // Function to handle rejecting gig directly from modal
  const handleReject = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/gigs/${gig._id}/response-create`, {
        status: "rejected"
      }, {
        withCredentials: true
      });
      
      if (!response.data.error) {
        toast.success("Từ chối dịch vụ thành công");
        onClose();
      } else {
        toast.error(response.data.message || "Không thể từ chối dịch vụ");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể từ chối dịch vụ");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Chi tiết dịch vụ</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Basic Info Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <Avatar
                  src={gig.avatar || "https://via.placeholder.com/150"}
                  alt={gig.name || "Unknown"}
                  size="lg"
                  fallback={(gig.name || "UN").substring(0, 2)}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{gig.name || "Người dùng ẩn danh"}</h3>
                <p className="text-gray-500">{gig.email || "Email không khả dụng"}</p>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{gig.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                ID: {gig._id}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {Number(gig.price).toLocaleString()} VND
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {gig.duration} ngày giao hàng
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Lượt xem</p>
                <p className="font-semibold">{gig.views}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Đơn hàng hoàn thành</p>
                <p className="font-semibold">{gig.ordersCompleted}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Ngày tạo</p>
                <p className="font-semibold">{new Date(gig.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
          
          {/* Media Gallery */}
          <div className="mb-8">
            <h4 className="font-semibold text-lg mb-3">Hình ảnh và video</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {gig.media.map((item, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-gray-200 aspect-video">
                  {item.type === 'video' ? (
                    <video 
                      src={item.url} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={item.url} 
                      alt={`Hình ảnh dịch vụ ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h4 className="font-semibold text-lg mb-3">Mô tả dịch vụ</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap text-gray-700 break-words" style={{ 
                lineHeight: '1.6', 
                maxWidth: '100%', 
                overflowWrap: 'break-word',
                wordBreak: 'break-word' 
              }}>
                {gig.description ? gig.description.split('.').join('.\n') : 'Không có mô tả'}
              </p>
            </div>
          </div>
          
          {/* Keywords */}
          {gig.keywords && gig.keywords.length > 0 && (
            <div className="mb-8">
              <h4 className="font-semibold text-lg mb-3">Từ khóa</h4>
              <div className="flex flex-wrap gap-2">
                {gig.keywords.map((keyword, index) => (
                  <Badge key={index} className="bg-gray-100 text-gray-800">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              size="md"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleReject}
            >
              <X className="h-4 w-4 mr-2" />
              Từ chối dịch vụ
            </Button>
            <Button
              variant="outline"
              size="md"
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={handleApprove}
            >
              <Check className="h-4 w-4 mr-2" />
              Phê duyệt dịch vụ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GigApproval: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingGigs, setPendingGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  
  // Function to fetch pending gigs
  const fetchPendingGigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/admin/gigs/pending", {
        withCredentials: true
      });
      
      if (!response.data.error && response.data.gigs) {
        setPendingGigs(response.data.gigs);
      } else {
        setError(response.data.message || "Failed to fetch pending gigs");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch pending gigs");
      // Chỉ hiển thị toast lỗi nếu không phải thông báo không có dịch vụ cần phê duyệt
      if (err.response?.data?.message !== "Không có dịch vụ nào cần phê duyệt") {
        toast.error(err.response?.data?.message || "Failed to fetch pending gigs");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle gig approval
  const handleApprove = async (gigId: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/gigs/${gigId}/response-create`, {
        status: "approved"
      }, {
        withCredentials: true
      });
      
      if (!response.data.error) {
        toast.success("Gig approved successfully");
        // Remove the approved gig from the list
        setPendingGigs(pendingGigs.filter(gig => gig._id !== gigId));
      } else {
        toast.error(response.data.message || "Failed to approve gig");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve gig");
    }
  };

  // Function to handle gig rejection
  const handleReject = async (gigId: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/gigs/${gigId}/response-create`, {
        status: "rejected"
      }, {
        withCredentials: true
      });
      
      if (!response.data.error) {
        toast.success("Gig rejected successfully");
        // Remove the rejected gig from the list
        setPendingGigs(pendingGigs.filter(gig => gig._id !== gigId));
      } else {
        toast.error(response.data.message || "Failed to reject gig");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject gig");
    }
  };

  // Function to handle viewing gig details
  const handleViewGig = (gigId: string) => {
    const gig = pendingGigs.find(g => g._id === gigId);
    if (gig) {
      setSelectedGig(gig);
      setIsModalOpen(true);
    } else {
      toast.error("Không tìm thấy thông tin dịch vụ");
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPendingGigs();
  }, []);

  // Filter gigs based on search term
  const filteredGigs = pendingGigs.filter(
    (gig) =>
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (gig.name && gig.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      gig._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    }
  };

  return (
    <div className="space-y-6 overflow-visible w-full overflow-x-hidden overflow-y-auto">
      {/* Modal for viewing gig details */}
      <GigDetailModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          // Refresh the list after closing modal in case an action was taken
          fetchPendingGigs();
        }} 
        gig={selectedGig} 
      />
      
      <div>
        <h1 className="text-2xl font-bold">Phê duyệt dịch vụ</h1>
        <p className="text-gray-500 mt-1">
          Xem xét và phê duyệt các dịch vụ được gửi bởi người bán.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm dịch vụ..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Filter className="h-4 w-4" />}
          >
            Lọc
          </Button>
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
            <DropdownItem>Mới nhất</DropdownItem>
            <DropdownItem>Cũ nhất</DropdownItem>
            <DropdownItem>Danh mục</DropdownItem>
            <DropdownItem>Tên người bán</DropdownItem>
          </Dropdown>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        error === "Không có dịch vụ nào cần phê duyệt" ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-8 rounded-md text-center">
            Không có dịch vụ nào cần phê duyệt
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )
      ) : filteredGigs.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-8 rounded-md text-center">
          Không có dịch vụ nào cần phê duyệt
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Người bán</TableHead>
                <TableHead>Giá (VND)</TableHead>
                <TableHead>Thời gian (ngày)</TableHead>
                <TableHead>Đã gửi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGigs.map((gig) => (
                <TableRow key={gig._id}>
                  <TableCell className="font-medium">{gig._id.substring(0, 8)}...</TableCell>
                  <TableCell>{gig.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={gig.avatar || "https://via.placeholder.com/150"}
                        alt={gig.name || "Unknown"}
                        size="sm"
                        fallback={(gig.name || "UN").substring(0, 2)}
                      />
                      <span>{gig.name || "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{Number(gig.price).toLocaleString()}</TableCell>
                  <TableCell>{gig.duration}</TableCell>
                  <TableCell>{formatRelativeTime(gig.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="warning"
                      className="bg-yellow-50 text-yellow-700"
                    >
                      Chờ xử lý
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => handleViewGig(gig._id)}
                      >
                        <span className="sr-only">Xem</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600"
                        icon={<Check className="h-4 w-4" />}
                        onClick={() => handleApprove(gig._id)}
                      >
                        <span className="sr-only">Phê duyệt</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        icon={<X className="h-4 w-4" />}
                        onClick={() => handleReject(gig._id)}
                      >
                        <span className="sr-only">Từ chối</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredGigs.length > 0 && (
        <div className="flex items-center justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Trước
          </Button>
          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
};

export default GigApproval;
