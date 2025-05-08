import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Dữ liệu giả cho API category
// Sử dụng để mô phỏng API response từ http://localhost:5000/api/category

// Định nghĩa interfaces
interface Subcategory {
  _id: string;
  name: string;
  subcategoryChildren?: Subcategory[]; // Hỗ trợ danh mục con của danh mục con
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

const CategoryNav = () => {
  const categoryRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [showCategory, setShowCategory] = useState(false);

  // Thêm effect để kiểm tra scroll position
  useEffect(() => {
    const axiosCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/category");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    axiosCategories();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".h-screen");
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setShowCategory(heroBottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý scroll ngang
  useEffect(() => {
    const checkScroll = () => {
      if (categoryRef.current) {
        const { scrollWidth, scrollLeft, clientWidth } = categoryRef.current;
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        setCanScrollLeft(scrollLeft > 0);
      }
    };

    const slider = categoryRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => slider.removeEventListener("scroll", checkScroll);
    }
  }, []);

  // Xử lý sự kiện scroll khi click nút left/right
  const handleScroll = (direction: "left" | "right") => {
    if (categoryRef.current) {
      const scrollAmount = 300;
      const currentScroll = categoryRef.current.scrollLeft;
      categoryRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Xử lý hiển thị/ẩn dropdown với delay
  const handleCategoryHover = (categoryId: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoverTimeout(
      setTimeout(() => {
        setActiveCategory(categoryId);
      }, 100) as unknown as number
    );
  };

  const handleCategoryLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoverTimeout(
      setTimeout(() => {
        setActiveCategory(null);
      }, 100) as unknown as number
    );
  };

  return (
    <div
      className={`fixed left-0 right-0 bg-white border-b shadow-sm transition-all duration-300 ${
        showCategory
          ? "translate-y-0 opacity-100 z-50"
          : "-translate-y-full opacity-0 -z-10"
      }`}
      style={{
        top: "81px", // Điều chỉnh vị trí dựa theo navbar của bạn
      }}
    >
      {/* Main navigation - Updated spacing and sizes */}
      <div
        className="flex items-center space-x-10 px-8 overflow-x-auto scrollbar-hide scroll-smooth" // Changed from space-x-8 px-6
        ref={categoryRef}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <div
            key={category._id}
            className="relative py-2 flex-shrink-0"
            onMouseEnter={() => handleCategoryHover(category._id)}
            onMouseLeave={handleCategoryLeave}
          >
            <h3
              className={`font-medium text-[15.5px] text-nowrap cursor-pointer pb-1.5 border-b-2 transition-all duration-150 ${
                activeCategory === category._id
                  ? "text-[#1dbf73] border-[#1dbf73]"
                  : "text-gray-600 hover:text-gray-900 border-transparent"
              }`}
            >
              {category.name}
            </h3>
          </div>
        ))}
      </div>

      {/* Dropdown mega menu */}
      {activeCategory && (
        <div
          className="absolute left-0 top-full w-full bg-white shadow-lg z-40 border-t border-gray-100 animate-fadeIn"
          onMouseEnter={() => handleCategoryHover(activeCategory)}
          onMouseLeave={handleCategoryLeave}
        >
          {/* Container with max-width and right space */}
          <div className="container mx-auto px-8 py-6 relative">
            {/* Add hover area on the right */}
            <div className="absolute right-[-100px] top-0 bottom-0 w-[100px]" />

            <div className="grid grid-cols-4 gap-x-12 gap-y-6 pr-16">
              {" "}
              {/* Added right padding */}
              {categories
                .find((cat) => cat._id === activeCategory)
                ?.subcategories.map((sub) => (
                  <div key={sub._id} className="mb-5">
                    {/* Category title */}
                    <h4 className="font-semibold text-[#404145] mb-3 text-[25px] leading-6">
                      {sub.name}
                    </h4>

                    {sub.subcategoryChildren &&
                      sub.subcategoryChildren.length > 0 && (
                        <ul className="space-y-2.5">
                          {sub.subcategoryChildren.map((subSub) => (
                            <li key={subSub._id} className="group">
                              <a
                                href="#"
                                className="text-[#74767e] hover:text-[#404145] text-[16px] block transition-all duration-200 hover:translate-x-[2px]"
                              >
                                {subSub.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Nút điều hướng */}
      {canScrollLeft && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors"
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft className="text-gray-700" size={18} />
        </button>
      )}

      {canScrollRight && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors"
          onClick={() => handleScroll("right")}
        >
          <ChevronRight className="text-gray-700" size={18} />
        </button>
      )}
    </div>
  );
};

export default CategoryNav;
