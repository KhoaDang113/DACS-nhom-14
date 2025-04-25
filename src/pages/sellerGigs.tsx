import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import SellerGigManager from '../components/Gig/SellerGigManager';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
// import axios from 'axios';

const SellerGigsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-100">
      {/* Top Navigation Bar */}
      <div className="container mx-auto px-4 sm:px-8 py-4">
        <div className="flex items-center h-10">
          <div className="bg-blue-50 hover:bg-blue-100 rounded-md transition duration-300">
            <Link to="/dashboard" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
              <FaArrowLeft className="mr-2" />
              <span className="font-medium">Quay lại</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 sm:p-3 rounded-full">
                <Briefcase className="w-5 h-5 sm:w-7 sm:h-7 text-indigo-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Dịch vụ của bạn
              </h1>
            </div>
            
            <Link 
              to="/create-gig" 
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo dịch vụ mới</span>
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="border-b border-gray-100 p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Danh sách dịch vụ</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Quản lý tất cả dịch vụ bạn đã đăng trên trang web</p>
            </div>          
            <div className="p-4 sm:p-5">
              <SellerGigManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerGigsPage;
