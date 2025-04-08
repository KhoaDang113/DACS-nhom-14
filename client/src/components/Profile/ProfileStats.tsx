interface ProfileStatsProps {
  stats: {
    completedProjects: number;
    ongoingProjects: number;
    totalEarnings: number;
    responseTime: string;
  };
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Dự án hoàn thành</p>
          <p className="text-2xl font-semibold text-gray-900">
            {stats.completedProjects}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Dự án đang thực hiện</p>
          <p className="text-2xl font-semibold text-gray-900">
            {stats.ongoingProjects}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Tổng thu nhập</p>
          <p className="text-2xl font-semibold text-green-600">
            ${stats.totalEarnings.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Thời gian phản hồi</p>
          <p className="text-2xl font-semibold text-gray-900">
            {stats.responseTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;