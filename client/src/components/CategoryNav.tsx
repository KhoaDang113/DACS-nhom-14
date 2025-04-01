import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [categories, setCategories] = useState<Category[]>([]);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  useEffect(() => {
    const axiosCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    axiosCategories();

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
  return (
    <div
      className="hidden md:flex relative space-x-6 gap-6 bg-white cursor-pointer px-6 border-b overflow-x-hidden"
      ref={categoryRef}
    >
      {canScrollLeft && (
        <ChevronLeft className="absolute text-gray-800 left-1" />
      )}
      {categories.map((category) => (
        <div key={category._id} className="relative group ">
          <h3 className="font-normal text-md text-nowrap text-gray-700 hover:text-black border-b-4 border-b-transparent hover:border-b-green-500">
            {category.name}
          </h3>
          {category.subcategories.length > 0 && (
            <div className="absolute left-0 top-full hidden group-hover:flex w-[800px] bg-white shadow-lg p-6 rounded-lg border border-gray-200 z-50">
              <div className="grid grid-cols-3 gap-6 w-full">
                {category.subcategories.map((sub, index) => (
                  <div key={sub._id} className="space-y-2">
                    <h4 className="font-semibold text-gray-900">{sub.name}</h4>
                    <ul className="space-y-1">
                      {/* Mục con (nếu có) */}
                      {sub.subcategoryChildren &&
                        sub.subcategoryChildren.length > 0 && (
                          <ul className="space-y-1 pl-4 border-l border-gray-300">
                            {sub.subcategoryChildren.map((subSub) => (
                              <li
                                key={subSub._id}
                                className="text-gray-600 hover:text-black cursor-pointer"
                              >
                                {subSub.name}
                              </li>
                            ))}
                          </ul>
                        )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      {canScrollRight && (
        <ChevronRight className="absolute text-gray-800 right-1" />
      )}
    </div>
  );
};

export default CategoryNav;
