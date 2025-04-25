"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, Play, Pause } from "lucide-react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";

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

interface GigCardProps {
  gig: Gig;
  onFavorite: (id: string) => void;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onFavorite }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const formattedPrice = Number.parseFloat(gig.price.toString());
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

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? gig.media.length - 1 : prev - 1));
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    onFavorite?.(gig._id);
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
      <Link to={`/gig/${gig._id}`} className="block">
        <div
          className="w-full rounded-lg overflow-hidden shadow-md bg-gray-50 transition-transform hover:scale-[1.02]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Media Slider */}
          <div className="relative aspect-[4/3] w-full group">
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
            <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <GrFormPrevious
                className="bg-white border border-gray-300 h-10 w-10 rounded-full shadow-lg p-2 cursor-pointer z-20 ml-2 hover:bg-gray-50 transition-colors"
                onClick={prevSlide}
              />
              <GrFormNext
                className="bg-white border border-gray-300 h-10 w-10 rounded-full shadow-lg p-2 cursor-pointer z-20 mr-2 hover:bg-gray-50 transition-colors"
                onClick={nextSlide}
              />
            </div>

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
          <div className="p-3 sm:p-4">
            {/* Freelancer */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden relative">
                <img
                  src={gig.freelancer?.avatar || "/placeholder.svg"}
                  alt={gig.freelancer?.name || "Freelancer"}
                  className="object-cover w-full h-full"
                />
              </div>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <span className="font-medium text-xs sm:text-sm cursor-default">
                    {gig.freelancer?.name || "Freelancer"}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-black text-white px-2 py-1 rounded text-xs"
                    side="top"
                    sideOffset={4}
                  >
                    {gig.freelancer?.name}
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>

            {/* Title with Tooltip */}
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <h3 className="text-xs sm:text-sm font-medium line-clamp-2 min-h-[40px] mb-2 hover:text-blue-600 transition-colors cursor-default">
                  {gig.title}
                </h3>
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
            <div className="font-bold text-sm sm:text-lg text-blue-600">
              Giá:{formattedPrice}VND
            </div>
          </div>
        </div>
      </Link>
    </Tooltip.Provider>
  );
};

export default GigCard;
