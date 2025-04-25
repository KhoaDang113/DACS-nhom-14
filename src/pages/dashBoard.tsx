import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sampleGigs, Gig } from "../data/jobs";
import GigCard from "../components/Card/Card";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function Dashboard() {
  const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState<string | null>(null);
  const [filteredGigs] = useState<Gig[]>(sampleGigs);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

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

  return (
    <>
      <SignedIn>
        <div className="min-h-screen w-full bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4 sm:py-6 md:py-10">

              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-6 md:mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  👋 Chào mừng đến với JopViet
                </h1>
                <p className="text-sm sm:text-base md:text-lg opacity-95">
                  Nơi kết nối giữa Freelancer và Khách hàng. Khám phá công việc, tạo sản phẩm mang dấu ấn cá nhân!
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => navigate("/seller-gigs")}
                    className="inline-block rounded-xl bg-white text-blue-700 font-semibold px-5 py-2 text-sm shadow-md hover:bg-blue-50 transition mr-4"
                  >
                    Danh sách dịch vụ của bạn
                  </button>
                  <button
                    onClick={() => navigate("/seller-dashboard")}
                    className="inline-block rounded-xl bg-white text-blue-700 font-semibold px-5 py-2 text-sm shadow-md hover:bg-blue-50 transition mr-4"
                  >
                    Dashboard tổng quan
                  </button>
                  <button
                    onClick={() => navigate("/order-management")}
                    className="inline-block rounded-xl bg-white text-blue-700 font-semibold px-5 py-2 text-sm shadow-md hover:bg-blue-50 transition"
                  >
                    Đơn hàng từ khách
                  </button>
                </div>
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

                <div className={`${viewMode === "grid" ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6" : "flex flex-col gap-4"}`}>
                  {filteredGigs.map((gig: Gig) => (
                    <GigCard
                      key={gig._id}
                      gig={gig}
                      onFavorite={(id: string) =>
                        console.log(`Favorited gig: ${id}`)
                      }
                      onPlayVideo={handlePlayVideo}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
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