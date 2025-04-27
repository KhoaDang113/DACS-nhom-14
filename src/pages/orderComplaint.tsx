import OrderComplaintForm from "../components/Report/OrderComplaintForm";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaLightbulb, FaCheck } from "react-icons/fa";

export default function OrderComplaintPage() {
  return (
    <div className="min-h-screen bg-blue-100">
      {/* Top Navigation Bar */}
      <div className="container mx-auto px-4 sm:px-8 py-4">
        <div className="flex items-center h-10">
          <div className="bg-blue-50 hover:bg-blue-100 rounded-md transition duration-300">
            <Link to="/orders" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
              <FaArrowLeft className="mr-2" />
              <span className="font-medium">Quay lại</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Form */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="mb-6 sm:mb-8">
                <span className="text-lg sm:text-xl font-medium text-gray-800">Gửi khiếu nại</span>
              </div>
              <OrderComplaintForm />
            </div>
          </div>

          {/* Right Column - Tips & Help */}
          <div className="w-full lg:w-[300px] flex-shrink-0"> 
            {/* Tips Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <div className="flex items-center mb-4">
                <FaLightbulb className="text-yellow-500 mr-2" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Mẹo để gửi khiếu nại hiệu quả:
                </h3>
              </div> 
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">
                    Mô tả vấn đề một cách rõ ràng và chi tiết.
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">
                    Cung cấp đầy đủ thông tin về đơn hàng và thời gian xảy ra sự cố.
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">
                    Đính kèm bằng chứng như hình ảnh, tin nhắn, hoặc tài liệu liên quan.
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">
                    Nêu rõ mong muốn giải quyết của bạn một cách hợp lý.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
