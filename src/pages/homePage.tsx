import {
  categoryContentCards,
  popularCards,
  serviceCards,
  benefitItems,
} from "../lib/constant";

import { SignUpButton } from "@clerk/clerk-react";
import { useEffect } from "react";
import Slide from "../components/Slide";
import FeaturePage from "../components/HomePage/Feature";
import CategoryCard from "../components/HomePage/CategoryCard";
import PopularCard from "../components/HomePage/PopularCard";
import ProLanding from "../components/HomePage/ProLandding";
import ServiceCard from "../components/HomePage/ServiceCard";
import BenefitItem from "../components/HomePage/BenefitItem";

import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const fetchToken = async () => {
    try {
      const token = await getToken({ template: "TemplateClaim" });
      console.log("Token:", token);
      return token;
    } catch (error) {
      console.error("Lỗi khi lấy token:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!isLoaded) return; // Đợi cho đến khi Clerk đã tải xong

      if (isSignedIn) {
        const token = await fetchToken();
        if (token) {
          // Thêm một khoảng thời gian ngắn để đảm bảo token đã được lưu
          setTimeout(() => {
            navigate("/redirect-dashboard");
          }, 500);
        }
      }
    };

    checkAuthAndRedirect();
  }, [isSignedIn, isLoaded, navigate, getToken]);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  return (
    <div className="h-full w-screen">
      <FeaturePage />
      {/*main*/}
      <div className="max-w-[1450px] mx-auto">
        {/*list category*/}
        <div className="w-full max-w-7xl mx-auto sm:px-6 px-4 lg:px-8">
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 sm:gap-4 md:gap-5">
            {categoryContentCards.map((categoryCard, index) => (
              <CategoryCard
                key={index}
                icon={categoryCard.icon}
                title={categoryCard.title}
              />
            ))}
          </div>
        </div>

        {/* Hot Jobs Banner */}
        
        {/*list popular services*/}
        <div className="w-full max-w-7xl mx-auto sm:px-6 px-4 lg:px-8">
          <div className="mt-4 sm:mt-6 md:mt-10 relative">
            <div className="justify-between items-center mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 mb-1">
                  Dịch vụ phổ biến
                </h2>
                <p className="text-gray-500 text-sm sm:text-base hidden sm:block mb-5">
                  Khám phá những dịch vụ được săn đón nhất từ các freelancer
                  hàng đầu
                </p>
              </div>
              {/* Loại bỏ các lớp wrapper không cần thiết */}
              <Slide>
                {popularCards.map((popularCard, index) => (
                  <PopularCard
                    title={popularCard.title}
                    image={popularCard.Image}
                    bgColor={popularCard.backgroundColor}
                    key={index}
                  />
                ))}
              </Slide>
            </div>
          </div>
        </div>

        {/*ProLandding*/}
        <div className="w-full max-w-7xl mx-auto sm:px-6 px-4 lg:px-8">
          <ProLanding />
        </div>

        {/*What success in JobViet */}
        <div className="w-full max-w-7xl mx-auto sm:px-6 px-4 lg:px-8">
          <div className="flex flex-col mt-10 md:mt-16 lg:mt-20 gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#404145] leading-tight">
              Thành công trên JobViet trông như thế nào
            </h2>

            <span className="text-base sm:text-lg text-[#62646a] mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-3xl">
              Vontélle Eyewear tìm đến các freelancer trên Fiverr để biến tầm
              nhìn của họ thành hiện thực.
            </span>

            {/* Updated video container */}
            <div className="w-full overflow-hidden">
              <div className="relative aspect-video rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg w-full">
                <video
                  className="w-full h-full object-cover"
                  style={{ maxWidth: "100%" }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                >
                  <source src="/your-video-source.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <p className="text-sm text-[#62646a] mt-3 text-center italic"></p>
          </div>
        </div>

        {/*Trusted service */}
        <div className="w-full max-w-7xl mx-auto sm:px-6 px-4 lg:px-8">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#404145] mb-6 md:mb-10">
              Các dịch vụ đáng tin cậy của chúng tôi !!!
            </h2>

            {/* Container for service cards */}
            <div className="relative">
              {/* Gradient fade effect for scroll indication on mobile */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>

              {/*Scrollable container on mobile, grid on larger screens*/}
              <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-5">
                {serviceCards.map((service, index) => (
                  <ServiceCard
                    key={index}
                    image={service.Image}
                    title={service.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/*Make it all happen with freelancers*/}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#404145] mb-6 md:mb-10">
              Biến mọi thứ thành hiện thực với các freelancer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {benefitItems.map((item, index) => (
                <BenefitItem
                  key={index}
                  icon={item.icon}
                  alt={item.alt}
                  text={item.text}
                />
              ))}
            </div>

            {/*CTA Button*/}
            <div className="flex justify-center">
              <SignUpButton mode="modal">
                <button className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors text-base md:text-lg">
                  Join now
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>

        {/*fiver banner - Adjusted absolute elements */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div
            className="w-full bg-[#4a1a2a] rounded-lg sm:rounded-xl md:rounded-2xl py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-12 
        flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b4a] opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ff6b4a] opacity-10 rounded-full translate-y-1/3 -translate-x-1/3"></div>

            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-center mb-6 sm:mb-8 md:mb-10 max-w-4xl leading-tight">
              Freelance services at your{" "}
              <span className="text-[#ff6b4a] relative inline-block">
                fingertips
              </span>
            </h1>

            <SignUpButton mode="modal">
              <button className="bg-white text-[#4a1a2a] px-6 sm:px-8 py-2.5 sm:py-3 md:py-4 rounded-md sm:rounded-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105 text-sm sm:text-base md:text-lg shadow-lg">
                Join JobViet
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </div>
  );
}
