import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Star, Clock, MessageSquare, CheckCircle, RefreshCw, FileText } from "lucide-react";
import { sampleGigs, Gig } from "../data/jobs";
import SellerReviews from "../components/Review/SellerReview";
import { formattedReviews } from "../data/reviews";

const GigDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [gig, setGig] = useState<Gig | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API ở đây
    // Tạm thời dùng dữ liệu mẫu
    const fetchedGig = sampleGigs.find(g => g._id === id);
    
    if (fetchedGig) {
      setGig(fetchedGig);
      // Đặt ảnh đầu tiên làm ảnh được chọn
      if (fetchedGig.media && fetchedGig.media.length > 0) {
        setSelectedImage(fetchedGig.media[0].url);
      }
    }
    
    setIsLoading(false);
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
        <p className="mb-8">Dịch vụ bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
        <Link 
          to="/dashboard" 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          Quay lại trang chính
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Column - Takes 2/3 on large screens */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {gig.title}
          </h1>

          {/* Seller Info - Top */}
          <div className="flex items-center mb-6 gap-3">
            {gig.freelancer && (
              <>
                <img 
                  src={gig.freelancer.avatar} 
                  alt={gig.freelancer.name}
                  className="w-10 h-10 rounded-full object-cover" 
                />
                <div>
                  <p className="font-medium">{gig.freelancer.name}</p>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium ml-1">
                      {gig.rating?.average || "5.0"}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({gig.rating?.count || "0"})
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Image Gallery */}
          <div className="mb-6">
            <div className="mb-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={selectedImage || (gig.media[0]?.url || "")} 
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
                    selectedImage === mediaItem.url ? "border-green-500" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(mediaItem.url)}
                >
                  <img 
                    src={mediaItem.type === "image" ? mediaItem.url : (mediaItem.thumbnailUrl || "")} 
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
              {gig.freelancer && (
                <>
                  <img 
                    src={gig.freelancer.avatar} 
                    alt={gig.freelancer.name}
                    className="w-16 h-16 rounded-full object-cover" 
                  />
                  <div>
                    <p className="font-medium text-lg">{gig.freelancer.name}</p>
                    <p className="text-gray-500">{gig.freelancer.level === 1 ? "Người bán mới" : `Cấp độ ${gig.freelancer.level}`}</p>
                    <div className="flex items-center mt-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-medium ml-1">
                        {gig.rating?.average || "5.0"}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({gig.rating?.count || "0"})
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <button className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
              Liên hệ với tôi
            </button>
          </div>

          {/* Reviews */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              Đánh giá 
              <span className="text-gray-500 font-normal ml-2">
                ({gig.rating?.count || "0"})
              </span>
            </h2>
            
            {/* Placeholder for reviews */}
            <div className="text-gray-500 italic text-center py-8">
              Chưa có đánh giá nào cho dịch vụ này.
            </div>
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
              <button className="px-4 py-3 font-medium border-b-2 border-green-500 text-green-500 flex-1 whitespace-nowrap">
                Cơ bản
              </button>
              
            </div>
            
            {/* Package Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Gói cơ bản</h3>
                <span className="font-bold text-xl">${gig.price.toString()}</span>
              </div>
              
              <p className="text-gray-700 mb-4 text-sm">
                {gig.description.substring(0, 100)}...
              </p>
              
              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm">{gig.duration} ngày giao hàng</span>
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
              
              {/* Compare Packages */}
              
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