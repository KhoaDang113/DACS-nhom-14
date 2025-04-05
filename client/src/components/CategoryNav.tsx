import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Dữ liệu giả cho API category
// Sử dụng để mô phỏng API response từ http://localhost:5000/api/category

const categories = [
  {
    _id: "cat1",
    name: "Thiết kế & Đồ họa",
    subcategories: [
      {
        _id: "sub1-1",
        name: "Thiết kế logo",
        subcategoryChildren: [
          {
            _id: "subsub1-1-1",
            name: "Logo doanh nghiệp"
          },
          {
            _id: "subsub1-1-2",
            name: "Logo thương hiệu cá nhân"
          },
          {
            _id: "subsub1-1-3",
            name: "Logo sản phẩm"
          }
        ]
      },
      {
        _id: "sub1-2",
        name: "Thiết kế banner",
        subcategoryChildren: [
          {
            _id: "subsub1-2-1",
            name: "Banner quảng cáo"
          },
          {
            _id: "subsub1-2-2",
            name: "Banner website"
          }
        ]
      },
      {
        _id: "sub1-3",
        name: "Poster & Brochure",
        subcategoryChildren: [
          {
            _id: "subsub1-3-1",
            name: "Poster sự kiện"
          },
          {
            _id: "subsub1-3-2",
            name: "Brochure giới thiệu"
          }
        ]
      },
      {
        _id: "sub1-4",
        name: "Thiết kế UI/UX",
        subcategoryChildren: [
          {
            _id: "subsub1-4-1",
            name: "Giao diện web"
          },
          {
            _id: "subsub1-4-2",
            name: "Giao diện ứng dụng di động"
          },
          {
            _id: "subsub1-4-3",
            name: "Wireframe & Prototype"
          },
          {
            _id: "subsub1-4-4",
            name: "Design system"
          }
        ]
      },
      {
        _id: "sub1-5",
        name: "Minh họa & Vẽ tranh",
        subcategoryChildren: [
          {
            _id: "subsub1-5-1",
            name: "Minh họa kỹ thuật số"
          },
          {
            _id: "subsub1-5-2",
            name: "Minh họa truyện tranh"
          },
          {
            _id: "subsub1-5-3",
            name: "Vẽ chân dung"
          }
        ]
      },
      {
        _id: "sub1-6",
        name: "Thiết kế bao bì",
        subcategoryChildren: [
          {
            _id: "subsub1-6-1",
            name: "Bao bì sản phẩm"
          },
          {
            _id: "subsub1-6-2",
            name: "Nhãn sản phẩm"
          },
          {
            _id: "subsub1-6-3",
            name: "Thiết kế hộp quà"
          }
        ]
      },
      {
        _id: "sub1-7",
        name: "Chỉnh sửa ảnh",
        subcategoryChildren: [
          {
            _id: "subsub1-7-1",
            name: "Retouch ảnh chân dung"
          },
          {
            _id: "subsub1-7-2",
            name: "Chỉnh màu ảnh"
          },
          {
            _id: "subsub1-7-3",
            name: "Chỉnh sửa ảnh sản phẩm"
          },
          {
            _id: "subsub1-7-4",
            name: "Xóa phông nền"
          }
        ]
      },
      {
        _id: "sub1-8",
        name: "Thiết kế 3D",
        subcategoryChildren: [
          {
            _id: "subsub1-8-1",
            name: "Mô hình 3D sản phẩm"
          },
          {
            _id: "subsub1-8-2",
            name: "Render 3D"
          },
          {
            _id: "subsub1-8-3",
            name: "Hoạt hình 3D"
          }
        ]
      },
      {
        _id: "sub1-9",
        name: "Thiết kế nhân vật",
        subcategoryChildren: [
          {
            _id: "subsub1-9-1",
            name: "Nhân vật hoạt hình"
          },
          {
            _id: "subsub1-9-2",
            name: "Mascot thương hiệu"
          },
          {
            _id: "subsub1-9-3",
            name: "Nhân vật game"
          }
        ]
      },
      {
        _id: "sub1-10",
        name: "Thiết kế ấn phẩm",
        subcategoryChildren: [
          {
            _id: "subsub1-10-1",
            name: "Danh thiếp"
          },
          {
            _id: "subsub1-10-2",
            name: "Tờ rơi"
          },
          {
            _id: "subsub1-10-3",
            name: "Thiệp mời & Thiệp chúc"
          },
          {
            _id: "subsub1-10-4",
            name: "Lịch & Lịch bàn"
          }
        ]
      },
      {
        _id: "sub1-11",
        name: "Thiết kế quảng cáo",
        subcategoryChildren: [
          {
            _id: "subsub1-11-1",
            name: "Quảng cáo Facebook & Instagram"
          },
          {
            _id: "subsub1-11-2",
            name: "Quảng cáo Google"
          },
          {
            _id: "subsub1-11-3",
            name: "Biển quảng cáo"
          }
        ]
      }
    ]
  },
  {
    _id: "cat2",
    name: "Phát triển website",
    subcategories: [
      {
        _id: "sub2-1",
        name: "Front-end",
        subcategoryChildren: [
          {
            _id: "subsub2-1-1",
            name: "HTML/CSS"
          },
          {
            _id: "subsub2-1-2",
            name: "React JS"
          },
          {
            _id: "subsub2-1-3",
            name: "Vue JS"
          }
        ]
      },
      {
        _id: "sub2-2",
        name: "Back-end",
        subcategoryChildren: [
          {
            _id: "subsub2-2-1",
            name: "Node.js"
          },
          {
            _id: "subsub2-2-2",
            name: "PHP"
          },
          {
            _id: "subsub2-2-3",
            name: "Python"
          }
        ]
      },
      {
        _id: "sub2-3",
        name: "Full-stack",
        subcategoryChildren: [
          {
            _id: "subsub2-3-1",
            name: "MERN Stack"
          },
          {
            _id: "subsub2-3-2",
            name: "LAMP Stack"
          }
        ]
      }
    ]
  },
  {
    _id: "cat3",
    name: "Viết nội dung",
    subcategories: [
      {
        _id: "sub3-1",
        name: "Nội dung marketing",
        subcategoryChildren: [
          {
            _id: "subsub3-1-1",
            name: "Bài viết SEO"
          },
          {
            _id: "subsub3-1-2",
            name: "Nội dung mạng xã hội"
          }
        ]
      },
      {
        _id: "sub3-2",
        name: "Copywriting",
        subcategoryChildren: [
          {
            _id: "subsub3-2-1",
            name: "Slogan & Tagline"
          },
          {
            _id: "subsub3-2-2",
            name: "Nội dung quảng cáo"
          }
        ]
      },
      {
        _id: "sub3-3",
        name: "Dịch thuật",
        subcategoryChildren: [
          {
            _id: "subsub3-3-1",
            name: "Anh - Việt"
          },
          {
            _id: "subsub3-3-2",
            name: "Việt - Anh"
          }
        ]
      }
    ]
  },
  {
    _id: "cat4",
    name: "Video & Hình ảnh",
    subcategories: [
      {
        _id: "sub4-1",
        name: "Chỉnh sửa video",
        subcategoryChildren: [
          {
            _id: "subsub4-1-1",
            name: "Video quảng cáo"
          },
          {
            _id: "subsub4-1-2",
            name: "Video sự kiện"
          },
          {
            _id: "subsub4-1-3",
            name: "Video TikTok"
          }
        ]
      },
      {
        _id: "sub4-2",
        name: "Chụp ảnh sản phẩm",
        subcategoryChildren: [
          {
            _id: "subsub4-2-1",
            name: "Sản phẩm thời trang"
          },
          {
            _id: "subsub4-2-2",
            name: "Sản phẩm thực phẩm"
          }
        ]
      }
    ]
  },
  {
    _id: "cat5",
    name: "Digital Marketing",
    subcategories: [
      {
        _id: "sub5-1",
        name: "SEO",
        subcategoryChildren: [
          {
            _id: "subsub5-1-1",
            name: "On-page SEO"
          },
          {
            _id: "subsub5-1-2",
            name: "Off-page SEO"
          }
        ]
      },
      {
        _id: "sub5-2",
        name: "Quảng cáo Google",
        subcategoryChildren: [
          {
            _id: "subsub5-2-1",
            name: "Google Search Ads"
          },
          {
            _id: "subsub5-2-2",
            name: "Google Display Ads"
          }
        ]
      },
      {
        _id: "sub5-3",
        name: "Social Media Marketing",
        subcategoryChildren: [
          {
            _id: "subsub5-3-1",
            name: "Facebook & Instagram Ads"
          },
          {
            _id: "subsub5-3-2",
            name: "TikTok Marketing"
          }
        ]
      }
    ]
  },
  {
    _id: "cat6",
    name: "Kiến trúc & Nội thất",
    subcategories: [
      {
        _id: "sub6-1",
        name: "Thiết kế nội thất",
        subcategoryChildren: [
          {
            _id: "subsub6-1-1",
            name: "Nội thất nhà ở"
          },
          {
            _id: "subsub6-1-2",
            name: "Nội thất văn phòng"
          }
        ]
      },
      {
        _id: "sub6-2",
        name: "Vẽ phối cảnh",
        subcategoryChildren: [
          {
            _id: "subsub6-2-1",
            name: "Phối cảnh ngoại thất"
          },
          {
            _id: "subsub6-2-2",
            name: "Phối cảnh nội thất"
          }
        ]
      }
    ]
  },
  {
    _id: "cat7",
    name: "Dịch vụ kinh doanh",
    subcategories: [
      {
        _id: "sub7-1",
        name: "Kế toán & Tài chính",
        subcategoryChildren: [
          {
            _id: "subsub7-1-1",
            name: "Báo cáo tài chính"
          },
          {
            _id: "subsub7-1-2",
            name: "Tư vấn thuế"
          }
        ]
      },
      {
        _id: "sub7-2",
        name: "Tư vấn khởi nghiệp",
        subcategoryChildren: [
          {
            _id: "subsub7-2-1",
            name: "Kế hoạch kinh doanh"
          },
          {
            _id: "subsub7-2-2",
            name: "Chiến lược phát triển"
          }
        ]
      }
    ]
  },
  {
    _id: "cat8",
    name: "Âm nhạc & Audio",
    subcategories: [
      {
        _id: "sub8-1",
        name: "Sản xuất nhạc",
        subcategoryChildren: [
          {
            _id: "subsub8-1-1",
            name: "Mixing & Mastering"
          },
          {
            _id: "subsub8-1-2",
            name: "Sáng tác nhạc"
          },
          {
            _id: "subsub8-1-3",
            name: "Beat making"
          }
        ]
      },
      {
        _id: "sub8-2",
        name: "Voice Over",
        subcategoryChildren: [
          {
            _id: "subsub8-2-1",
            name: "Giọng đọc quảng cáo"
          },
          {
            _id: "subsub8-2-2",
            name: "Giọng đọc sách nói"
          }
        ]
      },
      {
        _id: "sub8-3",
        name: "Podcast",
        subcategoryChildren: [
          {
            _id: "subsub8-3-1",
            name: "Chỉnh sửa podcast"
          },
          {
            _id: "subsub8-3-2",
            name: "Thiết kế intro podcast"
          }
        ]
      }
    ]
  },
  {
    _id: "cat9",
    name: "AI & Machine Learning",
    subcategories: [
      {
        _id: "sub9-1",
        name: "Xử lý dữ liệu",
        subcategoryChildren: [
          {
            _id: "subsub9-1-1",
            name: "Làm sạch dữ liệu"
          },
          {
            _id: "subsub9-1-2",
            name: "Phân tích dữ liệu"
          }
        ]
      },
      {
        _id: "sub9-2",
        name: "Phát triển AI",
        subcategoryChildren: [
          {
            _id: "subsub9-2-1",
            name: "Chatbot AI"
          },
          {
            _id: "subsub9-2-2",
            name: "Computer Vision"
          },
          {
            _id: "subsub9-2-3",
            name: "Natural Language Processing"
          }
        ]
      }
    ]
  },
  {
    _id: "cat10",
    name: "Game & Ứng dụng",
    subcategories: [
      {
        _id: "sub10-1",
        name: "Phát triển game",
        subcategoryChildren: [
          {
            _id: "subsub10-1-1",
            name: "Unity Game Development"
          },
          {
            _id: "subsub10-1-2",
            name: "Unreal Engine"
          },
          {
            _id: "subsub10-1-3",
            name: "Thiết kế nhân vật game"
          }
        ]
      },
      {
        _id: "sub10-2",
        name: "Phát triển ứng dụng",
        subcategoryChildren: [
          {
            _id: "subsub10-2-1",
            name: "Ứng dụng iOS"
          },
          {
            _id: "subsub10-2-2",
            name: "Ứng dụng Android"
          },
          {
            _id: "subsub10-2-3",
            name: "Ứng dụng đa nền tảng"
          }
        ]
      }
    ]
  },
  {
    _id: "cat11",
    name: "Giáo dục & E-learning",
    subcategories: [
      {
        _id: "sub11-1",
        name: "Khóa học trực tuyến",
        subcategoryChildren: [
          {
            _id: "subsub11-1-1",
            name: "Thiết kế khóa học"
          },
          {
            _id: "subsub11-1-2",
            name: "Biên soạn tài liệu"
          }
        ]
      },
      {
        _id: "sub11-2",
        name: "Hướng dẫn phần mềm",
        subcategoryChildren: [
          {
            _id: "subsub11-2-1",
            name: "Adobe Creative Suite"
          },
          {
            _id: "subsub11-2-2",
            name: "Microsoft Office"
          }
        ]
      }
    ]
  },
  {
    _id: "cat12",
    name: "Dịch vụ pháp lý",
    subcategories: [
      {
        _id: "sub12-1",
        name: "Hợp đồng & Thỏa thuận",
        subcategoryChildren: [
          {
            _id: "subsub12-1-1",
            name: "Soạn thảo hợp đồng"
          },
          {
            _id: "subsub12-1-2",
            name: "Rà soát pháp lý"
          }
        ]
      },
      {
        _id: "sub12-2",
        name: "Sở hữu trí tuệ",
        subcategoryChildren: [
          {
            _id: "subsub12-2-1",
            name: "Đăng ký thương hiệu"
          },
          {
            _id: "subsub12-2-2",
            name: "Đăng ký bản quyền"
          }
        ]
      }
    ]
  },
  {
    _id: "cat13",
    name: "Sức khỏe & Thể hình",
    subcategories: [
      {
        _id: "sub13-1",
        name: "Fitness Online",
        subcategoryChildren: [
          {
            _id: "subsub13-1-1",
            name: "Lịch tập cá nhân hóa"
          },
          {
            _id: "subsub13-1-2",
            name: "Hướng dẫn tập luyện"
          }
        ]
      },
      {
        _id: "sub13-2",
        name: "Dinh dưỡng",
        subcategoryChildren: [
          {
            _id: "subsub13-2-1",
            name: "Kế hoạch dinh dưỡng"
          },
          {
            _id: "subsub13-2-2",
            name: "Thực đơn giảm cân"
          }
        ]
      }
    ]
  }
];

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [showCategory, setShowCategory] = useState(false);

  // Thêm effect để kiểm tra scroll position
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.h-screen');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setShowCategory(heroBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  const handleScroll = (direction: 'left' | 'right') => {
    if (categoryRef.current) {
      const scrollAmount = 300;
      const currentScroll = categoryRef.current.scrollLeft;
      categoryRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Xử lý hiển thị/ẩn dropdown với delay
  const handleCategoryHover = (categoryId: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoverTimeout(setTimeout(() => {
      setActiveCategory(categoryId);
    }, 100) as unknown as number);
  };

  const handleCategoryLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoverTimeout(setTimeout(() => {
      setActiveCategory(null);
    }, 100) as unknown as number);
  };

  return (
    <div 
      className={`fixed left-0 right-0 bg-white border-b shadow-sm transition-all duration-300 ${
        showCategory 
          ? 'translate-y-0 opacity-100 z-50' 
          : '-translate-y-full opacity-0 -z-10'
      }`}
      style={{
        top: '81px', // Điều chỉnh vị trí dựa theo navbar của bạn
      }}
    >
      {/* Main navigation - Updated spacing and sizes */}
      <div
        className="flex items-center space-x-10 px-8 overflow-x-auto scrollbar-hide scroll-smooth" // Changed from space-x-8 px-6
        ref={categoryRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <div 
            key={category._id} 
            className="relative py-2 flex-shrink-0"
            onMouseEnter={() => handleCategoryHover(category._id)}
            onMouseLeave={handleCategoryLeave}
          >
            <h3 className={`font-medium text-[15.5px] text-nowrap cursor-pointer pb-1.5 border-b-2 transition-all duration-150 ${
              activeCategory === category._id 
                ? 'text-[#1dbf73] border-[#1dbf73]' 
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}>
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
            
            <div className="grid grid-cols-4 gap-x-12 gap-y-6 pr-16"> {/* Added right padding */}
              {categories.find(cat => cat._id === activeCategory)?.subcategories.map((sub) => (
                <div key={sub._id} className="mb-5">
                  {/* Category title */}
                  <h4 className="font-semibold text-[#404145] mb-3 text-[25px] leading-6">
                    {sub.name}
                  </h4>
                  
                  {sub.subcategoryChildren && sub.subcategoryChildren.length > 0 && (
                    <ul className="space-y-2.5">
                      {sub.subcategoryChildren.map((subSub) => (
                        <li
                          key={subSub._id}
                          className="group" 
                        >
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
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="text-gray-700" size={18} />
        </button>
      )}
      
      {canScrollRight && (
        <button 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="text-gray-700" size={18} />
        </button>
      )}
    </div>
  );
};

export default CategoryNav;

// Lưu ý: Đừng quên thêm animation vào tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: 0, transform: 'translateY(-10px)' },
//           '100%': { opacity: 1, transform: 'translateY(0)' }
//         }
//       },
//       animation: {
//         fadeIn: 'fadeIn 0.2s ease-out forwards'
//       }
//     }
//   }
// }