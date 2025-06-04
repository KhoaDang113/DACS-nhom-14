import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";

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

// Component Skeleton cho CategoryNav
const CategorySkeleton = () => {
  return (
    <div className="flex items-center space-x-8 py-1.5">
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="skeleton-item">
            <div
              className="h-5 bg-gray-200 rounded-md skeleton-shimmer"
              style={{
                width: `${Math.floor(Math.random() * 40) + 60}px`,
                animationDelay: `${index * 100}ms`,
              }}
            ></div>
          </div>
        ))}
    </div>
  );
};

const CategoryNav = () => {
  const categoryRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [showCategory, setShowCategory] = useState(false);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const { isSignedIn } = useUser();
  const location = useLocation(); // Thêm location để kiểm tra đường dẫn hiện tại

  // Danh sách các đường dẫn không hiển thị CategoryNav
  const excludedPaths = [
    "/admin",
    "/become-freelancer",
    "/create-gig",
    "/seller-gigs",
    "/order-management",
  ];

  // Kiểm tra xem có nên hiển thị CategoryNav không
  const shouldShowCategoryNav = () => {
    // Kiểm tra xem đường dẫn hiện tại có trong danh sách loại trừ không
    return !excludedPaths.some((path) => location.pathname.startsWith(path));
  };

  // Thêm effect để kiểm tra scroll position
  useEffect(() => {
    const axiosCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/category");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoading(false);
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

    // Gọi handleScroll ngay lập tức để xác định trạng thái ban đầu
    handleScroll();
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
  }, [categories]); // Thêm categories vào dependencies để kiểm tra lại khi danh mục được tải

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

  const toggleSubcategory = (subId: string) => {
    setExpandedSubcategories(prev =>
      prev.includes(subId)
        ? prev.filter(id => id !== subId)
        : [...prev, subId]
    );
  };

  return (
    <div
      className={`fixed left-0 right-0 bg-white border-b shadow-sm transition-all duration-500 ${
        (showCategory || isSignedIn) && shouldShowCategoryNav()
          ? "translate-y-0 opacity-100 z-40"
          : "-translate-y-full opacity-0 -z-10"
      }`}
      style={{
        top: "81px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Main navigation - Updated spacing and sizes */}
      <div
        className="flex items-center px-10 py-1 overflow-x-auto scrollbar-hide scroll-smooth relative"
        ref={categoryRef}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {loading ? (
          <CategorySkeleton />
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className="relative flex-shrink-0 mx-4 first:ml-0 last:mr-0"
              onMouseEnter={() => handleCategoryHover(category._id)}
              onMouseLeave={handleCategoryLeave}
            >
              <h3
                className={`font-medium text-[15px] whitespace-nowrap cursor-pointer pb-1.5 transition-all duration-300 ease-in-out ${
                  activeCategory === category._id
                    ? "text-[#1dbf73] border-b-2 border-[#1dbf73]"
                    : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-200"
                }`}
              >
                {category.name}
              </h3>
            </div>
          ))
        ) : (
          <div className="py-2 text-gray-500">Không có danh mục nào</div>
        )}
      </div>

      {/* Dropdown mega menu */}
      {activeCategory && (
        <div
          className="absolute left-0 top-full w-full bg-white shadow-lg z-50 border-t border-gray-100 max-h-[80vh] overflow-y-auto"
          style={{
            boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
            animation: "fadeIn 0.3s ease-in-out forwards",
          }}
          onMouseEnter={() => handleCategoryHover(activeCategory)}
          onMouseLeave={handleCategoryLeave}
        >
          <div className="container mx-auto px-4 md:px-12 py-4 md:py-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories
                .find((cat) => cat._id === activeCategory)
                ?.subcategories.map((sub) => (
                  <div key={sub._id} className="mb-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-[#404145] mb-2.5 text-[17px] leading-6">
                        {sub.name}
                      </h4>
                      {/* Chỉ hiện nút bấm trên mobile */}
                      {sub.subcategoryChildren && sub.subcategoryChildren.length > 0 && (
                        <button
                          onClick={() => toggleSubcategory(sub._id)}
                          className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                        >
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedSubcategories.includes(sub._id) ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {sub.subcategoryChildren && sub.subcategoryChildren.length > 0 && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedSubcategories.includes(sub._id) ? 'max-h-[500px]' : 'max-h-0'
                        } md:max-h-full md:opacity-100`} // Luôn hiển thị trên desktop
                      >
                        <ul className="space-y-2.5 pl-4 mt-2">
                          {sub.subcategoryChildren.map((subSub) => (
                            <li key={subSub._id} className="group">
                              <Link
                                key={subSub._id}
                                to={`/advanced-search?category=${subSub._id}`}
                                className="text-[#74767e] hover:text-[#1dbf73] text-[15px] block transition-all duration-200 hover:translate-x-[2px] font-normal"
                              >
                                {subSub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
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
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-all duration-200 opacity-90 hover:opacity-100"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          onClick={() => handleScroll("left")}
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft
            className="text-gray-600 hover:text-gray-800"
            size={18}
          />
        </button>
      )}

      {canScrollRight && (
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-all duration-200 opacity-90 hover:opacity-100"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          onClick={() => handleScroll("right")}
          aria-label="Cuộn sang phải"
        >
          <ChevronRight
            className="text-gray-600 hover:text-gray-800"
            size={18}
          />
        </button>
      )}

      {/* CSS styles đặt trực tiếp trong component */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .max-h-[80vh] {
              -webkit-overflow-scrolling: touch;
            }
          }
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          .skeleton-shimmer {
            background: linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.06) 25%,
              rgba(0, 0, 0, 0.1) 37%,
              rgba(0, 0, 0, 0.06) 63%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
        `,
        }}
      />
    </div>
  );
};

export default CategoryNav;
