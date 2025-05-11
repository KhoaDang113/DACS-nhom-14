import { useState, useEffect } from "react";
import axios from "axios";

export const useFavorites = () => {
  const [favoritedGigIds, setFavoritedGigIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/favorite/get-list",
        {
          withCredentials: true,
        }
      );

      if (response.data && !response.data.error) {
        const favoriteIds = new Set<string>();

        // Xử lý dữ liệu từ API
        if (Array.isArray(response.data.favorites)) {
          // Định nghĩa interface để tránh sử dụng any
          interface FavoriteItem {
            _id?: string;
            gigId?: { _id?: string } | string;
          }

          response.data.favorites.forEach((fav: FavoriteItem | null) => {
            if (!fav) return;

            // Trường hợp API trả về object gig đầy đủ
            if (fav._id) {
              favoriteIds.add(fav._id);
            }
            // Trường hợp API trả về object có gigId là object
            else if (
              fav.gigId &&
              typeof fav.gigId === "object" &&
              "gigId" in fav &&
              "_id" in fav.gigId &&
              fav.gigId._id
            ) {
              favoriteIds.add(fav.gigId._id);
            }
            // Trường hợp API trả về object có gigId là string
            else if (fav.gigId && typeof fav.gigId === "string") {
              favoriteIds.add(fav.gigId);
            }
          });
        }

        setFavoritedGigIds(favoriteIds);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setError("Không thể tải danh sách gig yêu thích");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (gigId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/favorite/${gigId}`,
        {},
        { withCredentials: true }
      );

      if (response.data && !response.data.error) {
        const newFavorites = new Set(favoritedGigIds);

        // Kiểm tra kết quả dựa trên cả hai thuộc tính có thể có
        const added =
          response.data.isFavorite === true || response.data.action === "added";

        const removed =
          response.data.isFavorite === false ||
          response.data.action === "removed";

        if (added) {
          newFavorites.add(gigId);
          setFavoritedGigIds(newFavorites);
          return { isFavorite: true };
        } else if (removed) {
          newFavorites.delete(gigId);
          setFavoritedGigIds(newFavorites);
          return { isFavorite: false };
        }

        // Mặc định trả về trạng thái hiện tại
        return { isFavorite: favoritedGigIds.has(gigId) };
      }

      return { isFavorite: favoritedGigIds.has(gigId) };
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Trong trường hợp lỗi, trả về trạng thái hiện tại
      return { isFavorite: favoritedGigIds.has(gigId) };
    }
  };

  const isGigFavorited = (gigId: string): boolean => {
    return favoritedGigIds.has(gigId);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    isGigFavorited,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
    isLoading,
    error,
  };
};
