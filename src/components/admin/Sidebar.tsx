"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CheckCircle, AlertTriangle, FolderTree, Receipt, Search, X, Zap } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");

  const sidebarLinks: SidebarLink[] = [
    {
      title: "Tổng quan",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Quản lý người bán",
      href: "/admin/seller-management",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Duyệt dịch vụ",
      href: "/admin/gig-approval",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      title: "Quảng cáo việc làm",
      href: "/admin/hot-job-ads",
      icon: <Zap className="h-5 w-5" />,
    },
    // {
    //   title: "Phản hồi người dùng",
    //   href: "/admin/user-feedback",
    //   icon: <MessageSquare className="h-5 w-5" />,
    // },
    // {
    //   title: "Quyền người dùng",
    //   href: "/admin/user-permission",
    //   icon: <Shield className="h-5 w-5" />,
    // },
    {
      title: "Báo cáo vi phạm",
      href: "/admin/violation-report",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      title: "Danh mục",
      href: "/admin/category-management",
      icon: <FolderTree className="h-5 w-5" />,
    },
    // {
    //   title: "Quản lý thẻ",
    //   href: "/admin/tag-management",
    //   icon: <Tags className="h-5 w-5" />,
    // },
    // {
    //   title: "Tài khoản quản trị",
    //   href: "/admin/accounts",
    //   icon: <UserCog className="h-5 w-5" />,
    // },
    {
      title: "Lịch sử giao dịch",
      href: "/admin/transaction-history",
      icon: <Receipt className="h-5 w-5" />,
    },
  ];

  const filteredLinks = sidebarLinks.filter((link) =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">
                Bảng điều khiển
              </span>
            </div>
            <button
              className="text-white hover:text-gray-200 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-4 space-y-1">
              {filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === link.href
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    className={`mr-3 ${
                      location.pathname === link.href
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  >
                    {link.icon}
                  </div>
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex items-center h-[72px] px-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <span className="text-xl font-bold text-white">
                Bảng điều khiển
              </span>
            </div>

            {/* Search bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-4 space-y-1">
                {filteredLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      location.pathname === link.href
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div
                      className={`mr-3 ${
                        location.pathname === link.href
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    >
                      {link.icon}
                    </div>
                    {link.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
