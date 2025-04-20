"use client";

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown, Search, Bell, Mail, Heart } from "lucide-react";
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import SearchBar from "./Search/SearchBar";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true); // Luôn hiện thanh tìm kiếm
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho giá trị tìm kiếm
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignInSuccess = () => {
    navigate("/jobs");
  };

  // Tạm bỏ phần xử lý ẩn hiện thanh tìm kiếm theo scroll
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const heroSection = document.querySelector(".h-screen");
  //     if (heroSection) {
  //       const heroBottom = heroSection.getBoundingClientRect().bottom;
  //       setShowSearch(heroBottom < 0);
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // Thay đổi navLinks thành conditional rendering
  const navLinks = isSignedIn
    ? [
        { title: "", path: "#", icon: <Bell size={20} /> },
        { title: "", path: "#", icon: <Mail size={20} /> },
        { title: "", path: "#", icon: <Heart size={20} /> },
        { title: "Đơn hàng", path: "/orders" },
      ]
    : [
        { title: "Khám phá", path: "#", hasDropdown: true },
        { title: "Trở thành người bán", path: "#" },
        { title: "Danh sách công việc", path: "/jobs" },
      ];

  return (
    <header className="sticky left-0 top-0 z-50 w-full border-b bg-white md:pl-[30px] md:pr-[30px]">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <div className="font-bold text-2xl sm:text-3xl flex-shrink-0">
          <a href="/" className="flex items-center gap-2 font-bold text-xl">
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
          {navLinks.map((link, index) => (
            <div key={index} className="flex items-center">
              <Link
                to={link.path}
                className="text-black hover:text-[#1dbf73] font-medium text-sm lg:text-base whitespace-nowrap flex items-center"
              >
                {link.icon ? link.icon : link.title}
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

          {/* Link Xem Profile */}
          {isSignedIn && location.pathname !== "/profile" && (
            <Link
              to="/profile"
              className="text-black hover:text-[#1dbf73] font-medium text-sm lg:text-base"
            >
              Xem Profile
            </Link>
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
                to={link.path}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-gray-50 hover:text-[#1dbf73]"
                onClick={() => setMenuOpen(false)}
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
