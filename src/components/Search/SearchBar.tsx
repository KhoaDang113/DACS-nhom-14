import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Click ngoài component thì ẩn dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/popular-categories"
        );
        if (response.data && response.data.data) {
          const categories = response.data.data.map(
            (category: { categoryName: string }) => category.categoryName
          );
          setPopularCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching popular categories:", error);
      }
    };

    fetchPopularCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setShowDropdown(false);

    navigate(`/advanced-search?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleClear = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleClickSuggestion = (term: string) => {
    setSearchTerm(term);
    setShowDropdown(false);
    navigate(`/advanced-search?keyword=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <form
        onSubmit={handleSearch}
        className="flex items-center border border-gray-300 rounded-md overflow-hidden"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Bạn sẽ tìm kiếm dịch vụ nào cho hôm nay?"
          className="w-full px-3 py-2 text-sm text-gray-700 bg-white outline-none"
        />
        <button
          type="submit"
          className="h-full px-4 bg-gray-300 text-white hover:bg-gray-400"
        >
          <Search size={18} className="text-gray-700" />
        </button>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 w-full bg-white border mt-1 rounded-md shadow-md z-10">
          {recentSearches.length > 0 && (
            <div className="px-4 py-2 border-b">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-500">
                  Tìm kiếm gần đây
                </span>
                <button
                  className="text-xs text-blue-500 hover:underline"
                  onClick={handleClear}
                >
                  Xóa
                </button>
              </div>
              {recentSearches.map((term, index) => (
                <div
                  key={index}
                  className="py-1 text-sm text-gray-700 hover:text-[#1dbf73] cursor-pointer"
                  onClick={() => handleClickSuggestion(term)}
                >
                  {term}
                </div>
              ))}
            </div>
          )}

          <div className="px-4 py-2">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Dịch vụ nổi bật
            </div>
            <div className="flex flex-wrap gap-2">
              {popularCategories.length > 0 ? (
                popularCategories.map((category, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 cursor-pointer hover:text-[#1dbf73]"
                    onClick={() => handleClickSuggestion(category)}
                  >
                    {category}
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500">
                  Hiện không có dịch vụ nào phổ biến
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
