import React, { createContext, useContext, ReactNode } from "react";
import { useFavorites } from "../hooks/useFavorites";

interface FavoritesContextType {
  isGigFavorited: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<any>;
  refreshFavorites: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const favorites = useFavorites();

  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      "useFavoritesContext must be used within a FavoritesProvider"
    );
  }
  return context;
};
