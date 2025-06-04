import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card";
import { Eye, CheckCircle, Users, AlertTriangle, Bell } from "lucide-react";
import { getDashboardStats, DashboardStats } from "../../lib/services/adminDashboardService";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Màu sắc cho các biểu đồ
  const CHART_COLORS = {
    blue: '#36A2EB',
    green: '#4BC0C0',
    orange: '#FF9F40',
    purple: '#9966FF',
    red: '#FF5C5C',
    yellow: '#FFCC5C',
  };

  // Màu sắc cho biểu đồ Tổng dịch vụ
  const SERVICE_COLORS = {
    active: '#FF9F43',    // Cam đậm cho dịch vụ hoạt động
    pending: '#FFCC5C',   // Vàng cho dịch vụ chờ duyệt
    rejected: '#FF5C5C',  // Đỏ nhạt cho dịch vụ bị từ chối
    hidden: '#C3E6CB',    // Xanh lá nhạt cho dịch vụ ẩn
    default: '#0088FE'    // Xanh nhạt cho các trạng thái khác
  };
  
  // Màu sắc riêng cho biểu đồ Tổng người dùng
  const USER_COLORS = {
    seller: '#FFCC5C',    // Vàng cho người bán/freelancer
    buyer: '#4BC0C0',     // Xanh lá cho người mua/customer
    admin: '#36A2EB',     // Xanh dương cho quản trị viên
    default: '#9966FF'    // Tím cho các loại tài khoản khác
  };

  // Lấy tổng số dịch vụ xem từ API
  const getTotalViewsFromStats = () => {
    if (!stats) return 0;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() trả về 0-11
    
    // Lấy tổng lượt xem của tháng hiện tại
    const currentMonthViews = stats.gigsByMonth.find(m => m._id === currentMonth)?.count || 0;
    return currentMonthViews;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  // Hàm định dạng dữ liệu cho biểu đồ
  const prepareChartData = (dataByMonth: { _id: number; count: number }[]) => {
    if (!dataByMonth || dataByMonth.length === 0) return [];
    
    // Sắp xếp dữ liệu theo tháng
    return [...dataByMonth].sort((a, b) => a._id - b._id).map(item => ({
      month: `Tháng ${item._id}`,
      value: item.count,
      _id: item._id
    }));
  };

  // Chuẩn bị dữ liệu cho biểu đồ tròn phân loại người dùng
  const prepareUserRoleData = () => {
    if (!stats || !stats.users) return [];
    
    return stats.users.map(role => ({
      name: role._id === 'buyer' ? 'Người mua' : 
            role._id === 'seller' ? 'Người bán' : 
            role._id === 'admin' ? 'Quản trị viên' : role._id,
      value: role.count
    }));
  };

  // Chuẩn bị dữ liệu cho biểu đồ tròn trạng thái dịch vụ
  const prepareServiceStatusData = () => {
    if (!stats || !stats.gigs) return [];
    
    return stats.gigs.map(status => ({
      name: status._id === 'approved' ? 'Hoạt động' : 
            status._id === 'pending' ? 'Chờ duyệt' :
            status._id === 'rejected' ? 'Từ chối' : 
            status._id === 'hidden' ? 'Ẩn' : status._id,
      value: status.count,
      id: status._id
    }));
  };

  // Sửa hàm useEffect
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", err);
        setError("Không thể lấy dữ liệu từ server. Vui lòng thử lại sau.");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Thêm sự kiện lắng nghe khi tab trở thành active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Tính toán các giá trị từ stats
  const totalViews = getTotalViewsFromStats();
  const totalGigs = stats?.gigs.find((g) => g._id === "approved")?.count || 0;
  const totalFreelancers =
    stats?.users.find((u) => u._id === "seller")?.count || 0;
  const totalPending = stats?.gigs.find((g) => g._id === "pending")?.count || 0;

  // Chuẩn bị dữ liệu cho các biểu đồ
  const monthlyGigsData = prepareChartData(stats?.gigsByMonth || []);
  const userRoleData = prepareUserRoleData();
  const serviceStatusData = prepareServiceStatusData();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="text-gray-500 mt-1">
          Tổng quan về thống kê và hoạt động của nền tảng của bạn.
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-red-500">{error}</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Lượt tạo dịch vụ mới trong tháng"
            value={formatNumber(totalViews)}
            icon={<Eye className="h-6 w-6 text-gray-500" />}
          />
          <StatCard
            title="Số lượng dịch vụ hoạt động"
            value={formatNumber(totalGigs)}
            icon={<CheckCircle className="h-6 w-6 text-gray-500" />}
          />
          {/* <StatCard
            title="Người bán hoạt động"
            value={formatNumber(totalFreelancers)}
            icon={<Users className="h-6 w-6 text-gray-500" />}
          /> */}
          <StatCard
            title="Số lượng dịch vụ chờ phê duyệt"
            value={formatNumber(totalPending)}
            icon={<AlertTriangle className="h-6 w-6 text-gray-500" />}
          />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Phân tích số lượng dịch vụ mới theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-red-500">Không thể tải dữ liệu biểu đồ</p>
              </div>
            ) : (
              <div className="h-80">
                {stats?.gigsByMonth && stats.gigsByMonth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyGigsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} dịch vụ`, 'Số lượng dịch vụ']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Số lượng dịch vụ" 
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                      >
                        {monthlyGigsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry._id === currentMonth ? '#1d4ed8' : '#60a5fa'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      Chưa có dữ liệu thống kê theo tháng
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-red-500">Không thể tải dữ liệu hoạt động</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Hiển thị dịch vụ chờ phê duyệt gần đây */}
                {stats && stats.gigs ? (
                  (() => {
                    const pendingGigs = stats.gigs.find(
                      (g) => g._id === "pending"
                    );
                    if (pendingGigs && pendingGigs.count > 0) {
                      return (
                        <div className="flex items-start space-x-4">
                          <div className="bg-gray-100 rounded-full p-2">
                            <Bell className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {pendingGigs.count} dịch vụ đang chờ phê duyệt
                            </p>
                            <p className="text-xs text-gray-500">
                              Cập nhật gần nhất:{" "}
                              {new Date().toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <p className="text-gray-500">
                        Không có dịch vụ nào đang chờ phê duyệt
                      </p>
                    );
                  })()
                ) : (
                  <p className="text-gray-500">Không có hoạt động gần đây</p>
                )}

                {/* Hiển thị thông tin về báo cáo vi phạm nếu có */}
                {stats && stats.complaints && stats.complaints.length > 0 && (
                  <div className="flex items-start space-x-4 mt-4">
                    <div className="bg-gray-100 rounded-full p-2">
                      <AlertTriangle className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {stats.complaints.reduce(
                          (total, complaint) => total + complaint.count,
                          0
                        )}{" "}
                        báo cáo vi phạm
                      </p>
                      <p className="text-xs text-gray-500">
                        Cập nhật gần nhất:{" "}
                        {new Date().toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-100 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : error ? (
          <div className="col-span-3">
            <Card>
              <CardContent className="p-6">
                <p className="text-red-500">Không thể tải dữ liệu thống kê</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Tổng người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    {formatNumber(
                      stats?.users.reduce((sum, role) => sum + role.count, 0) || 0
                    )}
                  </div>
                </div>
                {userRoleData.length > 0 && (
                  <div className="h-52 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userRoleData.map(role => ({
                            ...role,
                            id: role.name === 'Người bán' ? 'seller' : 
                                role.name === 'Người mua' ? 'buyer' : 
                                role.name === 'Quản trị viên' ? 'admin' : 'default'
                          }))}
                          cx="50%"
                          cy="45%"
                          labelLine={true}
                          outerRadius={70}
                          fill="#0088FE"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {userRoleData.map((entry, index) => {
                            const id = entry.name === 'Người bán' ? 'seller' : 
                                      entry.name === 'Người mua' ? 'buyer' : 
                                      entry.name === 'Quản trị viên' ? 'admin' : 'default';
                            return (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={USER_COLORS[id as keyof typeof USER_COLORS]}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} người dùng`, '']}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{
                            paddingTop: '15px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Báo cáo vi phạm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    {formatNumber(
                      stats?.complaints.reduce(
                        (sum, status) => sum + status.count,
                        0
                      ) || 0
                    )}
                  </div>
                </div>
                {stats?.complaintsByMonth && stats.complaintsByMonth.length > 0 && (
                  <div className="h-52 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareChartData(stats.complaintsByMonth)}
                        margin={{
                          top: 10,
                          right: 10,
                          left: 10,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} báo cáo`, 'Số báo cáo']}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Báo cáo vi phạm"
                          stroke={CHART_COLORS.red}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tổng dịch vụ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    {formatNumber(
                      stats?.gigs.reduce(
                        (sum, status) => sum + status.count,
                        0
                      ) || 0
                    )}
                  </div>
                </div>
                {serviceStatusData.length > 0 && (
                  <div className="h-52 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceStatusData}
                          cx="50%"
                          cy="45%"
                          labelLine={true}
                          outerRadius={70}
                          fill="#0088FE"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {serviceStatusData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                SERVICE_COLORS[entry.id as keyof typeof SERVICE_COLORS] || 
                                SERVICE_COLORS.default
                              } 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} dịch vụ`, '']}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{
                            paddingTop: '15px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
