import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import GigCard from "../components/Card/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  user?: {
    _id: string;
    avatar: string;
    name: string;
    email: string;
  };
  star: {
    $numberDecimal: string;
  };
  ratingsCount: number;
}

type Category = {
  _id: string;
  name: string;
  subcategories?: Category[];
};

interface SearchResponse {
  error: boolean;
  message: string;
  totalPages: number;
  totalResults: number;
  gigs: SearchResult[];
}

export default function AdvancedSearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // State cho bộ lọc
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

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
  const performSearch = async (sortOption = sortBy, page = currentPage) => {
    setLoading(true);
    setError("");

    try {
      const params: Record<string, string | number> = {
        page,
        limit: ITEMS_PER_PAGE,
      };
      if (keywordFromUrl) params.keyword = keywordFromUrl;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedCategory) params.category = selectedCategory;
      params.sortBy = sortOption;

      const response = await axios.get<SearchResponse>(
        "http://localhost:5000/api/search",
        {
          params,
        }
      );

      if (response.data && response.data.gigs) {
        setSearchResults(response.data.gigs);
        setTotalPages(response.data.totalPages);
        setTotalResults(response.data.totalResults);
      } else {
        setSearchResults([]);
        setTotalPages(0);
        setTotalResults(0);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Lỗi khi tìm kiếm:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError("Không tìm thấy kết quả nào phù hợp với tìm kiếm của bạn.");
        } else {
          setError("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.");
        }
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    performSearch(sortBy, newPage);
    // Cuộn lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hàm render nội dung tìm kiếm dựa trên trạng thái
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1dbf73] border-t-transparent"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">{error}</p>
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Không tìm thấy kết quả nào phù hợp với tìm kiếm của bạn.
          </p>
        </div>
      );
    }

    // Hiển thị kết quả tìm kiếm
    return (
      <>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-5 gap-4 sm:gap-6">
          {searchResults.map((result) => (
            <GigCard
              key={result._id}
              gig={{
                _id: result._id,
                title: result.title,
                price: result.price,
                media: result.media,
                freelancer: result.user,
                rating: parseFloat(result.star.$numberDecimal || "0"),
                ratingsCount: result.ratingsCount,
              }}
              onFavorite={(id) => console.log(`Favorited gig: ${id}`)}
              onPlayVideo={(url) => console.log(`Playing video: ${url}`)}
            />
          ))}
        </div>

        {/* Phân trang */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-6 sm:px-6 mt-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ${
                currentPage === 1
                  ? "text-gray-400 ring-gray-300 cursor-not-allowed"
                  : "text-gray-900 ring-gray-300 hover:bg-gray-50"
              }`}
            >
              Trang trước
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ${
                currentPage === totalPages
                  ? "text-gray-400 ring-gray-300 cursor-not-allowed"
                  : "text-gray-900 ring-gray-300 hover:bg-gray-50"
              }`}
            >
              Trang sau
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalResults)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{totalResults}</span> kết quả
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (page >= currentPage - 1 && page <= currentPage + 1)
                      return true;
                    return false;
                  })
                  .map((page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <span
                          key={`ellipsis-${page}`}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === page
                            ? "z-10 bg-[#1dbf73] text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1dbf73]"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 sm:px-6 md:px-24">
      {/* Bộ lọc ngay dưới navbar - Luôn hiển thị */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-3">
            <h2 className="text-lg font-medium mb-3">
              Kết quả tìm kiếm cho: "{keywordFromUrl}"
            </h2>

            {/* Bộ lọc luôn hiển thị */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 ">
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
                  className="w-full px-3 py-2 border rounded-md text-sm scrollbar-hidden"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <optgroup key={cat._id} label={cat.name}>
                      {cat.subcategories?.length ? (
                        cat.subcategories.map((child) => (
                          <option key={child._id} value={child._id}>
                            {child.name}
                          </option>
                        ))
                      ) : (
                        <option value={cat._id}>{cat.name}</option>
                      )}
                    </optgroup>
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

      {/* Kết quả tìm kiếm */}
      <div className="container mx-auto px-4 h-full bg-white rounded-br-2xl rounded-bl-2xl shadow-xl p-4 sm:p-6 md:px-8">
        {/* Sort By Dropdown */}
        <div className="mb-6 flex justify-end items-center mr-[20px]">
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

        {renderContent()}
      </div>
    </div>
  );
}
