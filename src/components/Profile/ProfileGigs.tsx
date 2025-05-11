import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { parseMongoDecimal } from "../../lib/utils";
import GigCard from "../Card/Card"; // Import GigCard component

interface MediaItem {
  url: string;
  type: "image" | "video";
  thumbnailUrl?: string; // Thumbnail for video
}
interface Gig {
  _id: string; // Thay id bằng _id
  freelancerId: string;
  title: string;
  description: string;
  price: any; // Thay đổi type cho phù hợp với dữ liệu MongoDB
  media: MediaItem[]; // Thay image bằng media array
  duration: number;
  keywords: string[];
  status: "pending" | "approved" | "rejected" | "hidden" | "deleted";
  freelancer?: {
    _id: string;
    name: string;
    avatar: string;
    level?: number;
  };
}

interface ProfileGigsProps {
  gigs?: Gig[];
}

const ProfileGigs = ({ gigs = [] }: ProfileGigsProps) => {
  const navigate = useNavigate(); // Thêm hook navigate

  const [filter, setFilter] = useState<
    "all" | "approved" | "pending" | "hidden"
  >("all");

  // Hàm format giá tiền theo định dạng tiền tệ VN
  const formatPrice = (price: any): string => {
    // Xử lý giá trị MongoDB Decimal128
    const parsedPrice = parseMongoDecimal(price);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parsedPrice);
  };

  const filteredGigs = gigs.filter((gig) => {
    if (filter === "all") return true;
    return gig.status === filter;
  });

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter Controls */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-[#1dbf73] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "approved"
                ? "bg-[#1dbf73] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "pending"
                ? "bg-[#1dbf73] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Đang chờ duyệt
          </button>
          <button
            onClick={() => setFilter("hidden")}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGigs.map((gig) => (
              <div
                key={gig._id}
                className="relative cursor-pointer"
                onClick={() => handleGigClick(gig._id)}
              >
                <GigCard
                  gig={gig}
                  onFavorite={handleFavoriteToggle}
                  onPlayVideo={handlePlayVideo}
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
        )}
      </div>
    </div>
  );
};

export default ProfileGigs;
