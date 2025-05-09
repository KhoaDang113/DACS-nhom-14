import { Link, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gigId = queryParams.get("gigId");

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Thanh toán thành công!
      </h1>
      <p className="text-gray-600 mb-8">
        Cảm ơn bạn đã đặt dịch vụ. Đơn hàng của bạn đã được tạo và sẽ được xử lý
        sớm.
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

export default PaymentSuccess;
