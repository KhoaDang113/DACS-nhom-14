import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Sliders } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho kết quả tìm kiếm
interface Gig {
  _id: string;
  title: string;
  description: string;
  price: { toString: () => string };
  media: { url: string; type: string; thumbnailUrl?: string }[];
  freelancer?: {
    name: string;
    avatar?: string;
  };
  rating?: {
    average: number;
    count: number;
  };
}

export default function AdvancedSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: ""
  });

  // Trích xuất từ khóa tìm kiếm từ URL
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) return;
      
      setLoading(true);
      setError("");
      
      try {
        // Tạo params cho request
        const params = new URLSearchParams();
        params.append("keyword", keyword);
        
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        
        const response = await axios.get(`http://localhost:5000/api/search?${params.toString()}`);
        
        if (response.data && response.data.gigs) {
          setSearchResults(response.data.gigs);
        } else {
          setSearchResults([]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [keyword, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.currentTarget as HTMLFormElement).querySelector('input[name="searchQuery"]') as HTMLInputElement;
    if (input.value.trim()) {
      navigate(`/advanced-search?keyword=${encodeURIComponent(input.value)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Kết quả tìm kiếm cho: {keyword}</h1>
        
        {/* Thanh tìm kiếm */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden max-w-xl">
            <input
              type="text"
              name="searchQuery"
              defaultValue={keyword}
              placeholder="Tìm kiếm dịch vụ..."
              className="w-full px-4 py-3 outline-none"
            />
            <button type="submit" className="bg-[#1dbf73] text-white px-6 py-3 hover:bg-[#19a463] transition-colors">
              <Search size={20} />
            </button>
          </div>
        </form>
        
        {/* Phần bộ lọc */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sliders size={18} />
            <h2 className="font-semibold">Bộ lọc tìm kiếm</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Tất cả danh mục</option>
                <option value="design">Thiết kế</option>
                <option value="programming">Lập trình</option>
                <option value="writing">Viết lách</option>
                <option value="marketing">Marketing</option>
                <option value="video">Video</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Giá tối thiểu</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="VNĐ"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Giá tối đa</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="VNĐ"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Kết quả tìm kiếm */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1dbf73]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Không tìm thấy kết quả nào phù hợp</p>
          <p className="text-sm text-gray-500 mt-2">Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((gig) => (
            <div key={gig._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={gig.media[0]?.url || "https://via.placeholder.com/300x200?text=No+Image"} 
                  alt={gig.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                {gig.freelancer && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      {gig.freelancer.avatar && (
                        <img src={gig.freelancer.avatar} alt={gig.freelancer.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <p className="text-sm font-medium">{gig.freelancer.name}</p>
                  </div>
                )}
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{gig.title}</h3>
                
                {gig.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span>{gig.rating.average.toFixed(1)}</span>
                    <span className="text-gray-500">({gig.rating.count})</span>
                  </div>
                )}
                
                <div className="pt-2 border-t mt-2">
                  <p className="font-semibold text-gray-800">
                    Từ {gig.price.toString()} VNĐ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}