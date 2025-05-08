import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gig } from "../data/jobs"; // Chỉ import type Gig, không import sampleGigs
import GigCard from "../components/Card/Card";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Skeleton from "../components/Card/Sekeleton";
import axios from "axios"; // Import axios để gọi API

function Dashboard() {
  const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState<string | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]); // Lưu trữ dữ liệu từ API
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hàm gọi API để lấy danh sách dịch vụ
  const fetchGigs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/gigs", {
        withCredentials: true,
      });
      
      if (response.data && !response.data.error) {
        
        setGigs(response.data.gigs || []);
        setFilteredGigs(response.data.gigs || []);
      } else {
        setError("Không thể tải dữ liệu dịch vụ.");
      }
    } catch (err) {
      console.error("Lỗi khi tải dịch vụ:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu từ server.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchGigs();
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth < 640) {
        setViewMode("grid");
      }
    };

    window.addEventListener('resize', handleResize);
    
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePlayVideo = (videoUrl: string) => {
    setVideoMessage(`Video would play: ${videoUrl}`);
    setTimeout(() => {
      setVideoMessage(null);
    }, 3000);
  };

  const handleFavoriteToggle = async (gigId: string) => {
    try {
      await axios.get(`http://localhost:5000/api/favorite/${gigId}`, {
        withCredentials: true
      });
      // Không cần cập nhật UI ngay lập tức vì FavoritesContext sẽ xử lý
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
    }
  };
  
  return (
    <>
      <SignedIn>
        <div className="min-h-screen w-full bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4 sm:py-6 md:py-10">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-6 md:mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  👋 Chào mừng đến với JopViet
                </h1>
                <p className="text-sm sm:text-base md:text-lg opacity-95">
                  Nơi kết nối giữa Freelancer và Khách hàng. Khám phá công việc,
                  tạo sản phẩm mang dấu ấn cá nhân!
                </p>
              </div>

              {/* All Gigs Grid Section */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-blue-700">
                    🗂️ Tất cả dịch vụ
                  </h2>
                  
                  {/* Chỉ hiển thị nút chuyển đổi khi không phải màn hình di động */}
                  {!isMobile && (
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`px-3 py-1 rounded-lg border ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600"}`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-1 rounded-lg border ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600"}`}
                      >
                        List
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className={`${viewMode === "grid" ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6" : "flex flex-col gap-4"}`}>
                    {[...Array(10)].map((_, i) => (
                      <Skeleton key={i} />
                    ))}
                  </div>
                ) : filteredGigs.length > 0 ? (
                  <div className={`${viewMode === "grid" ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6" : "flex flex-col gap-4"}`}>
                    {filteredGigs.map((gig: Gig) => (
                      <GigCard
                      key={gig._id}
                      gig={{
                        _id: gig._id,
                        title: gig.title,
                        price: gig.price,
                        media: gig.media,
                        freelancer: gig.user,
                        rating: gig.rating,
                      }}
                      onFavorite={(id) => console.log(`Favorited gig: ${id}`)}
                      onPlayVideo={(url) => console.log(`Playing video: ${url}`)}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">Không có dịch vụ nào được tìm thấy.</p>
                  </div>
                )}
              </div>

              {/* Video Message Alert */}
              {videoMessage && (
                <div className="fixed bottom-6 right-6 bg-blue-600 text-white py-2 px-4 rounded-xl shadow-lg z-50 animate-bounce">
                  {videoMessage}
                </div>
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

export default Dashboard;