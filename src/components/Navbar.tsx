"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown, Bell, Mail, Heart, Lock } from "lucide-react";
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import NotificationBell from "./NotificationBell";
import SearchBar from "./Search/SearchBar";
import useUserRole from "../hooks/useUserRole";
import useLockedAccount from "../hooks/useLockedAccount"; // Import hook kiểm tra khóa tài khoản
import toast from "react-hot-toast";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isSignedIn, user } = useUser();
  const { isFreelancer, isAdmin, isLoading } = useUserRole();
  const { isLocked } = useLockedAccount(); // Sử dụng hook useLockedAccount
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignInSuccess = () => {
    navigate("/jobs");
  };

  // Xử lý khi người dùng click vào một menu bị khóa
  const handleLockedFeatureClick = (
    e: React.MouseEvent,
    featureName: string
  ) => {
    if (isLocked) {
      e.preventDefault();
      toast.error(
        `Tính năng "${featureName}" không khả dụng. Tài khoản của bạn đã bị khóa.`,
        {
          duration: 3000,
          position: "top-center",
        }
      );
    }
  };

  // State để quản lý trạng thái đóng mở của dropdown chức năng
  const [functionsDropdownOpen, setFunctionsDropdownOpen] = useState(false);
  const functionsDropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        functionsDropdownRef.current &&
        !functionsDropdownRef.current.contains(event.target as Node)
      ) {
        setFunctionsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tạo navLinks tương ứng với trạng thái đăng nhập
  const navLinks = isSignedIn
    ? [
        // Người dùng đã đăng nhập
        { title: "", path: "/inbox/null", icon: <Mail size={20} /> },
        { title: "", path: "/bookmarks", icon: <Heart size={20} /> },
        // Hiển thị nút "Trở thành Freelancer" chỉ khi người dùng chưa là freelancer và không bị khóa
        ...(!isFreelancer && !isLocked
          ? [{ title: "Trở thành Freelancer", path: "/become-freelancer" }]
          : []),
      ]
    : [
        // Người dùng chưa đăng nhập
        { title: "Khám phá", path: "#", hasDropdown: true },
        { title: "Trở thành người bán", path: "#" },
        { title: "Danh sách công việc", path: "/jobs" },
      ];

  return (
    <header className="sticky left-0 top-0 z-50 w-full border-b bg-white md:pl-[30px] md:pr-[30px]">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <div className="font-bold text-2xl sm:text-3xl flex-shrink-0">
          <a
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-xl"
          >
            <img
              src="/Logo_jopViet.png"
              alt="JopViet Logo"
              className="h-8 w-8"
            />
            <span>JopViet</span>
          </a>
        </div>

        {/* Thanh tìm kiếm - Luôn hiển thị */}
        <div className="hidden md:block flex-grow max-w-xl mx-4">
          <SearchBar />
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {isSignedIn && <NotificationBell />}
          {navLinks.map((link, index) => (
            <div key={index} className="flex items-center">
              <Link
                to={link.path}
                className={`text-black hover:text-[#1dbf73] font-medium text-sm lg:text-base whitespace-nowrap flex items-center gap-2 ${
                  link.path === "/become-freelancer" && isLocked
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={(e) =>
                  link.path === "/become-freelancer" &&
                  handleLockedFeatureClick(e, "Trở thành Freelancer")
                }
              >
                {link.icon}
                <span>{link.title}</span>
                {link.path === "/become-freelancer" && isLocked && (
                  <Lock size={16} className="ml-1 text-gray-400" />
                )}
              </Link>
              {!isSignedIn && link.hasDropdown && (
                <ChevronDown className="text-black ml-1" size={16} />
              )}
            </div>
          ))}

          {!isSignedIn && (
            <div className="flex items-center gap-1">
              <span className="text-black">🌐</span>
              <Link
                to="#"
                className="text-black hover:text-[#1dbf73] font-medium text-sm lg:text-base"
              >
                English
              </Link>
            </div>
          )}

          {/* Dropdown Chức năng */}
          {isSignedIn && (
            <div className="relative" ref={functionsDropdownRef}>
              <button
                onClick={() => setFunctionsDropdownOpen(!functionsDropdownOpen)}
                className="text-black hover:text-[#1dbf73] font-medium text-sm lg:text-base flex items-center"
              >
                Chức năng <ChevronDown className="ml-1" size={16} />
              </button>
              {functionsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1">
                  {/* Mục người dùng */}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setFunctionsDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Hồ sơ của tôi
                  </Link>

                  {/* Mục đơn hàng */}
                  <Link
                    to={isLocked ? "#" : "/orders"}
                    className={`block px-4 py-2 text-sm ${
                      isLocked
                        ? "text-gray-400"
                        : "text-gray-700 hover:bg-gray-100"
                    } flex items-center`}
                    onClick={(e) => {
                      if (isLocked) {
                        handleLockedFeatureClick(e, "Quản lý đơn hàng");
                      } else {
                        setFunctionsDropdownOpen(false);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Quản lý đơn hàng
                    {isLocked && <Lock size={14} className="ml-auto" />}
                  </Link>

                  <hr className="my-1 border-gray-200" />

                  {/* Mục người bán */}
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400">
                    NGƯỜI BÁN
                  </div>

                  <Link
                    to={isLocked ? "#" : "/seller-dashboard"}
                    className={`block px-4 py-2 text-sm ${
                      isLocked
                        ? "text-gray-400"
                        : "text-gray-700 hover:bg-gray-100"
                    } flex items-center`}
                    onClick={(e) => {
                      if (isLocked) {
                        handleLockedFeatureClick(e, "Tổng quan kinh doanh");
                      } else {
                        setFunctionsDropdownOpen(false);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Tổng quan kinh doanh
                    {isLocked && <Lock size={14} className="ml-auto" />}
                  </Link>
                  <Link
                    to={isLocked ? "#" : "/create-gig"}
                    className={`block px-4 py-2 text-sm ${
                      isLocked
                        ? "text-gray-400"
                        : "text-gray-700 hover:bg-gray-100"
                    } flex items-center`}
                    onClick={(e) => {
                      if (isLocked) {
                        handleLockedFeatureClick(e, "Tạo dịch vụ");
                      } else {
                        setFunctionsDropdownOpen(false);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Tạo dịch vụ
                    {isLocked && <Lock size={14} className="ml-auto" />}
                  </Link>

                  <Link
                    to={isLocked ? "#" : "/seller-gigs"}
                    className={`block px-4 py-2 text-sm ${
                      isLocked
                        ? "text-gray-400"
                        : "text-gray-700 hover:bg-gray-100"
                    } flex items-center`}
                    onClick={(e) => {
                      if (isLocked) {
                        handleLockedFeatureClick(e, "Quản lý dịch vụ");
                      } else {
                        setFunctionsDropdownOpen(false);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    Quản lý dịch vụ
                    {isLocked && <Lock size={14} className="ml-auto" />}
                  </Link>

                  <Link
                    to={isLocked ? "#" : "/order-management"}
                    className={`block px-4 py-2 text-sm ${
                      isLocked
                        ? "text-gray-400"
                        : "text-gray-700 hover:bg-gray-100"
                    } flex items-center`}
                    onClick={(e) => {
                      if (isLocked) {
                        handleLockedFeatureClick(e, "Quản lý bán hàng");
                      } else {
                        setFunctionsDropdownOpen(false);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Quản lý bán hàng
                    {isLocked && <Lock size={14} className="ml-auto" />}
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Authentication */}
          {isSignedIn ? (
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-cyan-500 bg-cyan-100 shadow-md cursor-pointer">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <SignInButton
                mode="modal"
                redirectUrl="/jobs"
                onSignIn={handleSignInSuccess}
              >
                <div className="cursor-pointer text-black hover:text-[#1dbf73] font-medium text-sm lg:text-base whitespace-nowrap">
                  Đăng nhập
                </div>
              </SignInButton>

              <SignUpButton mode="modal">
                <div className="cursor-pointer text-gray-800 bg-white rounded-2xl px-3 py-1.5 text-sm lg:text-base font-medium border border-gray-800 hover:text-white hover:bg-gray-800 transition-all duration-200 whitespace-nowrap">
                  Tham gia
                </div>
              </SignUpButton>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={toggleMenu}
          aria-label="Chuyển đổi menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed left-0 right-0 top-[64px] sm:top-[80px] bg-white shadow-lg z-50 max-h-[calc(100vh-64px)] overflow-y-auto">
          {/* Mobile Search */}
          <div className="px-4 py-3 border-b">
            <SearchBar />
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-col py-2">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={
                  link.path === "/become-freelancer" && isLocked
                    ? "#"
                    : link.path
                }
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-gray-50 hover:text-[#1dbf73] ${
                  link.path === "/become-freelancer" && isLocked
                    ? "opacity-50"
                    : ""
                }`}
                onClick={(e) => {
                  if (link.path === "/become-freelancer" && isLocked) {
                    handleLockedFeatureClick(e, "Trở thành Freelancer");
                  } else {
                    setMenuOpen(false);
                  }
                }}
              >
                {link.icon ? (
                  <div className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.title}</span>
                  </div>
                ) : (
                  <span>{link.title}</span>
                )}
                {!isSignedIn && link.hasDropdown && <ChevronDown size={16} />}
                {link.path === "/become-freelancer" && isLocked && (
                  <Lock size={16} />
                )}
              </Link>
            ))}

            {!isSignedIn && (
              <Link
                to="#"
                className="flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-gray-50 hover:text-[#1dbf73]"
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <span>English</span>
                </div>
              </Link>
            )}

            {/* Mobile Seller Menu - Chỉ hiển thị khi đã đăng nhập */}
            {isSignedIn && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-t border-gray-200 mt-2">
                  NGƯỜI BÁN
                </div>

                <Link
                  to={isLocked ? "#" : "/seller-dashboard"}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium ${
                    isLocked
                      ? "text-gray-400"
                      : "hover:bg-gray-50 hover:text-[#1dbf73]"
                  }`}
                  onClick={(e) => {
                    if (isLocked) {
                      handleLockedFeatureClick(e, "Tổng quan kinh doanh");
                    } else {
                      setMenuOpen(false);
                    }
                  }}
                >
                  <span>Tổng quan kinh doanh</span>
                  {isLocked && <Lock size={16} />}
                </Link>

                <Link
                  to={isLocked ? "#" : "/seller-gigs"}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium ${
                    isLocked
                      ? "text-gray-400"
                      : "hover:bg-gray-50 hover:text-[#1dbf73]"
                  }`}
                  onClick={(e) => {
                    if (isLocked) {
                      handleLockedFeatureClick(e, "Quản lý dịch vụ");
                    } else {
                      setMenuOpen(false);
                    }
                  }}
                >
                  <span>Quản lý dịch vụ</span>
                  {isLocked && <Lock size={16} />}
                </Link>

                <Link
                  to={isLocked ? "#" : "/order-management"}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium ${
                    isLocked
                      ? "text-gray-400"
                      : "hover:bg-gray-50 hover:text-[#1dbf73]"
                  }`}
                  onClick={(e) => {
                    if (isLocked) {
                      handleLockedFeatureClick(e, "Quản lý bán hàng");
                    } else {
                      setMenuOpen(false);
                    }
                  }}
                >
                  <span>Quản lý bán hàng</span>
                  {isLocked && <Lock size={16} />}
                </Link>
              </>
            )}

            {/* Mobile Authentication */}
            {isSignedIn ? (
              <div className="px-4 py-3 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-cyan-500 bg-cyan-100 shadow-md">
                    <UserButton />
                  </div>
                  <span className="text-sm font-medium">Tài khoản của bạn</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-4 border-t">
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="w-full justify-center text-gray-700"
                  >
                    Đăng nhập
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full justify-center">Đăng ký</Button>
                </SignUpButton>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
