import EditGigForm from "../components/Gig/EditGigForm";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
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
    <div className="min-h-screen bg-blue-100 w-full">
      <div className="w-full px-2 sm:max-w-[1400px] sm:mx-auto sm:px-0">
        <div className="w-full px-2 sm:px-8 py-4">
          <div className="flex items-center h-10">
            <div className="bg-blue-50 hover:bg-blue-100 rounded-md transition duration-300">
              <Link to="/seller-gigs" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                <FaArrowLeft className="mr-2" />
                <span className="font-medium">Quay lại</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full px-2 sm:px-8 py-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="py-6 px-4 sm:px-8 border-b border-gray-200">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">Chỉnh sửa dịch vụ</h1>
            </div>
            <div className="p-4 sm:p-8">
              <EditGigForm id={id!} onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
