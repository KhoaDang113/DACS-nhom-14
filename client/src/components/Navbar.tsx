"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky left-0 top-0 gap-1 z-50 w-full text-lg border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white/60 justify-center">
      <div className="container mx-auto flex items-center justify-around h-20">
        <div className=" font-bold text-3xl">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              Jop
            </div>
            <span>JopViet</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-[400px] max-w-[600px]">
            <input
              type="text"
              placeholder="What service are you looking for today?"
              className="w-full px-2 py-2 text-gray-500 bg-white outline-none"
            />
            <button className="h-full px-4 bg-gray-300 text-white flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/54/54481.png"
                alt="search-icon"
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="#" className="text-black hover:text-[#1dbf73] font-medium">
            Fiverr Pro
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="#"
              className="text-black hover:text-[#1dbf73] font-medium"
            >
              Explore
            </Link>
            <ChevronDown className="text-black" size={16} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-black">🌐</span>
            <Link
              to="#"
              className="text-black hover:text-[#1dbf73] font-medium"
            >
              English
            </Link>
          </div>
          <Link to="#" className="text-black hover:text-[#1dbf73] font-medium">
            Become a Seller
          </Link>
          {isSignedIn ? (
            <div className="w-[48px] h-[48px] flex items-center justify-center rounded-full border-2 border-cyan-500 bg-cyan-100 shadow-md">
              <UserButton />
            </div>
          ) : (
            <>
              <SignInButton mode="modal">
                <div className="cursor-pointer text-black hover:text-[#1dbf73] font-medium">
                  Sign in
                </div>
              </SignInButton>

              <SignUpButton mode="modal">
                <div className="cursor-pointer text-gray-800 bg-white rounded-2xl px-5 py-1.5 font-medium border border-gray-800 hover:text-white hover:bg-gray-800 transition-all duration-200">
                  Join
                </div>
              </SignUpButton>
            </>
          )}
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-white">
          <nav className="flex flex-col gap-4">
            <Link
              to="#features"
              className="text-sm font-medium hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="#testimonials"
              className="text-sm font-medium hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              to="#pricing"
              className="text-sm font-medium hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="#faq"
              className="text-sm font-medium hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            //cu
            {isSignedIn ? (
              <div className="w-[48px] h-[48px] flex items-center justify-center rounded-full border-2 border-cyan-500 bg-cyan-100 shadow-md">
                <UserButton />
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center text-gray-700"
                  >
                    Log in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="justify-center">
                    Sign up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
