import type React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/admin/Card";
import { Eye, CheckCircle, Users, AlertTriangle, Bell } from "lucide-react";

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
  return (
    <div className="space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="text-gray-500 mt-1">
          Tổng quan về thống kê và hoạt động của nền tảng của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Lượt xem dịch vụ"
          value="45,231"
          change="+20.1% so với tháng trước"
          isPositive={true}
          icon={<Eye className="h-6 w-6 text-gray-500" />}
        />
        <StatCard
          title="Dịch vụ hoạt động"
          value="2,350"
          change="+15.2% so với tháng trước"
          isPositive={true}
          icon={<CheckCircle className="h-6 w-6 text-gray-500" />}
        />
        <StatCard
          title="Người bán hoạt động"
          value="1,274"
          change="+4.3% so với tháng trước"
          isPositive={true}
          icon={<Users className="h-6 w-6 text-gray-500" />}
        />
        <StatCard
          title="Chờ phê duyệt"
          value="24"
          change="-12% so với tháng trước"
          isPositive={false}
          icon={<AlertTriangle className="h-6 w-6 text-gray-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Phân tích lượt xem dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Biểu đồ sẽ được hiển thị tại đây</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start space-x-4">
                  <div className="bg-gray-100 rounded-full p-2">
                    <Bell className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Dịch vụ mới đang chờ phê duyệt
                    </p>
                    <p className="text-xs text-gray-500">
                      John Doe • 2 giờ trước
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-sm text-green-600">+20.1% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Báo cáo vi phạm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-red-600">+8% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ chuyển đổi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-sm text-green-600">+1.2% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
