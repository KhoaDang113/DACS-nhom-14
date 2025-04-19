import React from 'react';
import { Briefcase } from 'lucide-react';
import SellerGigManager from '../components/Gig/SellerGigManager';

const SellerGigsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            Quản lý Dịch vụ của Bạn
          </h1>
        </div>

        <div className="bg-white shadow-xl rounded-3xl p-8 transition hover:shadow-2xl duration-300">
          <SellerGigManager />
        </div>
      </div>
    </div>
  );
};

export default SellerGigsPage;
