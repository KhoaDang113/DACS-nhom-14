import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../lib/hotJobData";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import axios from "axios";

// Định nghĩa interface cho Hot Job từ API
interface HotJob {
  _id: string;
  title: string;
  description: string;
  price: number;
  media: {
    url: string;
    type: string;
  }[];
  category: {
    _id: string;
    name: string;
  };
  freelancer: {
    _id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  isHot: boolean;
  createdAt: string;
}

const HotJobsBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hotJobs, setHotJobs] = useState<HotJob[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Xác định số lượng thẻ cần hiển thị dựa trên kích thước màn hình
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Lấy dữ liệu hot jobs từ API
  useEffect(() => {
    const fetchHotJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/list-job-hot"
        );

        if (response.data) {
          const { formattedJobBanners } = response.data.data;
          setHotJobs(formattedJobBanners);
        } else {
          setError("Không thể tải dữ liệu Job Hot");
        }
      } catch (err) {
        console.error("Lỗi khi tải Job Hot:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchHotJobs();
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

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
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

  // Hiển thị thông báo khi đang tải
  if (loading) {
    return (
      <div className="mb-6 md:mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700 flex items-center">
            🔥 <span className="ml-2">Job Hot</span>
          </h2>
        </div>
        <div className="flex space-x-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
            >
              <div className="h-72 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Hiển thị thông báo khi có lỗi
  if (error || hotJobs.length === 0) {
    return (
      <div className="mb-6 md:mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700 flex items-center">
            🔥 <span className="ml-2">Job Hot</span>
          </h2>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
          <p className="text-gray-500">
            {error || "Hiện không có Job Hot nào"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mb-6 md:mb-10 relative"
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
            aria-label="Slide trước"
          >
            <ChevronLeft className="h-5 w-5 text-blue-700" />
          </button>
          <button
            onClick={goToNext}
            className="bg-white/90 hover:bg-white rounded-full p-1 shadow-sm"
            aria-label="Slide tiếp theo"
          >
            <ChevronRight className="h-5 w-5 text-blue-700" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
          }}
        >
          {hotJobs.map((job) => (
            <div
              key={job._id}
              className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
            >
              <Link
                to={`/gig/${job._id}`}
                className="block h-full bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={
                      job.media && job.media.length > 0
                        ? job.media[0].url
                        : "/placeholder.svg"
                    }
                    alt={job.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Hot Job
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3
                    className="text-lg font-semibold text-gray-900 line-clamp-1"
                    title={job.title}
                  >
                    {job.title}
                  </h3>
                  <p
                    className="mt-1 text-sm text-gray-500 line-clamp-2 h-10"
                    title={job.description}
                  >
                    {job.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={job.freelancer.avatar}
                          alt={job.freelancer.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-gray-600">
                          {job.freelancer.name}
                        </p>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-xs text-gray-500">
                              {job.rating ? job.rating.toFixed(1) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <span>Giá:&nbsp;</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(job.price)}
                      </span>
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
