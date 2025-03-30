"use client";

import type React from "react";

import { type ReactNode, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Pause, Play } from "lucide-react";
import { trustedCompanies } from "../../lib/constant";

interface FeatureProp {
  children?: ReactNode;
}

const FeaturePage: React.FC<FeatureProp> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

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

  const categories = [
    "Phát triển website",
    "Thiết kế logo",
    "Chỉnh sửa video",
    "Thiết kế kiến trúc & nội thất",
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/test-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto md:mx-0 md:ml-[10%] lg:ml-[15%] md:transform md:-translate-x-[12%] md:-translate-y-[10%] ">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-white mb-6 md:mb-10 leading-tight">
            Các freelancer của chúng tôi
            <br />
            sẽ lo phần còn lại
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-full sm:max-w-2xl">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              className="w-full py-3 sm:py-4 px-4 pr-12 rounded-md text-gray-800 text-base sm:text-lg bg-white"
            />
            <button className="absolute right-0 top-0 bg-[#1dbf73] text-white p-3 sm:p-4 rounded-r-md h-full flex items-center justify-center">
              <Search size={20} className="sm:size-12" />
            </button>
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
