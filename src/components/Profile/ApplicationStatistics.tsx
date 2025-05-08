import { useMemo } from 'react';
import { getApplicationsStats } from '../../lib/applicationsData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const ApplicationStatistics = () => {
  // Lấy thống kê từ dữ liệu mẫu
  const stats = useMemo(() => getApplicationsStats(), []);

  // Chuẩn bị dữ liệu cho biểu đồ tròn (status)
  const statusData = [
    { name: 'Đang chờ duyệt', value: stats.pending, color: '#3b82f6' }, // blue-500
    { name: 'Được chấp nhận', value: stats.accepted, color: '#22c55e' }, // green-500
    { name: 'Bị từ chối', value: stats.rejected, color: '#ef4444' }, // red-500
  ];

  // Chuẩn bị dữ liệu cho biểu đồ cột (phân loại theo ngành)
  const categoryData = stats.categoryStats.map(cat => ({
    name: cat.name,
    Ứng_tuyển: cat.count,
    Thành_công: cat.accepted,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Thống kê ứng tuyển</h2>
        
        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-xs font-medium mb-1">TỔNG ỨNG TUYỂN</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-500 text-xs font-medium mb-1">ĐANG CHỜ DUYỆT</p>
            <p className="text-2xl font-bold text-blue-700">{stats.pending}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-500 text-xs font-medium mb-1">ĐƯỢC CHẤP NHẬN</p>
            <p className="text-2xl font-bold text-green-700">{stats.accepted}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-500 text-xs font-medium mb-1">BỊ TỪ CHỐI</p>
            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
          </div>
        </div>

        {/* Tỷ lệ thành công */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Tỷ lệ thành công</span>
            <span className="text-lg font-semibold text-green-600">{stats.successRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${stats.successRate}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.accepted} / {stats.total} công việc đã được chấp nhận
          </div>
        </div>

        {/* Biểu đồ phân bố trạng thái */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Phân bố trạng thái ứng tuyển</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} đơn`, name]}
                    separator=": "
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Ứng tuyển theo ngành nghề</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Ứng_tuyển" fill="#3b82f6" barSize={20} />
                  <Bar dataKey="Thành_công" fill="#22c55e" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê theo địa điểm */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Phân bố theo địa điểm</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.locationStats.map((location, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 font-medium">{location.name}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold text-gray-900">{location.count}</p>
                <p className="text-sm text-gray-500">đơn ứng tuyển</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lời khuyên */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-blue-800 font-medium mb-2">Lời khuyên cải thiện</h3>
        <ul className="text-sm text-blue-700 space-y-2 ml-5 list-disc">
          <li>Bạn đang có tỷ lệ chấp nhận {stats.successRate}% - cao hơn 5% so với mức trung bình.</li>
          <li>Tập trung ứng tuyển vào ngành {stats.categoryStats.sort((a, b) => b.accepted / b.count - a.accepted / a.count)[0]?.name} vì đây là ngành có tỷ lệ thành công cao nhất.</li>
          <li>{stats.unviewed > 0 ? `Có ${stats.unviewed} ứng tuyển chưa được nhà tuyển dụng xem.` : 'Tất cả ứng tuyển của bạn đã được xem.'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ApplicationStatistics;