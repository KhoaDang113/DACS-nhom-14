import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios"; // Thêm import axios
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Heart, Star, Clock, MessageSquare, CheckCircle, FileText, MoreVertical } from "lucide-react";
import SellerReviews from "../components/Review/SellerReview";
import { formattedReviews } from "../data/reviews";
import CustomerReviews from "../components/Review/CustomerReviews"; // Import component CustomerReviews
import { sampleCustomerReviews } from "../lib/reviewData"; // Import dữ liệu mẫu cho đánh giá

// Định nghĩa loại MediaItem cho mảng media
interface MediaItem {
  url: string;
  type: string;
  thumbnailUrl?: string;
}

// Cập nhật interface Gig để phản ánh cấu trúc dữ liệu từ API
interface GigDetail {
  _id: string;
  freelancerId: string;
  category_id: string;
  views: number;
  status: string;
  ordersCompleted: number;
  title: string;
  description: string;
  price: number;
  media: MediaItem[];
  rating?: {
    average: number;
    count: number;
  };
  duration?: number; // Thêm các trường tùy chọn nếu cần
}

// Định nghĩa interface cho dữ liệu freelancer
interface Freelancer {
  _id: string;
  name: string;
  avatar?: string;
  level?: number;
  rating?: number;
  reviewCount?: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const GigDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [gig, setGig] = useState<GigDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        setIsLoading(true);
        
        const response = await axios.get(`http://localhost:5000/api/${id}/get-gig-detail`, {
          withCredentials: true
        });
        
        if (response.data && !response.data.error) {
          const gigData = response.data.gig;
          // Xử lý giá từ Decimal128
          if (gigData.price && typeof gigData.price === 'object' && gigData.price.$numberDecimal) {
            gigData.price = parseFloat(gigData.price.$numberDecimal);
          } else if (typeof gigData.price === 'string') {
            gigData.price = parseFloat(gigData.price);
          }
          setGig(gigData);
          
          if (response.data.gig.media && response.data.gig.media.length > 0) {
            setSelectedImage(response.data.gig.media[0].url);
          }
          
          // Luôn gọi API user nếu có freelancerId
          if (response.data.freelancerId) {
            try {
              const userResponse = await axios.get(`http://localhost:5000/api/user/${response.data.freelancerId}`, {
                withCredentials: true
              });
              
              if (userResponse.data && !userResponse.data.error) {
                const userData = userResponse.data.data || userResponse.data;
                
                setFreelancer({
                  _id: userData._id,
                  name: userData.name || "Freelancer", // Đặt giá trị mặc định
                  avatar: userData.avatar || "/default-avatar.png", // Đặt giá trị mặc định
                  level: userData.level || 1,
                  rating: userData.rating || 5.0,
                  reviewCount: userData.reviewCount || 0
                });
              }
            } catch (error) {
              console.error("Lỗi khi tải thông tin người bán:", error);
              // Đặt giá trị mặc định nếu API user thất bại
              setFreelancer({
                _id: response.data.freelancerId,
                name: "Không tìm thấy người bán",
                avatar: "/default-avatar.png",
                level: 1,
                rating: 5.0,
                reviewCount: 0
              });
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết gig:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchGigDetails();
    }
  }, [id]);

  useEffect(() => {
    if (gig) {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setIsFavorite(bookmarks.includes(gig._id));
    }
  }, [gig]);

  const toggleFavorite = () => {
    if (!gig) return;
    
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    let newBookmarks;
    
    if (isFavorite) {
      // Xóa khỏi bookmarks
      newBookmarks = bookmarks.filter((id: string) => id !== gig._id);
    } else {
      // Thêm vào bookmarks
      newBookmarks = [...bookmarks, gig._id];
    }
    
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    setIsFavorite(!isFavorite);
  };

  const handleReport = async () => {
    try {
      setReportError("");

      // Kiểm tra độ dài của description
      if (reportDescription.length > 255) {
        setReportError("Mô tả chi tiết không được vượt quá 255 ký tự");
        return;
      }

      // Lấy ID từ URL và làm sạch
      const gigId = id?.split('/').pop()?.trim();
      console.log("Gửi báo cáo với id:", gigId);
      
      const response = await axios.post(
        `http://localhost:5000/api/complaint/${gigId}/create`,
        {
          reason: reportReason,
          description: reportDescription,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Response:", response.data);

      if (response.data && !response.data.error) {
        setIsReportModalOpen(false);
        setReportReason("");
        setReportDescription("");
        toast.success("Báo cáo đã được gửi thành công!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Lỗi khi gửi báo cáo:", error);
      const errorMessage = apiError.response?.data?.message || "Có lỗi xảy ra khi báo cáo";
      setReportError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy dịch vụ</h1>
        <p className="mb-8">
          Dịch vụ bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
        </p>
        <Link
          to="/dash-board"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          Quay lại trang chính
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToastContainer />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Column - Takes 2/3 on large screens */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {gig.title}
            </h1>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Report Modal */}
          {isReportModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Báo cáo dịch vụ</h2>
                  <button
                    onClick={() => setIsReportModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {reportError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {reportError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Chọn lý do</option>
                    <option value="dịch vụ bị cấm">Dịch vụ bị cấm</option>
                    <option value="nội dung không phù hợp">
                      Nội dung không phù hợp
                    </option>
                    <option value="không nguyên bản">Không nguyên bản</option>
                    <option value="vi phạm quyền sở hữu trí tuệ">
                      Vi phạm quyền sở hữu trí tuệ
                    </option>
                    <option value="khác">Khác</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => {
                      // Giới hạn input không quá 255 ký tự
                      if (e.target.value.length <= 255) {
                        setReportDescription(e.target.value);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    maxLength={255}
                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải (tối đa 255 ký tự)..."
                  ></textarea>
                  <div className="text-sm text-gray-500 mt-1">
                    {reportDescription.length}/255 ký tự
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleReport}
                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                    disabled={!reportReason || !reportDescription}
                  >
                    Báo cáo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Seller Info - Top */}
          <div className="flex items-center mb-6 gap-3">
            {freelancer ? (
              <>
                <img
                  src={freelancer.avatar || "https://via.placeholder.com/40"}
                  alt={freelancer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{freelancer.name}</p>
                  <div className="flex items-center">
                    <Star
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-sm font-medium ml-1">
                      {freelancer.rating || "5.0"}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({freelancer.reviewCount || "0"})
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {/* Main Image Gallery */}
          <div className="mb-6">
            <div className="mb-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={selectedImage || gig.media[0]?.url || ""}
                alt={gig.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
              {gig.media.map((mediaItem, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                    selectedImage === mediaItem.url
                      ? "border-green-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(mediaItem.url)}
                >
                  <img
                    src={
                      mediaItem.type === "image"
                        ? mediaItem.url
                        : mediaItem.thumbnailUrl || ""
                    }
                    alt={`${gig.title} - ảnh ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* About This Gig */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Giới thiệu về dịch vụ</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {gig.description}
            </div>
          </div>

          {/* About The Seller */}
          <div className="bg-gray-50 p-6 rounded-lg mb-10">
            <h2 className="text-xl font-bold mb-4">Về người bán</h2>

            <div className="flex items-center gap-4 mb-6">
              {freelancer ? (
                <>
                  <img
                    src={freelancer.avatar || "https://via.placeholder.com/40"}
                    alt={freelancer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-lg">{freelancer.name}</p>
                    <p className="text-gray-500">
                      {freelancer.level === 1
                        ? "Người bán mới"
                        : `Cấp độ ${freelancer.level}`}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="font-medium ml-1">
                        {freelancer.rating || "5.0"}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({freelancer.reviewCount || "0"})
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4 w-full">
                  <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-full">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>

            <button className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
              Liên hệ với tôi
            </button>
          </div>

          {/* Reviews */}
          <div className="mb-10">
            {/* Sử dụng component CustomerReviews mới */}
            <CustomerReviews 
              reviews={sampleCustomerReviews.filter(review => review.gigId === "gig1")} 
              showGigTitle={false}
            />
          </div>

          {/* Phần hiển thị đánh giá seller */}
          <div className="mt-10">
            {/* Lọc đánh giá theo gigId hiện tại nếu cần */}
            <SellerReviews reviews={formattedReviews} />
          </div>
        </div>

        {/* Sidebar - Order Box */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md sticky top-24">
            {/* Package Options (Tabs) */}
            <div className="flex border-b overflow-auto scrollbar-hide">
              <div className="item-center px-4 py-3 font-medium border-b-2 border-green-500 text-green-500 flex-1">
                CƠ BẢN
              </div>
              
            </div>

            {/* Package Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Gói cơ bản</h3>
                <span className="font-bold text-xl">
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(gig.price)}
                </span>
              </div>

              <p className="text-gray-700 mb-4 text-sm">
                {gig.description.substring(0, 100)}...
              </p>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm">{gig.duration || 3} ngày giao hàng</span>
                </div>

                {/* More features can be added here */}
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-gray-500" />
                  <span className="text-sm">Hỗ trợ không giới hạn</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gray-500" />
                  <span className="text-sm">Bàn giao đầy đủ mã nguồn</span>
                </div>
              </div>

              {/* Order Button */}
              <Link
                to={`/payment?gig=${gig._id}&price=${gig.price}`}
                className="block bg-green-500 hover:bg-green-600 text-white text-center font-medium py-3 rounded-md transition-colors w-full"
              >
                Đặt dịch vụ ngay
              </Link>
            </div>

            {/* Contact Seller */}
            <div className="border-t p-6 space-y-3">
              <button 
                onClick={toggleFavorite} 
                className="text-gray-700 hover:text-gray-900 flex items-center justify-center gap-2 font-medium w-full"
              >
                <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                <span>{isFavorite ? "Đã lưu vào yêu thích" : "Lưu vào yêu thích"}</span>
              </button>

              <Link
                to={`/custom-order/${gig._id}`}
                className="flex items-center justify-center gap-2 text-green-500 hover:text-green-600 font-medium w-full"
              >
                <FileText size={18} />
                <span>Gửi yêu cầu tùy chỉnh</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetailPage;
