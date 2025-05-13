import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/admin/Card";
import { Eye, CheckCircle, Users, AlertTriangle, Bell } from "lucide-react";
import {
  getDashboardStats,
  DashboardStats,
} from "../../lib/services/adminDashboardService";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            <div
              className={`flex items-center mt-1 text-sm ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{change}</span>
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
  // Lấy tổng số dịch vụ xem từ API (nếu API có cung cấp)
  const getTotalViewsFromStats = () => {
    if (!stats) return 0;
    // Đây là dữ liệu thực tế từ API, không còn sử dụng ước lượng nữa
    const totalViews = stats.gigsByMonth.reduce(
      (sum, month) => sum + month.count,
      0
    );
    return totalViews;
  };
  // Lấy tỷ lệ thay đổi giữa tháng hiện tại và tháng trước
  const getChangeRate = (
    dataByMonth: { _id: number; count: number }[],
    isReverse: boolean = false
  ) => {
    // Nếu không có đủ dữ liệu, trả về "Dữ liệu mới"
    if (!dataByMonth || dataByMonth.length < 2)
      return { value: "Dữ liệu mới", isPositive: true };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() trả về 0-11
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    // Lấy dữ liệu của tháng hiện tại và tháng trước từ API
    const currentMonthData =
      dataByMonth.find((m) => m._id === currentMonth)?.count || 0;
    const previousMonthData =
      dataByMonth.find((m) => m._id === previousMonth)?.count || 0;

    // Nếu không có dữ liệu tháng nào, trả về "Chưa có dữ liệu"
    if (currentMonthData === 0 && previousMonthData === 0) {
      return { value: "Chưa có dữ liệu", isPositive: true };
    }

    // Nếu chỉ có dữ liệu tháng hiện tại mà không có tháng trước
    if (previousMonthData === 0 && currentMonthData > 0) {
      return { value: "Dữ liệu mới", isPositive: true };
    }

    // Tính tỷ lệ phần trăm thay đổi
    let changeRate = 0;
    if (previousMonthData !== 0) {
      changeRate =
        ((currentMonthData - previousMonthData) / previousMonthData) * 100;

      // Giới hạn giá trị để không quá cực đoan
      if (changeRate > 1000) changeRate = 1000;
      if (changeRate < -100) changeRate = -100;
    }

    const isPositive = isReverse ? changeRate <= 0 : changeRate >= 0;

    return {
      value: `${isPositive ? "+" : ""}${changeRate.toFixed(
        1
      )}% so với tháng trước`,
      isPositive,
    };
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Tính toán các giá trị từ stats
  const totalViews = getTotalViewsFromStats();
  const totalGigs = stats?.gigs.find((g) => g._id === "active")?.count || 0;
  const totalFreelancers =
    stats?.users.find((u) => u._id === "seller")?.count || 0;
  const totalPending = stats?.gigs.find((g) => g._id === "pending")?.count || 0;

  // Tính tỷ lệ thay đổi
  const viewsChange = getChangeRate(stats?.gigsByMonth || []);
  const gigsChange = getChangeRate(stats?.gigsByMonth || []);
  const freelancersChange = getChangeRate(stats?.usersByMonth || []);
  const pendingChange = getChangeRate(stats?.gigsByMonth || [], true);

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
          <p className="text-red-500">{error}</p>
          <button
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Lượt xem dịch vụ"
            value={formatNumber(totalViews)}
            change={viewsChange.value}
            isPositive={viewsChange.isPositive}
            icon={<Eye className="h-6 w-6 text-gray-500" />}
          />
          <StatCard
            title="Dịch vụ hoạt động"
            value={formatNumber(totalGigs)}
            change={gigsChange.value}
            isPositive={gigsChange.isPositive}
            icon={<CheckCircle className="h-6 w-6 text-gray-500" />}
          />
          <StatCard
            title="Người bán hoạt động"
            value={formatNumber(totalFreelancers)}
            change={freelancersChange.value}
            isPositive={freelancersChange.isPositive}
            icon={<Users className="h-6 w-6 text-gray-500" />}
          />
          <StatCard
            title="Chờ phê duyệt"
            value={formatNumber(totalPending)}
            change={pendingChange.value}
            isPositive={pendingChange.isPositive}
            icon={<AlertTriangle className="h-6 w-6 text-gray-500" />}
          />
        </div>
      )}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Phân tích lượt xem dịch vụ theo tháng</CardTitle>
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
                  <div className="h-full flex items-end space-x-2 pt-8">
                    {stats.gigsByMonth.map((month) => {
                      // Tìm giá trị cao nhất làm chuẩn để tính chiều cao
                      const maxValue = Math.max(
                        ...stats.gigsByMonth.map((m) => m.count)
                      );
                      // Tính chiều cao phần trăm với ít nhất là 5% để các cột luôn hiển thị
                      const heightPercent =
                        maxValue > 0
                          ? Math.max((month.count / maxValue) * 100, 5)
                          : 5;

                      // Chọn màu dựa trên tháng hiện tại
                      const currentMonth = new Date().getMonth() + 1;
                      const isCurrentMonth = month._id === currentMonth;
                      const bgColorClass = isCurrentMonth
                        ? "bg-blue-600"
                        : "bg-blue-400";

                      return (
                        <div
                          key={month._id}
                          className="flex flex-col items-center flex-1"
                        >
                          <div className="relative w-full">
                            <div
                              className={`w-full ${bgColorClass} rounded-t-md hover:opacity-80 transition-all duration-300`}
                              style={{ height: `${heightPercent}%` }}
                            ></div>
                            {/* Hiển thị giá trị trên cột */}
                            <div className="absolute -top-6 w-full text-center">
                              <span className="text-xs font-semibold">
                                {month.count}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs mt-2 font-medium">{`Tháng ${month._id}`}</p>
                        </div>
                      );
                    })}
                  </div>
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
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
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
                <div className="text-2xl font-bold">
                  {formatNumber(
                    stats?.users.reduce((sum, role) => sum + role.count, 0) || 0
                  )}
                </div>
                <p
                  className={`text-sm ${
                    getChangeRate(stats?.usersByMonth || []).isPositive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getChangeRate(stats?.usersByMonth || []).value}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Báo cáo vi phạm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(
                    stats?.complaints.reduce(
                      (sum, status) => sum + status.count,
                      0
                    ) || 0
                  )}
                </div>
                <p
                  className={`text-sm ${
                    getChangeRate(stats?.complaintsByMonth || [], true)
                      .isPositive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getChangeRate(stats?.complaintsByMonth || [], true).value}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tổng dịch vụ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(
                    stats?.gigs.reduce(
                      (sum, status) => sum + status.count,
                      0
                    ) || 0
                  )}
                </div>
                <p
                  className={`text-sm ${
                    getChangeRate(stats?.gigsByMonth || []).isPositive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getChangeRate(stats?.gigsByMonth || []).value}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
