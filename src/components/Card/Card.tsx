"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, Play, Pause } from "lucide-react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useFavoritesContext } from "../../contexts/FavoritesContext";

interface User {
  _id: string;
  name: string;
  avatar: string;
  level: number;
}

interface MediaItem {
  url: string;
  type: "image" | "video";
  thumbnailUrl?: string;
}

interface Gig {
  _id: string;
  title: string;
  price: {
    toString: () => string;
  };
  media: MediaItem[];
  freelancer?: User;
  rating?: {
    average: number;
    count: number;
  };
}

// Cập nhật interface GigCardProps để bổ sung prop isFavorited và onClick
interface GigCardProps {
  gig: Gig;
  onFavorite?: (id: string) => void;
  onPlayVideo?: (videoUrl: string) => void;
  isFavorited?: boolean;
  viewMode?: "grid" | "list";
  onClick?: () => void;
}

// Hàm format giá trong Card.tsx
type Decimal128Like = { $numberDecimal: string };

// Hàm để lấy giá trị số từ dữ liệu giá
const extractPrice = (price: any): number | null => {
  // Trường hợp price là số
  if (typeof price === 'number') {
    return price;
  }
  
  // Trường hợp price là object có numberDecimal
  if (typeof price === 'object' && price !== null) {
    if ('$numberDecimal' in price) {
      return parseFloat((price as Decimal128Like).$numberDecimal);
    }
    
    // Trường hợp price có phương thức toString
    if (price.toString && typeof price.toString === 'function') {
      const strValue = price.toString();
      if (!isNaN(parseFloat(strValue))) {
        return parseFloat(strValue);
      }
    }
    
    // Kiểm tra các trường giá phổ biến
    if ('price' in price && typeof price.price === 'number') {
      return price.price;
    }
  }
  
  // Trường hợp price là string
  if (typeof price === 'string' && !isNaN(parseFloat(price))) {
    return parseFloat(price);
  }
  
  return null;
};

const formatPrice = (price: number | string | Decimal128Like | null | undefined): string => {
  // Kiểm tra nếu price là undefined hoặc null
  if (price === undefined || price === null) {
    return "Liên hệ";
  }

  // Thử chuyển đổi giá thành số
  const numericPrice = extractPrice(price);
  
  if (numericPrice !== null && !isNaN(numericPrice)) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  }

  // Mặc định nếu không xác định được giá
  return "Liên hệ";
};

const GigCard: React.FC<GigCardProps> = ({
  gig,
  onFavorite,
  viewMode,
  onClick,
}) => {
  // Lấy trạng thái từ context
  const { isGigFavorited, toggleFavorite: toggleFavoriteContext } =
    useFavoritesContext();

  // Sử dụng context là nguồn duy nhất cho trạng thái yêu thích
  const [isFavorite, setIsFavorite] = useState(isGigFavorited(gig._id));

  // Cập nhật state khi context thay đổi
  useEffect(() => {
    setIsFavorite(isGigFavorited(gig._id));
  }, [isGigFavorited, gig._id]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Xử lý giá cho gig
  const priceValue = extractPrice(gig.price);

  const isCurrentMediaVideo = gig.media[currentSlide]?.type === "video";

  useEffect(() => {
    if (!isCurrentMediaVideo && isHovered) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === gig.media.length - 1 ? 0 : prev + 1
        );
      }, 2000);
    }
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isCurrentMediaVideo, gig.media.length, isHovered]);

  useEffect(() => {
    if (isCurrentMediaVideo && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);

      const handleVideoEnd = () => {
        setCurrentSlide((prev) =>
          prev === gig.media.length - 1 ? 0 : prev + 1
        );
        setIsPlaying(false);
      };

      videoRef.current.addEventListener("ended", handleVideoEnd);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("ended", handleVideoEnd);
        }
      };
    }
  }, [currentSlide, isCurrentMediaVideo, gig.media.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === gig.media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? gig.media.length - 1 : prev - 1));
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await toggleFavoriteContext(gig._id);

      // Cập nhật state local
      setIsFavorite(result.isFavorite);

      // Gọi callback từ parent nếu có
      if (onFavorite) {
        onFavorite(gig._id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Tooltip.Provider>
      <div
        className={`w-full rounded-lg overflow-hidden shadow-md bg-gray-50 transition-transform hover:scale-[1.02] ${
          viewMode === "list" ? "flex gap-6 items-start py-4" : "h-full flex flex-col"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Media Slider */}
        <div
          className={`relative ${
            viewMode === "list"
              ? "w-60 h-40 flex-shrink-0 rounded-lg overflow-hidden ml-4"
              : "aspect-[4/3]"
          } group`}
        >
          {gig.media.map((media, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt={`${gig.title} - image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              ) : media.type === "video" ? (
                <div className="relative w-full h-full">
                  {index === currentSlide ? (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        loop={false}
                      >
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <button
                        onClick={togglePlayPause}
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition-all duration-300 z-30 ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                    </>
                  ) : (
                    <img
                      src={media.thumbnailUrl || "/placeholder.svg"}
                      alt={`${gig.title} - video thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              ) : null}
            </div>
          ))}

          {/* Controls */}
          {gig.media.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="bg-white border border-gray-300 h-10 w-10 rounded-full shadow-lg p-2 cursor-pointer z-20 ml-2 hover:bg-gray-50 transition-colors"
                onClick={prevSlide}
              >
                <GrFormPrevious className="w-full h-full" />
              </button>
              <button
                className="bg-white border border-gray-300 h-10 w-10 rounded-full shadow-lg p-2 cursor-pointer z-20 mr-2 hover:bg-gray-50 transition-colors"
                onClick={nextSlide}
              >
                <GrFormNext className="w-full h-full" />
              </button>
            </div>
          )}
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              size={20}
              className={`transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
            />
          </button>
        </div>

        {/* Info */}
        <div className={`p-3 sm:p-4 ${viewMode === "list" ? "flex-1" : "flex-1 flex flex-col"}`}>
          {/* Freelancer */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div
              className={`${
                viewMode === "list" ? "w-8 h-8" : "w-6 h-6 sm:w-8 sm:h-8"
              } rounded-full overflow-hidden relative`}
            >
              <img
                src={gig.freelancer?.avatar || "/placeholder-avatar.png"}
                alt={gig.freelancer?.name || "Freelancer"}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-avatar.png";
                }}
              />
            </div>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span
                  className={`font-medium ${
                    viewMode === "list" ? "text-sm" : "text-xs sm:text-sm"
                  } cursor-default`}
                >
                  {gig.freelancer?.name || "Freelancer"}
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-black text-white px-2 py-1 rounded text-xs"
                  side="top"
                  sideOffset={4}
                >
                  {gig.freelancer?.name || "Freelancer"}
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          {/* Title with Tooltip */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link to={`/gig/${gig._id}`} className="flex-1">
                <h3
                  className={`font-medium line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer ${
                    viewMode === "list" 
                      ? "text-lg font-semibold" 
                      : "text-sm sm:text-base font-semibold h-[40px] sm:h-[48px] mb-2"
                  }`}
                >
                  {gig.title}
                </h3>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-black text-white px-2 py-1 rounded text-xs"
                side="top"
                sideOffset={4}
              >
                {gig.title}
                <Tooltip.Arrow className="fill-black" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          {/* Price */}
          <div
            className={`font-medium text-blue-600 mt-auto ${
              viewMode === "list" ? "text-base" : "text-xs sm:text-sm"
            }`}
          >
            Giá: {formatPrice(priceValue)}
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default GigCard;
