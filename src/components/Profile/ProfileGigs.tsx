import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { GrFormNext, GrFormPrevious } from "react-icons/gr"
interface MediaItem {
  url: string
  type: "image" | "video"
  thumbnailUrl?: string // Thumbnail for video
}
interface Gig {
  _id: string; // Thay id bằng _id
  freelancerId: string;
  title: string;
  description: string;
  price: number;
  media: MediaItem[]; // Thay image bằng media array
  duration: number;
  keywords: string[];
  status: 'pending' | 'approved' | 'rejected' | 'hidden' | 'deleted';
}

interface ProfileGigsProps {
  gigs?: Gig[];
}

const ProfileGigs = ({ gigs = [] }: ProfileGigsProps) => {
  console.log('Received gigs:', gigs); // Thêm log để debug

  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'hidden'>('all');
  const [currentSlides, setCurrentSlides] = useState<{ [key: string]: number }>({});

  const filteredGigs = gigs.filter(gig => {
    if (filter === 'all') return true;
    return gig.status === filter;
  });

  const nextSlide = (gigId: string, mediaLength: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [gigId]: (prev[gigId] || 0) === mediaLength - 1 ? 0 : (prev[gigId] || 0) + 1,
    }));
  };

  const prevSlide = (gigId: string, mediaLength: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [gigId]: (prev[gigId] || 0) === 0 ? mediaLength - 1 : (prev[gigId] || 0) - 1,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter Controls */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#1dbf73] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-[#1dbf73] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-[#1dbf73] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đang chờ duyệt
          </button>
          <button
            onClick={() => setFilter('hidden')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'hidden'
                ? 'bg-[#1dbf73] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative group">
                  {gig.media.map((media, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === (currentSlides[gig._id] || 0) ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={media.type === "image" ? media.url : media.thumbnailUrl || "/placeholder.svg"}
                        alt={`${gig.title} - image ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />

                      {media.type === "video" && index === (currentSlides[gig._id] || 0) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <button
                            // onClick={handlePlayVideo}
                            className="w h-6 rounded-full bg-white/80 flex items-center justify-center text-black hover:bg-white transition-colors"
                            aria-label="Play video"
                          >
                            <Play size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Slider Controls */}
                  <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <GrFormPrevious
                      className="absolute
                      bg-white top-[50px] border border-gray-300 h-10 w-10 rounded-full shadow-lg p-2 cursor-pointer z-20 ml-2 hover:bg-gray-50 transition-colors"
                      onClick={() => prevSlide(gig._id, gig.media.length)}
                    />
                    <GrFormNext
                      className="absolute bg-white top-[50px] right-0 border border-gray-300 h-10 w-10 rounded-full shadow-lg p-2 cursor-pointer z-20 mr-2 hover:bg-gray-50 transition-colors"
                      onClick={() => nextSlide(gig._id, gig.media.length)}
                    />
                  </div>
                </div>

                <div className="p-4 mt-[200px]">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {gig.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {gig.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1dbf73] font-medium">
                      ${gig.price} • {gig.duration} ngày
                    </span>
                  </div>
                  {/* Status Badge */}
                  <div className="mt-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        gig.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : gig.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {gig.status === 'approved'
                        ? 'Đã duyệt'
                        : gig.status === 'pending'
                        ? 'Đang chờ duyệt'
                        : 'Đã ẩn'}
                    </span>
                  </div>
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