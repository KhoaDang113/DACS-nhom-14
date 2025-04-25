import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Gig } from "../data/jobs";
import GigCard from "../components/Card/Card";
import axios from "axios";
import { useFavoritesContext } from '../context/FavoritesContext';

const BookmarkPage = () => {
  const [savedGigs, setSavedGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lấy toggleFavorite từ context
  const { toggleFavorite, refreshFavorites } = useFavoritesContext();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:5000/api/favorite/get-list', {
        withCredentials: true // Đảm bảo cookies được gửi kèm để xác thực người dùng
      });
      
      if (response.data && !response.data.error) {
        // API trả về danh sách favorites có chứa gigId được populate
        const bookmarkedGigs = response.data.favorites.map((fav: any) => fav.gigId);
        console.log("Bookmarked gigs:", bookmarkedGigs); // Thêm log để debug
        setSavedGigs(bookmarkedGigs.filter((gig: any) => gig !== null)); // Lọc ra các gig không null
      } else {
        setError(response.data?.message || "Không thể lấy dịch vụ đã lưu");
      }
    } catch (error: any) {
      console.error("Error loading bookmarks:", error);
      // Hiển thị thông tin lỗi chi tiết hơn để debug
      setError(`Đã xảy ra lỗi khi tải dịch vụ đã lưu: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAllBookmarks = async () => {
    setIsLoading(true);
    
    try {
      // Xóa từng bookmark một
      const promises = savedGigs.map(gig => 
        axios.post(`http://localhost:5000/api/favorite/${gig._id}`, {}, {
          withCredentials: true
        })
      );
      
      await Promise.all(promises);
      setSavedGigs([]);
    } catch (error) {
      console.error("Error removing all bookmarks:", error);
      setError("Không thể xóa tất cả dịch vụ đã lưu");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVideo = (videoUrl: string) => {
    console.log("Play video:", videoUrl);
  };

  const handleFavoriteToggle = async (gigId: string) => {
    try {
      const result = await toggleFavorite(gigId);
      // Nếu đã xóa khỏi favorites
      if (!result.isFavorite) {
        setSavedGigs(prev => prev.filter(gig => gig._id !== gigId));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchBookmarks}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
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
          onClick={removeAllBookmarks}
          className="px-4 py-2 bg-red-500 text-white rounded-md mb-6 hover:bg-red-600"
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
            to="/dash-board"
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
                onFavorite={handleFavoriteToggle}
                onPlayVideo={handlePlayVideo}
                isFavorited={true} // Đã được lưu trong danh sách bookmark
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkPage;