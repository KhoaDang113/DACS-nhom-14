import { useState, useEffect } from "react";
import GigCard from "../components/Card/Card";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Skeleton from "../components/Card/Sekeleton";
import axios from "axios";
import HotJobsBanner from "../components/Dashboard/HotJobsBanner";
import JobBannerCarousel from "../components/Dashboard/JobBannerCarousel";

// Định nghĩa kiểu dữ liệu cho Dashboard
interface DashboardUser {
  _id: string;
  name: string;
  avatar: string;
  level?: number;
}

interface MediaItem {
  url: string;
  type: "image" | "video";
  thumbnailUrl?: string;
}

interface Gig {
  _id: string;
  title: string;
  price: number | { $numberDecimal: string };
  media: MediaItem[];
  user: DashboardUser;
  star: { $numberDecimal: string };
  ratingsCount: number;
  createdAt?: string;
}

function Dashboard() {
  const [videoMessage, setVideoMessage] = useState<string | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  // Hàm gọi API để lấy danh sách dịch vụ
  const fetchGigs = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state khi bắt đầu gọi API

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
      setTimeout(() => setLoading(false), 800); // Thêm độ trễ để hiệu ứng loading mượt mà hơn
    }
  };

  // Xử lý cuộn trang để ẩn/hiện header
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
    } else {
      setIsHeaderVisible(true);
    }

    setLastScrollY(currentScrollY);
  };

  // Hàm tải lại trang và dữ liệu
  const handleRefresh = () => {
    window.location.reload();
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchGigs();

    // Thêm event listener cho hiệu ứng scroll
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theo dõi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth < 640) {
        setViewMode("grid");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lọc theo từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm) {
      const filtered = gigs.filter((gig) =>
        gig.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGigs(filtered);
    } else {
      // Nếu đang lọc theo danh mục
      filterByCategory(activeFilter);
    }
  }, [searchTerm, gigs]);

  // Lọc theo danh mục
  const filterByCategory = (category: string) => {
    setActiveFilter(category);

    if (category === "all") {
      setFilteredGigs(gigs);
    } else if (category === "popular") {
      const popular = [...gigs]
        .sort((a, b) => {
          const ratingA = a.star?.$numberDecimal
            ? parseFloat(a.star.$numberDecimal)
            : 0;
          const ratingB = b.star?.$numberDecimal
            ? parseFloat(b.star.$numberDecimal)
            : 0;
          return ratingB - ratingA;
        })
        .slice(0, 10);
      setFilteredGigs(popular);
    } else if (category === "new") {
      // Giả sử có trường createdAt
      const newGigs = [...gigs].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setFilteredGigs(newGigs);
    }
  };

  const handlePlayVideo = (videoUrl: string) => {
    setVideoMessage(`Video đang phát: ${videoUrl}`);
    setTimeout(() => {
      setVideoMessage(null);
    }, 3000);
  };

  const handleFavoriteToggle = async (gigId: string) => {
    try {
      await axios.get(`http://localhost:5000/api/favorite/${gigId}`, {
        withCredentials: true,
      });
      // Hiệu ứng trái tim khi yêu thích
      const heartEl = document.getElementById(`heart-${gigId}`);
      if (heartEl) {
        heartEl.classList.add("animate-heart");
        setTimeout(() => heartEl.classList.remove("animate-heart"), 1000);
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
    }
  };

  // Hàm render nội dung dựa trên trạng thái
  const renderContent = () => {
    if (loading) {
      return (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
              : "flex flex-col gap-4"
          }`}
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse h-full">
              <Skeleton />
            </div>
          ))}
        </div>
      );
    }

    if (filteredGigs.length > 0) {
      return (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 auto-rows-fr"
              : "flex flex-col gap-4"
          }`}
        >
          {filteredGigs.map((gig, index) => (
            <div
              key={gig._id}
              className="opacity-0 animate-fade-in h-full"
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: "forwards",
              }}
            >
              <GigCard
                gig={{
                  _id: gig._id,
                  title: gig.title,
                  price: gig.price,
                  media: gig.media,
                  freelancer: gig.user,
                  rating: parseFloat(gig.star.$numberDecimal),
                  ratingsCount: gig.ratingsCount,
                }}
                onFavorite={(id) => handleFavoriteToggle(id)}
                onPlayVideo={(url) => handlePlayVideo(url)}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      );
    }

    // Trường hợp không có kết quả
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 mb-4 opacity-30">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg mb-2">
          Không có dịch vụ nào được tìm thấy.
        </p>
        <p className="text-gray-400 text-sm">
          Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
        </p>
        <button
          onClick={() => {
            setSearchTerm("");
            setActiveFilter("all");
          }}
          className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
        >
          Xóa bộ lọc
        </button>
      </div>
    );
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100">
          {/* Header có thể trượt ra/vào khi cuộn */}
          <div
            className={`fixed top-0 left-0 right-0 bg-white z-40 shadow-md transition-transform duration-300 ease-in-out ${
              isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
              <h1 className="text-xl font-bold text-blue-700">JopViet</h1>

              {/* Thanh tìm kiếm */}
              <div className="relative w-full max-w-xs sm:max-w-md mx-2 md:mx-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Avatar hoặc các action khác */}
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                JV
              </div>
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="pt-16 pb-4 sm:py-6 md:py-10">
              {" "}
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-6 md:mb-10 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                  <div className="w-full h-full bg-white rounded-full transform scale-150 blur-xl"></div>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 relative z-10">
                  👋 Chào mừng đến với JopViet
                </h1>
                <p className="text-sm sm:text-base md:text-lg opacity-95 relative z-10 max-w-2xl whitespace-nowrap">
                  Nơi kết nối giữa Freelancer và Khách hàng. Khám phá công việc,
                  tạo sản phẩm mang dấu ấn cá nhân!
                </p>
              </div>
              {/* Jobs Banner Carousel */}
              <JobBannerCarousel />
              {/* Hot Jobs Banner */}
              <HotJobsBanner />
              {/* Filter buttons */}
              <div className="flex overflow-x-auto pb-2 mb-4 gap-2 scrollbar-hide">
                <button
                  onClick={() => filterByCategory("all")}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-sm font-medium w-32 text-center ${
                    activeFilter === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Tất cả
                </button>

                <button
                  onClick={() => filterByCategory("new")}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-sm font-medium w-32 text-center ${
                    activeFilter === "new"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Mới nhất
                </button>
              </div>
              {/* All Gigs Grid Section */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 flex items-center">
                    🗂️ <span className="relative">Tất cả dịch vụ</span>
                  </h2>

                  {/* Chỉ hiển thị nút chuyển đổi khi không phải màn hình di động */}
                  {!isMobile && (
                    <div className="flex gap-2 text-sm p-1 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                          viewMode === "grid"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-transparent text-gray-600"
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                          </svg>
                          Lưới
                        </span>
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                          viewMode === "list"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-transparent text-gray-600"
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                          Danh sách
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {error}
                      </div>
                    </div>
                  </div>
                )}

                {renderContent()}
              </div>
              {/* Video Message Alert */}
              {videoMessage && (
                <div className="fixed bottom-24 right-6 bg-blue-600 text-white py-2 px-4 rounded-xl shadow-lg z-50 animate-slide-in">
                  <div className="flex items-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {videoMessage}
                  </div>
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
