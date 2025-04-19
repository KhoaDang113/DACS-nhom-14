"use client";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProLanding() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-[#e8f7f1] sm:p-6 md:p-10 lg:p-16 mt-8 sm:mt-12 md:mt-16 lg:mt-20 rounded-xl sm:rounded-2xl md:rounded-3xl">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg sm:text-xl mb-8 sm:mb-10 md:mb-12 transition-transform hover:scale-105"
        >
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs sm:text-sm shadow-md">
            Jop
          </div>
          <span className="text-gray-900">JopViet</span>
        </Link>

        {/* Main content */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } transition-all duration-700`}
        >
          {/* Left side - Text content */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {/* Headline */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Giải pháp{" "}
                <span className="text-emerald-500 relative">
                  cao cấp
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-500/30 rounded-full hidden md:block"></span>
                </span>{" "}
                cho
                <br className="hidden sm:block" />
                doanh nghiệp thuê freelancer
              </h2>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <FeatureItem title="Chuyên gia tuyển dụng tận tâm" delay={100}>
                Quản lý tài khoản sẽ giúp bạn tìm kiếm nhân tài phù hợp và hỗ
                trợ dự án của bạn.
              </FeatureItem>

              <FeatureItem title="Đảm bảo hài lòng" delay={200}>
                Đặt hàng với sự tự tin, hoàn tiền nếu kết quả không đạt yêu cầu.
              </FeatureItem>

              <FeatureItem title="Công cụ quản lý nâng cao" delay={300}>
                Dễ dàng tích hợp freelancer vào nhóm và dự án của bạn.
              </FeatureItem>

              <FeatureItem title="Mô hình thanh toán linh hoạt" delay={400}>
                Thanh toán theo dự án hoặc theo giờ để hợp tác dài hạn dễ dàng
                hơn.
              </FeatureItem>
            </div>

            {/* CTA Button */}
            <div
              className={`${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } transition-all duration-700 delay-500`}
            >
              <button className="bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                Dùng thử ngay
              </button>
            </div>
          </div>

          {/* Right side - Image and chart */}
          <div
            className={`relative mt-8 lg:mt-0 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-300`}
          >
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl max-w-md mx-auto transform hover:scale-[1.02] transition-transform duration-300">
              {/* Project Status */}
              <div className="absolute top-4 right-4 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md flex items-center space-x-2 z-10">
                <div className="relative w-6 sm:w-8 h-6 sm:h-8">
                  <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-gray-200"></div>
                  <div
                    className="absolute inset-0 rounded-full border-3 sm:border-4 border-emerald-500 border-t-transparent border-r-transparent border-b-transparent"
                    style={{ transform: "rotate(331deg)" }}
                  ></div>
                </div>
                <div className="text-[#404145]">
                  <p className="text-[10px] sm:text-xs font-bold">
                    Trạng thái dự án
                  </p>
                  <p className="text-[10px] sm:text-xs">92% | 4 trên 5 bước</p>
                </div>
              </div>

              {/* Price tag */}
              <div className="absolute top-12 sm:top-16 right-12 sm:right-16 bg-white text-[#404145] px-2 sm:px-3 py-1 rounded-full shadow-md z-10 text-sm sm:text-base">
                <p className="font-bold">$8,900</p>
              </div>

              {/* Main image */}
              <div className="mt-8 rounded-lg overflow-hidden shadow-sm">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-g3D0vlqZkLo8eQYJ516Vh8W1jEwLJM.png"
                  alt="Freelancers đang làm việc"
                  width={500}
                  height={300}
                  className="w-full h-auto"
                />
              </div>

              {/* Chart */}
              <div className="mt-4 px-2 sm:px-4">
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="h-10 sm:h-12 relative w-full">
                    <svg viewBox="0 0 200 50" className="w-full h-full">
                      <path
                        d="M0,25 Q20,40 40,20 T80,25 T120,10 T160,30 T200,15"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1">
                  <span>Th1</span>
                  <span>Th2</span>
                  <span>Th3</span>
                  <span>Th4</span>
                  <span>Th5</span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-emerald-500/20 rounded-full hidden md:block"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-500/10 rounded-full hidden md:block"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature item component with animation
function FeatureItem({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`space-y-2 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } transition-all duration-500`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start">
        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
        <h3 className="font-bold text-base sm:text-lg text-gray-900">
          {title}
        </h3>
      </div>
      <p className="text-sm sm:text-base text-gray-700 ml-7">{children}</p>
    </div>
  );
}
