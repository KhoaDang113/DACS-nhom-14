"use client";

import type React from "react";

import { type ReactNode, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Pause, Play } from "lucide-react";
import { trustedCompanies } from "../../lib/constant";
import axios from "axios";

interface FeatureProp {
  children?: ReactNode;
}

// Component hiệu ứng đánh máy
interface TypewriterProps {
  text: string;
  typingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  typingSpeed = 100,
  pauseDuration = 3000,
  className = "",
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setCurrentIndex(0);
        setDisplayText('');
      }, pauseDuration);

      return () => clearTimeout(pauseTimer);
    }

    if (currentIndex < text.length) {
      const typingTimer = setTimeout(() => {
        setDisplayText(prev => prev + text.charAt(currentIndex));
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(typingTimer);
    } else {
      setIsPaused(true);
    }
  }, [currentIndex, isPaused, text, typingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse"></span>
    </span>
  );
};

const FeaturePage: React.FC<FeatureProp> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Load từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Click ngoài component thì ẩn dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/popular-categories"
        );
        if (response.data && response.data.data) {
          const categories = response.data.data.map(
            (category: { categoryName: string }) => category.categoryName
          );
          setPopularCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching popular categories:", error);
      }
    };

    fetchPopularCategories();
  }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current?.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setShowDropdown(false);

    navigate(`/advanced-search?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleClear = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleClickSuggestion = (term: string) => {
    setSearchTerm(term);
    setShowDropdown(false);
    navigate(`/advanced-search?keyword=${encodeURIComponent(term)}`);
  };

  const categories = [
    "Phát triển website",
    "Thiết kế logo",
    "Chỉnh sửa video",
    "Thiết kế kiến trúc & nội thất",
  ];

  return (
    <div className="relative top-[-20px] w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://fiverr-res.cloudinary.com/video/upload/v1/video-attachments/generic_asset/asset/18ad23debdc5ce914d67939eceb5fc27-1738830703211/Desktop%20Header%20new%20version" type="video/mp4" />
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto md:mx-0 md:ml-[10%] lg:ml-[15%] md:transform md:-translate-x-[12%] md:-translate-y-[10%]">
          {/* Heading with Typewriter Effect - With Fixed Height Container */}
          <div className="h-32 sm:h-36 md:h-48 lg:h-52 xl:h-56 flex items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-white mb-10 md:mb-14 leading-tight">
              <Typewriter 
                text="Chào mừng bạn đã đến với JopViet." 
                typingSpeed={100} 
                pauseDuration={3000}
              />
            </h1>
          </div>

          {/* Search Bar */}
          <div id="feature-search-bar" ref={searchWrapperRef} className="relative sm:max-w-2xl md:max-w-full">
            <form onSubmit={handleSearch} className="flex items-center relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder="Bạn sẽ tìm kiếm dịch vụ nào cho hôm nay?"
                className="w-full py-3 sm:py-4 px-4 pr-12 rounded-md text-gray-800 text-base sm:text-lg bg-white"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bg-gray-900 text-white p-3 sm:p-4 rounded-r-md h-full flex items-center justify-center"
              >
                <Search size={16} className="sm:size-10" />
              </button>
            </form>

            {showDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border mt-1 rounded-md shadow-md z-[100]">
                {recentSearches.length > 0 && (
                  <div className="px-4 py-2 border-b">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500">
                        Tìm kiếm gần đây
                      </span>
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={handleClear}
                      >
                        Xóa
                      </button>
                    </div>
                    {recentSearches.map((term, index) => (
                      <div
                        key={index}
                        className="py-1 text-sm text-gray-700 hover:text-[#1dbf73] cursor-pointer"
                        onClick={() => handleClickSuggestion(term)}
                      >
                        {term}
                      </div>
                    ))}
                  </div>
                )}

                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    Dịch vụ nổi bật
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularCategories.length > 0 ? (
                      popularCategories.map((category, i) => (
                        <div
                          key={i}
                          className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 cursor-pointer hover:text-[#1dbf73]"
                          onClick={() => handleClickSuggestion(category)}
                        >
                          {category}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500">
                        Hiện không có dịch vụ nào phổ biến
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="#"
                className="flex items-center gap-2 bg-gray-800 bg-opacity-60 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full border border-gray-600 hover:bg-opacity-80 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
          {/* Trusted By Section */}
          <div className="relative mt-auto pb-16 sm:pb-20 bottom-[-100px] left-0 ">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ">
                <span className="text-xl sm:text-2xl text-white mb-2 sm:mb-0">
                  Được tin tưởng bởi:
                </span>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-8">
                  {trustedCompanies.map((company, index) => (
                    <img
                      key={index}
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Play/Pause Button */}
        <button
          onClick={toggleVideo}
          className="absolute bottom-4 sm:bottom-6 md:bottom-24 right-4 sm:right-6 md:right-10 z-20 bg-gray-800 bg-opacity-70 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-90 transition-colors"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
    </div>
  );
};

export default FeaturePage;