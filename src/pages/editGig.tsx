import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import EditGigForm from '../components/Gig/EditGigForm';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditGigsPage: React.FC = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = React.useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    deliveryTime: 0,
    images: []
  });

  React.useEffect(() => {
    const fetchGigData = async () => {
      try {
        const response = await axios.get(`/api/gigs/${gigId}`);
        setInitialValues(response.data);
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = error.response?.data?.message || 'Không thể tải dữ liệu dịch vụ';
        toast.error(errorMessage);
        navigate('/seller-gigs');
      }
    };

    if (gigId) {
      fetchGigData();
    }
  }, [gigId, navigate]);

  const handleSubmit = async (formData: FormData) => {
    try {
      await axios.put(`/api/gigs/${gigId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Cập nhật dịch vụ thành công');
      navigate('/seller-gigs');
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response?.data?.message || 'Cập nhật dịch vụ thất bại';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
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
        
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white shadow-lg rounded-xl border border-gray-100">
          <div className="border-b border-gray-100 p-4 sm:p-5">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Chỉnh sửa dịch vụ</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Cập nhật thông tin dịch vụ của bạn</p>
          </div>          
          <div className="p-4 sm:p-5">
            <EditGigForm 
              initialValues={initialValues}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGigsPage;
