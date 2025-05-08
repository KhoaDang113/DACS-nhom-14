import { useState } from 'react';
import { sampleApplications, JobApplication } from '../../lib/applicationsData';
import { format } from 'date-fns';
import { ListFilter, BarChart } from 'lucide-react';
import ApplicationStatistics from './ApplicationStatistics';

const ProfileApplications = () => {
  const [applications] = useState<JobApplication[]>(sampleApplications);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'statistics'>('list');

  // Filter applications based on selected status
  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  // Status badge styling and icons
  const getStatusBadge = (status: JobApplication['status']) => {
    switch(status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            <span className="animate-spin">⏳</span> Đang chờ duyệt
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <span>✅</span> Được chấp nhận
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
            <span>❌</span> Bị từ chối
          </span>
        );
    }
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy - HH:mm');
  };

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm rounded-md transition ${
              filter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm rounded-md transition ${
              filter === 'pending'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
            }`}
          >
            Đang chờ duyệt
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 text-sm rounded-md transition ${
              filter === 'accepted'
                ? 'bg-green-700 text-white'
                : 'bg-green-50 hover:bg-green-100 text-green-700'
            }`}
          >
            Được chấp nhận
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 text-sm rounded-md transition ${
              filter === 'rejected'
                ? 'bg-red-700 text-white'
                : 'bg-red-50 hover:bg-red-100 text-red-700'
            }`}
          >
            Bị từ chối
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1 p-2 text-sm rounded-lg transition ${
              viewMode === 'list'
                ? 'bg-[#1dbf73] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label="Xem danh sách"
          >
            <ListFilter size={18} />
            <span className="hidden sm:inline">Danh sách</span>
          </button>
          <button
            onClick={() => setViewMode('statistics')}
            className={`flex items-center gap-1 p-2 text-sm rounded-lg transition ${
              viewMode === 'statistics'
                ? 'bg-[#1dbf73] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label="Xem thống kê"
          >
            <BarChart size={18} />
            <span className="hidden sm:inline">Thống kê</span>
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'statistics' ? (
        <ApplicationStatistics />
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {filteredApplications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Không có ứng tuyển nào trong danh mục này
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className="p-5 hover:bg-gray-50 transition">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-[#1dbf73] cursor-pointer">
                      {application.jobTitle}
                    </h3>
                    <div className="flex items-center gap-3">
                      {application.companyLogo && (
                        <img 
                          src={application.companyLogo} 
                          alt={application.companyName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <p className="text-sm text-gray-500">{application.companyName}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {application.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Ngày ứng tuyển: {formatDate(application.applyDate)}
                      </span>
                      {application.interviewDate && (
                        <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          Phỏng vấn: {formatDate(application.interviewDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    {getStatusBadge(application.status)}
                    <div className="text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(application.salary)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileApplications;