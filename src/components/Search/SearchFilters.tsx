import { useState } from "react";
import PriceFilter from "./PriceFilter";
import CategoryFilter from "./CategoryFilter";
import { Search } from "lucide-react";

interface SearchParams {
  minPrice: number | null;
  maxPrice: number | null;
  minDuration: number | null;
  maxDuration: number | null;
  category: string | null;
  rating: number | null;
  searchTerm: string;
}

interface SearchFiltersProps {
  searchParams: SearchParams;
  onChange: (params: Partial<SearchParams>) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ searchParams, onChange }) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleReset = () => {
    onChange({
      minPrice: null,
      maxPrice: null,
      minDuration: null,
      maxDuration: null,
      category: null,
      rating: null,
      searchTerm: "",
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Thanh tìm kiếm */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ..."
          value={searchParams.searchTerm}
          onChange={(e) => onChange({ searchTerm: e.target.value })}
          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-blue-600 hover:underline absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {expanded ? "Thu gọn bộ lọc" : "Mở rộng bộ lọc"}
        </button>
      </div>
      
      {/* Bộ lọc mở rộng */}
      {expanded && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <PriceFilter
            minPrice={searchParams.minPrice}
            maxPrice={searchParams.maxPrice}
            onChange={(min, max) => onChange({ minPrice: min, maxPrice: max })}
          />
          
          
          
          <CategoryFilter
            selectedCategory={searchParams.category}
            onChange={(category) => onChange({ category })}
          />
          
          
          
          <div className="mt-4 sm:col-span-2 md:col-span-4 flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 mr-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
            >
              Đặt lại
            </button>
            
            <button
              onClick={() => setExpanded(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;