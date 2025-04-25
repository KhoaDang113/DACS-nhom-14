import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFavorites = () => {
  const [favoritedGigIds, setFavoritedGigIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/favorite/get-list', {
        withCredentials: true
      });
      
      if (response.data && !response.data.error) {
        const favoriteIds = new Set(
          response.data.favorites
            .map((fav: any) => fav.gigId?._id)
            .filter(Boolean)
        );
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
        
        if (response.data.isFavorite) {
          newFavorites.add(gigId);
        } else {
          newFavorites.delete(gigId);
        }
        
        setFavoritedGigIds(newFavorites);
      }
      return response.data;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
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
    error
  };
};