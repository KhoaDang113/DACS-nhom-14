import { useState } from "react";
import { sampleGigs, Gig } from "../data/jobs";
import GigCard from "../components/Card/Card";
import SlideCard from "../components/Card/SlideCard";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function dashBoard() {

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
        <div className="h-full w-screen">
          <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="py-3 sm:py-4 md:py-6 lg:py-8">
              {/* Video Message */}
              {videoMessage && (
                <div className="fixed top-2 right-2 sm:top-4 sm:right-4 bg-black/80 text-white p-3 sm:p-4 rounded-md shadow-lg z-50 max-w-[calc(100%-1rem)] sm:max-w-md text-sm sm:text-base">
                  {videoMessage}
                </div>
              )}

              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-black to-gray-800 text-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg shadow-md mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
                  Chào mừng đến với JopViet
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">
                  Chọn công việc của Freelancer và tạo ngay tác phẩm theo phong cách riêng biệt của bạn.
                </p>
              </div>

              {/* Featured Gigs Section */}
              <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">
                  Bài viết nổi bật
                </h2>
                <div className="overflow-hidden -mx-3 sm:-mx-4">
                  <SlideCard>
                    {filteredGigs.map((gig: Gig) => (
                      <div key={gig._id} className="px-2 sm:px-3">
                        <GigCard
                          gig={gig}
                          onFavorite={(id: string) => console.log(`Favorited gig: ${id}`)}
                          onPlayVideo={handlePlayVideo}
                        />
                      </div>
                    ))}
                  </SlideCard>
                </div>
              </div>

              {/* All Gigs Grid Section */}
              <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">
                  Tất cả bài viết 
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                  {filteredGigs.map((gig: Gig) => (
                    <GigCard
                      key={gig._id}
                      gig={gig}
                      onFavorite={(id: string) => console.log(`Favorited gig: ${id}`)}
                      onPlayVideo={handlePlayVideo}
                    />
                  ))}
                </div>
              </div>
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

export default dashBoard;