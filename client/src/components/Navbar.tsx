"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navLinks = [
    { title: "Khám phá", path: "#", hasDropdown: true },
    { title: "Trở thành người bán", path: "#" },
  ];

  return (
    <header className="sticky left-0 top-0 z-50 w-full border-b bg-white md:pl-[30px] md:pr-[30px]">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <div className="font-bold text-2xl sm:text-3xl">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              Jop
            </div>
            <span>JopViet</span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
            <input
              type="text"
              placeholder="Bạn đang tìm kiếm dịch vụ gì hôm nay?"
              className="w-full px-3 py-2 text-gray-500 bg-white outline-none text-sm"
            />
            <button className="h-full px-4 bg-gray-300 text-white flex items-center justify-center hover:bg-gray-400 transition-colors">
              <Search size={18} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link, index) => (
            <div key={index} className="flex items-center">
              <Link
                to={link.path}
                className="text-black hover:text-[#1dbf73] font-medium text-sm lg:text-base whitespace-nowrap"
              >
                {link.title}
              </Link>
              {link.hasDropdown && (
                <ChevronDown className="text-black ml-1" size={16} />
              )}
            </div>
          ))}

          <div className="flex items-center gap-1">
            <span className="text-black">🌐</span>
            <Link
              to="#"
              className="text-black hover:text-[#1dbf73] font-medium text-sm lg:text-base"
            >
              English
            </Link>
          </div>

          {/* Authentication */}
          {isSignedIn ? (
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-cyan-500 bg-cyan-100 shadow-md">
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
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
        <div className="md:hidden border-t bg-white shadow-lg">
          {/* Mobile Search */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                className="w-full px-3 py-2 text-gray-500 bg-white outline-none text-sm"
              />
              <button className="h-full px-3 bg-gray-300 text-white flex items-center justify-center">
                <Search size={16} className="text-gray-700" />
              </button>
            </div>
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
                <span>{link.title}</span>
                {link.hasDropdown && <ChevronDown size={16} />}
              </Link>
            ))}

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
