import EditGigForm from "../components/Gig/EditGigForm";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaLightbulb, FaCheck } from "react-icons/fa";
import axios from "axios";

export default function EditGigPage() {
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/gigs/update/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        // Xử lý sau khi cập nhật thành công
        console.log('Cập nhật gig thành công');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật gig:', error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Navigation Bar */}
        <div className="container mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center h-10">
            <div className="bg-blue-50 hover:bg-blue-100 rounded-md transition duration-300">
              <Link to="/seller-gigs" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
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
                {/* Progress Steps */}
                <div className="mb-6 sm:mb-8">
                  <span className="text-lg sm:text-xl font-medium text-gray-800">Thông tin cơ bản</span>
                </div>
                <EditGigForm id={id!} onSubmit={handleSubmit} />
              </div>
            </div>

            {/* Right Column - Tips & Help */}
            <div className="w-full lg:w-[300px] flex-shrink-0"> 
              {/* Tips Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                <div className="flex items-center mb-4">
                  <FaLightbulb className="text-yellow-500 mr-2" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Mẹo để tạo dịch vụ thành công:
                  </h3>
                </div> 
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">
                      Sử dụng tiêu đề rõ ràng và hấp dẫn, tập trung vào nhu cầu của khách hàng.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">
                      Mô tả chi tiết vắn tắt về những gì bạn sẽ cung cấp trong dịch vụ của mình.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">
                      Thêm hình ảnh chất và video giới thiệu chi tiết nếu có thể.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">
                      Đưa ra mức giá hợp lý và cung cấp các gói dịch vụ khác nhau cho khách.
                    </span>
                  </li>
                </ul>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
