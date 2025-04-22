import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Gig, sampleGigs } from "../data/jobs";
import GigCard from "../components/Card/Card";

const BookmarkPage = () => {
  const [savedGigs, setSavedGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy danh sách bookmark của người dùng
    // Hiện tại sử dụng dữ liệu mẫu và giả lập việc lấy bookmark từ localStorage
    
    const fetchBookmarks = () => {
      setIsLoading(true);
      
      try {
        // Thêm một số dữ liệu mẫu vào localStorage nếu chưa có bookmarks
        const savedIds = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        console.log("Saved IDs in bookmarks:", savedIds);
        console.log("Available gig IDs:", sampleGigs.map(g => g._id));
        
        // Nếu chưa có bookmarks, tự động thêm một vài mẫu
        if (savedIds.length === 0) {
          // Thêm 3 gig đầu tiên từ dữ liệu mẫu làm bookmark mẫu
          const sampleBookmarkIds = sampleGigs.slice(0, 3).map(gig => gig._id);
          localStorage.setItem("bookmarks", JSON.stringify(sampleBookmarkIds));
          
          // Lấy dữ liệu mẫu đã lưu
          const bookmarkedGigs = sampleGigs.filter(gig => sampleBookmarkIds.includes(gig._id));
          
          setTimeout(() => {
            setSavedGigs(bookmarkedGigs);
            setIsLoading(false);
          }, 800);
        } else {
          // Nếu đã có bookmarks trong localStorage thì sử dụng bình thường
          const bookmarkedGigs = sampleGigs.filter(gig => savedIds.includes(gig._id));
          
          setTimeout(() => {
            setSavedGigs(bookmarkedGigs);
            setIsLoading(false);
          }, 800);
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const removeBookmark = (gigId: string) => {
    // Xóa khỏi state
    setSavedGigs(prev => prev.filter(gig => gig._id !== gigId));

    // Cập nhật localStorage
    const savedIds = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const updatedIds = savedIds.filter((id: string) => id !== gigId);
    localStorage.setItem("bookmarks", JSON.stringify(updatedIds));
  };

  const handlePlayVideo = (videoUrl: string) => {
    // Implement video playing logic if needed
    console.log("Play video:", videoUrl);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-8">
        <Heart size={24} className="text-red-500 fill-red-500" />
        <h1 className="text-2xl md:text-3xl font-bold">Dịch vụ đã lưu</h1>
      </div>

      {savedGigs.length > 0 && (
        <button 
          onClick={() => {
            localStorage.removeItem("bookmarks");
            setSavedGigs([]);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-md mb-6"
        >
          Xóa tất cả dịch vụ đã lưu
        </button>
      )}

      {savedGigs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart size={48} className="mx-auto text-gray-300" />
          <h2 className="text-xl font-semibold mt-4">Chưa có dịch vụ nào được lưu</h2>
          <p className="text-gray-500 mt-2 mb-6">
            Bạn chưa lưu bất kỳ dịch vụ nào. Hãy khám phá danh sách dịch vụ và lưu những dịch vụ bạn quan tâm.
          </p>
          <Link
            to="/jobs"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            Khám phá dịch vụ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {savedGigs.map((gig) => (
            <div key={gig._id} className="max-w-[240px] w-full mx-auto">
              <GigCard
                gig={gig}
                onFavorite={removeBookmark}
                onPlayVideo={handlePlayVideo}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkPage;