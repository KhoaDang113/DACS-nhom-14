import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sampleGigs, Gig } from "../data/jobs";
import GigCard from "../components/Card/Card";
import SlideCard from "../components/Card/SlideCard";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function Dashboard() {
  const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState<string | null>(null);
  const [filteredGigs] = useState<Gig[]>(sampleGigs);

  const handlePlayVideo = (videoUrl: string) => {
    setVideoMessage(`Video would play: ${videoUrl}`);
    setTimeout(() => {
      setVideoMessage(null);
    }, 3000);
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen w-screen bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4 sm:py-6 md:py-10">

              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-6 md:mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  👋 Chào mừng đến với JopViet
                </h1>
                <p className="text-sm sm:text-base md:text-lg opacity-95">
                  Nơi kết nối giữa Freelancer và Khách hàng. Khám phá công việc, tạo sản phẩm mang dấu ấn cá nhân!
                </p>
                <button
                  onClick={() => navigate("/create-gig")}
                  className="mt-5 inline-block rounded-xl bg-white text-blue-700 font-semibold px-5 py-2 text-sm shadow-md hover:bg-blue-50 transition"
                >
                  + Đăng dịch vụ
                </button>
              </div>

              {/* Featured Gigs Section */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 md:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4">
                  🌟 Dịch vụ nổi bật
                </h2>
                <div className="overflow-hidden -mx-2 sm:-mx-3">
                  <SlideCard>
                    {filteredGigs.map((gig: Gig) => (
                      <div key={gig._id} className="px-2 sm:px-3">
                        <GigCard
                          gig={gig}
                          onFavorite={(id: string) =>
                            console.log(`Favorited gig: ${id}`)
                          }
                          onPlayVideo={handlePlayVideo}
                        />
                      </div>
                    ))}
                  </SlideCard>
                </div>
              </div>

              {/* All Gigs Grid Section */}
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4">
                  🗂️ Tất cả dịch vụ
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                  {filteredGigs.map((gig: Gig) => (
                    <GigCard
                      key={gig._id}
                      gig={gig}
                      onFavorite={(id: string) =>
                        console.log(`Favorited gig: ${id}`)
                      }
                      onPlayVideo={handlePlayVideo}
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
