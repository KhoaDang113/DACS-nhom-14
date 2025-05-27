"use client";

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Menu, Bell, Search, Command } from "lucide-react";
import Sidebar from "../Admin/Sidebar";

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>

                {/* Search bar */}
                <div className="hidden sm:block relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="w-full pl-10 pr-12 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 bg-gray-100 rounded">
                      <Command className="h-3 w-3" />K
                    </kbd>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Notification button with badge */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full">
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">3</span>
                  </span>
                  <Bell className="h-4 w-4" />
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-200" />

                {/* User button */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-cyan-500 bg-cyan-100 shadow-md">
                  <UserButton
                    afterSignOutUrl="/sign-in"
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
