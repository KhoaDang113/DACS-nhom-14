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
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your Fiverr-like platform statistics and activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Gig Views"
          value="45,231"
          change="+20.1% from last month"
          isPositive={true}
          icon={<Eye className="h-6 w-6 text-gray-500" />}
        />
        <StatCard
          title="Active Gigs"
          value="2,350"
          change="+15.2% from last month"
          isPositive={true}
          icon={<CheckCircle className="h-6 w-6 text-gray-500" />}
        />
        <StatCard
          title="Active Sellers"
          value="1,274"
          change="+4.3% from last month"
          isPositive={true}
          icon={<Users className="h-6 w-6 text-gray-500" />}
        />
        <StatCard
          title="Pending Approvals"
          value="24"
          change="-12% from last month"
          isPositive={false}
          icon={<AlertTriangle className="h-6 w-6 text-gray-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gig Views Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
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
                      New gig submitted for approval
                    </p>
                    <p className="text-xs text-gray-500">
                      John Doe • 2 hours ago
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
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-sm text-green-600">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violation Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-red-600">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-sm text-green-600">+1.2% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
