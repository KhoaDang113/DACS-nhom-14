"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface JobBanner {
  _id: string;
  title: string;
  description: string;
  image: {
    type: string;
    url: string;
  };
  cta: string;
  ctaLink: string;
  createdAt: string;
  updatedAt: string;
}

export default function JobBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState<JobBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/list-banner");
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu banner");
        }
        const data = await response.json();
        if (data.status === "success" && data.data.jobBanners) {
          setSlides(data.data.jobBanners);
        } else {
          throw new Error("Định dạng dữ liệu không hợp lệ");
        }
      } catch (err) {
        setError((err as Error).message);
        console.error("Lỗi khi tải banner:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Restart autoplay after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto play slides
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying && slides.length > 0) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, nextSlide, slides.length]);

  // Pause autoplay when user hovers over carousel
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full pb-4">
        <div className="max-w-10xl mx-auto relative rounded-xl overflow-hidden shadow-md h-[300px] md:h-[400px] bg-gray-200 flex items-center justify-center">
          <p className="text-gray-600">Đang tải banner...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || slides.length === 0) {
    return (
      <div className="w-full pb-4">
        <div className="max-w-10xl mx-auto relative rounded-xl overflow-hidden shadow-md h-[300px] md:h-[400px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">
            {error || "Không có banner nào để hiển thị"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-4">
      <div className="max-w-10xl mx-auto relative rounded-xl overflow-hidden shadow-md h-[300px] md:h-[400px]">
        {/* Slides */}
        <div className="h-full">
          {slides.map((slide, index) => (
            <div
              key={slide._id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image.url || "/placeholder.svg"}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10" />
              </div>

              {/* Content */}
              <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-16">
                <div
                  className="max-w-xl"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
                    {slide.title}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base mb-6">
                    {slide.description}
                  </p>
                  <a
                    href={slide.ctaLink}
                    className="inline-flex items-center px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
                  >
                    {slide.cta}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Indicators */}
        {/* {slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentSlide === index
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
}
