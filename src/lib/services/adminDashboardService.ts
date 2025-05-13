import apiClient from "../axios";

export interface DashboardStats {
  users: {
    _id: string;
    count: number;
  }[];
  gigs: {
    _id: string;
    count: number;
  }[];
  complaints: {
    _id: string;
    count: number;
  }[];
  usersByMonth: {
    _id: number;
    count: number;
  }[];
  gigsByMonth: {
    _id: number;
    count: number;
  }[];
  complaintsByMonth: {
    _id: number;
    count: number;
  }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get("/admin/dashboard");
  return response.data.data;
};

// Lấy tỷ lệ tăng/giảm so với tháng trước
export const calculateChangePercentage = (
  currentValue: number,
  previousValue: number
): string => {
  if (previousValue === 0) return "+100% so với tháng trước";

  const change = ((currentValue - previousValue) / previousValue) * 100;
  const isPositive = change >= 0;
  return `${isPositive ? "+" : ""}${change.toFixed(1)}% so với tháng trước`;
};

// Chuyển đổi số tháng thành tên tháng tiếng Việt
export const getMonthName = (month: number): string => {
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  return months[month - 1];
};
