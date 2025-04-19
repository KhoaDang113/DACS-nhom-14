import { useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Clock, CheckCircle, ShoppingBag, AlertCircle, Search, Filter } from "lucide-react";

// Mock data cho đơn hàng
const mockOrders = [
  {
    id: "ord-123456",
    title: "Thiết kế logo doanh nghiệp",
    seller: "designmaster",
    price: 1200000,
    date: "2025-04-10T10:30:00Z",
    status: "processing", // đang xử lý
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "ord-789012",
    title: "Thiết kế website landing page",
    seller: "webwizard",
    price: 3500000,
    date: "2025-03-28T14:20:00Z",
    status: "completed", // hoàn tất
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "ord-345678",
    title: "Dịch vụ SEO tối ưu từ khóa",
    seller: "seoguru",
    price: 2500000,
    date: "2025-04-05T09:15:00Z",
    status: "processing",
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "ord-901234",
    title: "Video giới thiệu sản phẩm",
    seller: "videocreator",
    price: 4200000,
    date: "2025-03-20T16:45:00Z",
    status: "completed",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "ord-567890",
    title: "Thiết kế bài đăng mạng xã hội",
    seller: "socialdesigner",
    price: 850000,
    date: "2025-04-08T11:10:00Z",
    status: "cancelled", // đã hủy
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
  }
];

export default function BuyerOrdersPage() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc đơn hàng theo trạng thái và từ khóa tìm kiếm
  const filteredOrders = mockOrders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Icon và màu sắc cho trạng thái
  const getStatusInfo = (status: string) => {
    switch(status) {
      case "processing":
        return { 
          icon: <Clock className="h-5 w-5" />, 
          text: "Đang xử lý", 
          color: "bg-yellow-100 text-yellow-800"
        };
      case "completed":
        return { 
          icon: <CheckCircle className="h-5 w-5" />, 
          text: "Hoàn tất", 
          color: "bg-green-100 text-green-800"
        };
      case "cancelled":
        return { 
          icon: <AlertCircle className="h-5 w-5" />, 
          text: "Đã hủy", 
          color: "bg-red-100 text-red-800"
        };
      default:
        return { 
          icon: <Clock className="h-5 w-5" />, 
          text: "Đang xử lý", 
          color: "bg-gray-100 text-gray-800"
        };
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn hàng</h1>
            
            {/* Tìm kiếm và bộ lọc */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-grow">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, ID hoặc người bán..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500 mr-2">Lọc:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "all"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setFilter("processing")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "processing"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Đang xử lý
                    </button>
                    <button
                      onClick={() => setFilter("completed")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "completed"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Hoàn tất
                    </button>
                    <button
                      onClick={() => setFilter("cancelled")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === "cancelled"
                          ? "bg-[#1dbf73] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Đã hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách đơn hàng */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng nào</h3>
                  <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const { icon, text, color } = getStatusInfo(order.status);
                  return (
                    <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{order.title}</h3>
                            <p className="text-sm text-gray-500">ID Đơn hàng: {order.id}</p>
                          </div>
                          <div className={`flex items-center px-3 py-1 rounded-full ${color}`}>
                            {icon}
                            <span className="ml-1 text-sm font-medium">{text}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 mb-4 md:mb-0">
                          <div className="aspect-video w-full rounded-md overflow-hidden">
                            <img 
                              src={order.image} 
                              alt={order.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="w-full md:w-3/4 md:pl-6 flex flex-col">
                          <div className="flex flex-col md:flex-row md:justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Người bán</p>
                              <p className="font-medium">{order.seller}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Ngày đặt hàng</p>
                              <p className="font-medium">{formatDate(order.date)}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Tổng giá</p>
                              <p className="text-lg font-bold text-[#1dbf73]">{formatPrice(order.price)}</p>
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                              Chi tiết
                            </button>
                            
                            {order.status === "processing" && (
                              <button className="px-4 py-2 bg-red-50 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-100">
                                Hủy đơn hàng
                              </button>
                            )}
                            
                            {order.status === "completed" && (
                              <button className="px-4 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100">
                                Đánh giá
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}