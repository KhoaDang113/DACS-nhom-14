"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, Play } from "lucide-react";
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
  videoUrl?: string;
  onFavorite: (id: string) => void;
  onPlayVideo: (videoUrl: string) => void;
}

const GigCard: React.FC<GigCardProps> = ({
  gig,
  videoUrl,
  onFavorite,
  onPlayVideo,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const formattedPrice = Number.parseFloat(gig.price.toString()).toFixed(2);
  const isCurrentMediaVideo = gig.media[currentSlide]?.type === "video";

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  useEffect(() => {
    if (!isCurrentMediaVideo && isHovered) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === gig.media.length - 1 ? 0 : prev + 1
        );
      }, 1000);
    }
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isCurrentMediaVideo, gig.media.length, isHovered]);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === gig.media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? gig.media.length - 1 : prev - 1));
  };

  const handlePlayVideo = () => {
    const currentMedia = gig.media[currentSlide];
    if (currentMedia.type === "video") {
      setShowVideoModal(true);
      onPlayVideo?.(currentMedia.url);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    onFavorite?.(gig._id);
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
                <img
                  src={
                    media.type === "image"
                      ? media.url
                      : media.thumbnailUrl || "/placeholder.svg"
                  }
                  alt={`${gig.title} - image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                {media.type === "video" && index === currentSlide && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <button
                      onClick={handlePlayVideo}
                      className="w h-6 rounded-full bg-white/80 flex items-center justify-center text-black hover:bg-white transition-colors"
                      aria-label="Play video"
                    >
                      <Play size={10} />
                    </button>
                  </div>
                )}
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
                <h3 className="text-xs sm:text-sm font-medium line-clamp-2 mb-2 hover:text-blue-600 transition-colors cursor-default">
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
              From US${formattedPrice}
            </div>

            {/* Inline video (optional) */}
            {videoUrl && (
              <video className="mt-4 rounded-md" controls src={videoUrl}>
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </Link>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              Đóng
            </button>
            {gig.media[currentSlide].url.includes("youtube.com") ||
            gig.media[currentSlide].url.includes("youtu.be") ? (
              <iframe
                src={getYouTubeEmbedUrl(gig.media[currentSlide].url)}
                className="w-full aspect-video rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={gig.media[currentSlide].url} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      )}
    </Tooltip.Provider>
  );
};

export default GigCard;
