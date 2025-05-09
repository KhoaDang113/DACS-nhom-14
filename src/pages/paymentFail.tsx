import { Link, useLocation } from "react-router-dom";

const PaymentFailed = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gigId = queryParams.get("gigId");

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Thanh toán thất bại
      </h1>
      <p className="text-gray-600 mb-8">
        Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên
        hệ hỗ trợ.
      </p>
      {gigId ? (
        <Link
          to={`/gig/${gigId}`}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          Quay lại dịch vụ
        </Link>
      ) : (
        <Link
          to="/dashboard"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          Quay lại trang chính
        </Link>
      )}
    </div>
  );
};

export default PaymentFailed;
