import { useState, useEffect } from "react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
}

// Danh sách danh mục mẫu (từ data hiện có)
const categories = [
  { id: "design", name: "Thiết kế" },
  { id: "programming", name: "Lập trình" },
  { id: "marketing", name: "Marketing" },
  { id: "writing", name: "Viết nội dung" },
  { id: "video", name: "Video & Hình ảnh" }
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onChange }) => {
  return (
    <div className="p-3 border border-gray-200 rounded-md">
      <h3 className="font-medium mb-2">Danh mục</h3>
      <select
        value={selectedCategory || ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;