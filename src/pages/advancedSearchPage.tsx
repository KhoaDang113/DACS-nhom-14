import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import GigCard from "../components/Card/Card";

// Định nghĩa kiểu dữ liệu cho kết quả tìm kiếm
interface SearchResult {
  _id: string;
  title: string;
  description: string;
  price: number;
  media: Array<{ url: string; type: "image" | "video"; thumbnailUrl?: string }>;
  category_id?: string;
  duration?: number;
  freelancerId?: string;
  name: string;
  email: string;
  rating?: {
    average: number;
    count: number;
  };
}

export default function AdvancedSearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  // State cho bộ lọc
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  // Lấy từ khóa từ URL
  const queryParams = new URLSearchParams(location.search);
  const keywordFromUrl = queryParams.get("keyword") || "";
  useEffect(() => {
    performSearch();
  }, [location]);
  useEffect(() => {
    // Lấy danh sách danh mục cho bộ lọc
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/category");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Không thể lấy danh sách danh mục:", error);
      }
    };

    fetchCategories();

    // Tìm kiếm khi có từ khóa hoặc khi trang được tải lần đầu
    if (keywordFromUrl) {
      performSearch();
    }
  }, []);

  // Hàm thực hiện tìm kiếm
  const performSearch = async (sortOption = sortBy) => {
    setLoading(true);
    setError("");

    try {
      // Xây dựng query params cho tìm kiếm
      const params: Record<string, string> = {};
      if (keywordFromUrl) params.keyword = keywordFromUrl;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedCategory) params.category = selectedCategory;
      params.sortBy = sortOption;
      const response = await axios.get("http://localhost:5000/api/search", {
        params,
      });

      if (response.data && response.data.gigs) {
        setSearchResults(response.data.gigs);
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      console.error("Lỗi khi tìm kiếm:", error);
      if (error.response && error.response.status === 404) {
        setError("Không tìm thấy kết quả nào phù hợp với tìm kiếm của bạn.");
      } else {
        setError("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm áp dụng bộ lọc và cập nhật URL
  const applyFilters = () => {
    // Cập nhật URL với các tham số lọc
    const newParams = new URLSearchParams();
    if (keywordFromUrl) newParams.set("keyword", keywordFromUrl);
    if (minPrice) newParams.set("minPrice", minPrice);
    if (maxPrice) newParams.set("maxPrice", maxPrice);
    if (selectedCategory) newParams.set("category", selectedCategory);

    // Cập nhật URL mà không reload trang
    navigate(`/advanced-search?${newParams.toString()}`, { replace: true });

    // Thực hiện tìm kiếm
    performSearch();
  };
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    performSearch(newSortBy);
  };
  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 sm:px-6 md:px-8">
      {/* Bộ lọc ngay dưới navbar - Luôn hiển thị */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-3">
            <h2 className="text-lg font-medium mb-3">
              Kết quả tìm kiếm cho: "{keywordFromUrl}"
            </h2>

            {/* Bộ lọc luôn hiển thị */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              {/* Lọc theo khoảng giá - chiếm 2 cột */}
              <div className="md:col-span-2">
                <p className="font-medium mb-2 text-sm">Khoảng giá</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Tối thiểu"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Tối đa"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>

              {/* Lọc theo danh mục - chiếm 1 cột */}
              <div>
                <p className="font-medium mb-2 text-sm">Danh mục</p>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nút áp dụng bộ lọc - chiếm 1 cột */}
              <div className="flex items-end">
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-[#1dbf73] text-white rounded-md hover:bg-[#19a463] transition-colors text-sm font-medium"
                >
                  Áp dụng lọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sort By Dropdown */}
      <div className="mb-6 flex justify-end items-center mr-[20px] mt-[10px]">
        <label className="mr-2 text-gray-700 font-semibold">Sắp xếp:</label>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border rounded-lg px-3 py-1 text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="recommended">Đề xuất</option>
          <option value="hot">Hot</option>
          <option value="new">Mới</option>
        </select>
      </div>
      {/* Kết quả tìm kiếm */}
      <div className="container mx-auto px-4 mt-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1dbf73] border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              Không tìm thấy kết quả nào phù hợp với tìm kiếm của bạn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {searchResults.map((result) => (
              <GigCard
                key={result._id}
                gig={{
                  _id: result._id,
                  title: result.title,
                  price: result.price,
                  media: result.media,
                  freelancer: {
                    _id: result.freelancerId || "",
                    name: result.name,
                    avatar: "",
                    level: 1,
                  },
                  rating: result.rating,
                }}
                onFavorite={(id) => console.log(`Favorited gig: ${id}`)}
                onPlayVideo={(url) => console.log(`Playing video: ${url}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
