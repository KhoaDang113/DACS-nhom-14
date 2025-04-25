import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface Gig {
  _id: string;
  title: string;
  description: string;
  category_id: string;
  price: number;
  media: [{ url: string; type: string }];
  views: number;
  ordersCompleted: number;
}

const EditGig: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchGig = async () => {
      if (!id) {
        setError('Không tìm thấy ID dịch vụ');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/gigs/${id}/get-single-gig`, {
          withCredentials: true
        });
        
        if (response.data.error) {
          setError(response.data.message);
        } else {
          setGig(response.data.gig);
          console.log('Dữ liệu gig:', response.data.gig);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError('Lỗi khi tải dữ liệu dịch vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="flex items-center justify-center">
          <span className="mr-2">⚠️</span> {error}
        </p>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Không tìm thấy dịch vụ</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa dịch vụ</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input
            type="text"
            value={gig.title}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            value={gig.description}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Giá</label>
          <input
            type="number"
            value={gig.price}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Lượt xem</p>
            <p className="text-lg font-semibold">{gig.views}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Đơn hàng đã hoàn thành</p>
            <p className="text-lg font-semibold">{gig.ordersCompleted}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGig; 