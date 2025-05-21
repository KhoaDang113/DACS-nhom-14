import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HotJobAd, formatCurrency } from "../lib/hotJobData";
import { ChevronLeft, ChevronRight, DollarSign, Star } from "lucide-react";


// Dữ liệu mẫu - Trong thực tế sẽ được lấy từ API
const mockHotJobs: HotJobAd[] = [
  {
    id: "ad1",
    jobId: "job1",
    job: {
      _id: "job1",
      title: "Thiết kế logo chuyên nghiệp",
      description: "Tôi sẽ thiết kế logo độc đáo và sáng tạo cho thương hiệu của bạn",
      price: 500000,
      freelancerId: "user1",
      freelancer: {
        name: "den gao",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
    },
    title: "Logo độc đáo chỉ từ 500k",
    description: "Thiết kế logo chuyên nghiệp với giá tốt nhất thị trường",
    bannerImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    packageId: "pkg1",
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: "ad2",
    jobId: "job2",
    job: {
      _id: "job2",
      title: "Thiết kế website responsive",
      description: "Tôi sẽ thiết kế website chuyên nghiệp, tương thích mọi thiết bị",
      price: 2500000,
      freelancerId: "user1",
      freelancer: {
        name: "Ngô Đăng Khoa",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    },
    title: "Website chuyên nghiệp cho doanh nghiệp",
    description: "Thiết kế website responsive với đầy đủ tính năng",
    bannerImage: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    packageId: "pkg3",
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: "ad3",
    jobId: "job3",
    job: {
      _id: "job3",
      title: "Thiết kế thời trang",
      description: "Tôi sẽ thiết kế trang phục thời trang đáp ứng nhu cầu của bạn",
      price: 800000,
      freelancerId: "user3",
      freelancer: {
        name: "Ngô Đăng Khoa",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      },
    },
    title: "Thiết kế thời trang độc đáo",
    description: "Thiết kế thời trang theo ý tưởng riêng của bạn",
    bannerImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    packageId: "pkg2",
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: "ad4",
    jobId: "job4",
    job: {
      _id: "job4",
      title: "Thiết kế giao diện website",
      description: "Tôi sẽ thiết kế UI/UX website hiện đại và chuyên nghiệp",
      price: 1800000,
      freelancerId: "user4",
      freelancer: {
        name: "Ngô Đăng Khoa",
        avatar: "https://randomuser.me/api/portraits/men/37.jpg",
      },
    },
    title: "Thiết kế giao diện website",
    description: "Thiết kế UI/UX chuyên nghiệp, thu hút người dùng",
    bannerImage: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    packageId: "pkg2",
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: "ad5",
    jobId: "job5",
    job: {
      _id: "job5",
      title: "Cắt HTML/CSS từ thiết kế",
      description: "Tôi sẽ cắt HTML/CSS từ các file thiết kế của bạn",
      price: 1200000,
      freelancerId: "user5",
      freelancer: {
        name: "Ngô Đăng Khoa",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      },
    },
    title: "Cắt HTML/CSS từ thiết kế",
    description: "Chuyển đổi file thiết kế sang HTML/CSS chính xác, tương thích mọi trình duyệt",
    bannerImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    packageId: "pkg1",
    status: 'active',
    createdAt: new Date(),
  },
];


const HotJobsBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hotJobs, setHotJobs] = useState<HotJobAd[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
 
  // Xác định số lượng thẻ cần hiển thị dựa trên kích thước màn hình
  const [slidesToShow, setSlidesToShow] = useState(3);
 
  // Lấy dữ liệu hot jobs
  useEffect(() => {
    // Trong thực tế sẽ gọi API ở đây
    // const fetchHotJobs = async () => {
    //   const response = await fetch('/api/hot-jobs');
    //   const data = await response.json();
    //   setHotJobs(data);
    // };
    // fetchHotJobs();
   
    // Sử dụng dữ liệu mẫu cho mục đích trình diễn
    setHotJobs(mockHotJobs);
  }, []);
 
  // Kiểm tra kích thước màn hình để điều chỉnh số lượng thẻ hiển thị
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };
   
    window.addEventListener('resize', handleResize);
    handleResize();
   
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  // Thiết lập autoplay
  useEffect(() => {
    let interval: number;
   
    if (autoplayEnabled && hotJobs.length > 0) {
      interval = window.setInterval(() => {
        goToNext();
      }, 5000); // Chuyển slide mỗi 5 giây
    }
   
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentIndex, hotJobs.length, autoplayEnabled]);
 
  // Xử lý sự kiện vuốt trên thiết bị di động
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
 
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
 
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
   
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
   
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
   
    setTouchStart(null);
    setTouchEnd(null);
  };
 
  const goToPrevious = () => {
    setAutoplayEnabled(false); // Tạm dừng autoplay khi người dùng tương tác
   
    // Cập nhật code để xử lý vòng lặp vô hạn
    if (currentIndex === 0) {
      // Nếu đang ở slide đầu tiên thì chuyển đến slide cuối cùng
      setCurrentIndex(Math.max(0, hotJobs.length - slidesToShow));
    } else {
      setCurrentIndex(currentIndex - 1);
    }
   
    // Kích hoạt lại autoplay sau 10 giây không tương tác
    setTimeout(() => setAutoplayEnabled(true), 10000);
  };
 
  const goToNext = () => {
    // Cập nhật code để xử lý vòng lặp vô hạn
    if (currentIndex >= hotJobs.length - slidesToShow) {
      // Nếu đang ở slide cuối cùng thì quay về slide đầu tiên
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
 
  if (hotJobs.length === 0) return null;
 
  return (
    <div className="mb-6 md:mb-10 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-blue-700 flex items-center">
          🔥 <span className="ml-2">Job Hot</span>
        </h2>
        <div className="flex items-center space-x-2">
          {/* Thêm nút điều hướng vào cạnh nút "Xem tất cả" */}
          <button
            onClick={goToPrevious}
            className="bg-white/90 hover:bg-white rounded-full p-1 shadow-sm"
          >
            <ChevronLeft className="h-5 w-5 text-blue-700" />
          </button>
          <button
            onClick={goToNext}
            className="bg-white/90 hover:bg-white rounded-full p-1 shadow-sm"
          >
            <ChevronRight className="h-5 w-5 text-blue-700" />
          </button>
         
        </div>
      </div>
     
      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)` }}>
          {hotJobs.map((hotJob) => (
            <div
              key={hotJob.id}
              className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
            >
              <Link
                to={`/gig/${hotJob.jobId}`}
                className="block h-full bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={hotJob.bannerImage}
                    alt={hotJob.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Hot Job
                    </span>
                  </div>
                </div>
               
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {hotJob.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2 h-10">
                    {hotJob.description}
                  </p>
                 
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={hotJob.job.freelancer.avatar || "https://via.placeholder.com/150"}
                          alt={hotJob.job.freelancer.name}
                        />
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-gray-600">{hotJob.job.freelancer.name}</p>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-xs text-gray-500">4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-semibold">{formatCurrency(hotJob.job.price)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default HotJobsBanner; 