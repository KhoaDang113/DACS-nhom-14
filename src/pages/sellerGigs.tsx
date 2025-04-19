import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Loader2 } from 'lucide-react';
import SellerGigManager from '../components/Gig/SellerGigManager';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface GigStats {
  total: number;
  active: number;
  paused: number;
}

const SellerGigsPage: React.FC = () => {
  const [stats, setStats] = useState<GigStats>({
    total: 0,
    active: 0,
    paused: 0
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGigStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/gigs/stats', {
          withCredentials: true
        });
        
        if (response.data && !response.data.error) {
          setStats({
            total: response.data.totalGigs || 0,
            active: response.data.activeGigs || 0,
            paused: response.data.pausedGigs || 0
          });
        }
      } catch (error) {
        console.error('Error fetching gig statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGigStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Briefcase className="w-7 h-7 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý Dịch vụ của Bạn
            </h1>
          </div>
          
          <Link 
            to="/create-gig" 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo dịch vụ mới</span>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-xl border border-gray-100">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-xl font-semibold text-gray-700">Danh sách dịch vụ</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý tất cả dịch vụ bạn đang cung cấp</p>
          </div>
          
          <div className="p-5">
            <SellerGigManager />
          </div>
        </div>

        {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 animate-pulse">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="p-2 bg-gray-200 rounded-full">
                      <div className="w-3 h-3 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700">Tổng quan</h3>
                  <div className="p-2 bg-green-100 rounded-full">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{stats.total}</p>
                <p className="text-sm text-gray-500">Tổng số dịch vụ</p>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700">Đang hoạt động</h3>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{stats.active}</p>
                <p className="text-sm text-gray-500">Dịch vụ đang sẵn sàng</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700">Tạm dừng</h3>
                  <div className="p-2 bg-amber-100 rounded-full">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{stats.paused}</p>
                <p className="text-sm text-gray-500">Dịch vụ đang tạm dừng</p>
              </div>
            </>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default SellerGigsPage;
