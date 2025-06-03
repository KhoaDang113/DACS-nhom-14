import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import GigCard from "../Card/Card"; // Import GigCard component

// Khai báo interface đúng với GigCard để tránh type mismatch
interface MediaItem {
  url: string;
  type: "image" | "video";
  thumbnailUrl?: string;
}

interface User {
  _id: string;
  name: string;
  avatar: string;
}

interface Gig {
  _id: string;
  title: string;
  description: string;
  price: {
    toString: () => string;
  };
  media: MediaItem[];
  duration: number;
  keywords: string[];
  status: "pending" | "approved" | "rejected" | "hidden" | "deleted";
  freelancer?: User;
  star?: {
    $numberDecimal: string;
  };
  ratingsCount?: number;
}

interface ProfileGigsProps {
  gigs: Gig[];
}

const ProfileGigs = ({ gigs = [] }: ProfileGigsProps) => {
  const navigate = useNavigate(); // Thêm hook navigate

  const [filter, setFilter] = useState<
    "all" | "approved" | "pending" | "hidden"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9; // Số lượng gig hiển thị trên mỗi trang

  // Lọc các gig theo bộ lọc đã chọn
  const filteredGigs = useMemo(() => {
    return gigs.filter((gig) => {
      if (filter === "all") return true;
      return gig.status === filter;
    });
  }, [gigs, filter]);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredGigs.length / ITEMS_PER_PAGE);

  // Lấy gigs cho trang hiện tại
  const currentGigs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGigs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredGigs, currentPage]);

  // Xử lý khi người dùng thêm hoặc xóa khỏi yêu thích
  const handleFavoriteToggle = (gigId: string) => {
    console.log(`Toggle favorite for gig: ${gigId}`);
  };

  // Xử lý khi người dùng phát video
  const handlePlayVideo = (videoUrl: string) => {
    console.log(`Play video: ${videoUrl}`);
  };

  // Thêm handler khi người dùng click vào gig
  const handleGigClick = (gigId: string) => {
    // Sửa đường dẫn để điều hướng đến đúng trang chi tiết gig
    navigate(`/gig/${gigId}`);
  };

  // Xử lý chuyển đến trang trước
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Xử lý chuyển đến trang tiếp theo
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Xử lý chuyển đến một trang cụ thể
  const handleGoToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter Controls */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setFilter("all");
              setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-[#1dbf73] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => {
              setFilter("approved");
              setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "approved"
                ? "bg-[#1dbf73] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => {
              setFilter("pending");
              setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "pending"
                ? "bg-[#1dbf73] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Đang chờ duyệt
          </button>
          <button
            onClick={() => {
              setFilter("hidden");
              setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "hidden"
                ? "bg-[#1dbf73] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Đã ẩn
          </button>
        </div>
      </div>

      {/* Gigs Grid */}
      <div className="p-4">
        {filteredGigs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Chưa có dịch vụ nào</p>
            <Link
              to="/gigs/create"
              className="inline-block mt-4 px-6 py-2 bg-[#1dbf73] text-white rounded-md hover:bg-[#19a463] transition-colors"
            >
              Tạo dịch vụ mới
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentGigs.map((gig: Gig) => (
                <div key={gig._id} className="relative">
                  <GigCard
                    gig={{
                      _id: gig._id,
                      title: gig.title,
                      price: gig.price,
                      media: gig.media,
                      freelancer: gig.freelancer,
                      rating: parseFloat(gig.star?.$numberDecimal || "0"),
                      ratingsCount: gig.ratingsCount,
                    }}
                    onFavorite={handleFavoriteToggle}
                    onPlayVideo={handlePlayVideo}
                    onClick={() => handleGigClick(gig._id)}
                  />
                  {/* Status Badge overlay */}
                  <div className="absolute top-2 left-2 z-10">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        gig.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : gig.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {gig.status === "approved"
                        ? "Đã duyệt"
                        : gig.status === "pending"
                        ? "Đang chờ duyệt"
                        : "Đã ẩn"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center w-10 h-10 border ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed border-gray-200"
                      : "text-gray-700 hover:bg-gray-100 border-gray-300"
                  }`}
                  aria-label="Trang trước"
                >
                  <span className="text-lg">&lt;</span>
                </button>

                {/* Hiển thị các nút phân trang */}
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;

                  // Logic hiển thị giới hạn số lượng nút trang
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handleGoToPage(pageNumber)}
                        className={`flex items-center justify-center w-10 h-10 ${
                          currentPage === pageNumber
                            ? "bg-[#1dbf73] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-label={`Trang ${pageNumber}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }

                  // Hiển thị dấu ... nếu cần
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 &&
                      currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="flex items-center justify-center w-10 h-10 border border-gray-200"
                      >
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center w-10 h-10 border ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed border-gray-200"
                      : "text-gray-700 hover:bg-gray-100 border-gray-300"
                  }`}
                  aria-label="Trang sau"
                >
                  <span className="text-lg">&gt;</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileGigs;
