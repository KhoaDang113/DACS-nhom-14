import { useState, useEffect } from "react";

interface PriceFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  onChange: (min: number | null, max: number | null) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ minPrice, maxPrice, onChange }) => {
  const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice?.toString() || "");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice?.toString() || "");
  
  // Cập nhật giá trị local khi props thay đổi
  useEffect(() => {
    setLocalMinPrice(minPrice?.toString() || "");
    setLocalMaxPrice(maxPrice?.toString() || "");
  }, [minPrice, maxPrice]);
  
  // Xử lý khi người dùng nhập xong
  const handleBlur = () => {
    const newMin = localMinPrice ? Number(localMinPrice) : null;
    const newMax = localMaxPrice ? Number(localMaxPrice) : null;
    onChange(newMin, newMax);
  };
  
  return (
    <div className="p-3 border border-gray-200 rounded-md">
      <h3 className="font-medium mb-2">Giá (USD)</h3>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder="Tối thiểu"
          value={localMinPrice}
          onChange={(e) => setLocalMinPrice(e.target.value)}
          onBlur={handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          placeholder="Tối đa"
          value={localMaxPrice}
          onChange={(e) => setLocalMaxPrice(e.target.value)}
          onBlur={handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default PriceFilter;