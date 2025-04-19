import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Gig {
  id: number;
  title: string;
  description: string;
  media: [{ url: string; type: string }];
  status: 'approved' | 'hidden' | 'pending' | 'rejected'; // Thêm 'rejected' vào
  views: number;
  orders: number;
}

const SellerGigManager: React.FC = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const handleEdit = (id: any) => {
    navigate(`/edit-gigs/${id}`); // Chuyển hướng đến trang chỉnh sửa dịch vụ 
  }
  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/gigs/get-list', {
          withCredentials: true,
          params: {
            page: 1,
          },
        });
        if (response.data.error) {
          setError(response.data.message);
        } else {
          setGigs(response.data.gigs);
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa dịch vụ này?');
    if (confirmDelete) {
      setGigs(gigs.filter((gig) => gig.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">
        Quản lý dịch vụ
      </h1>

      {loading && <p className="text-center">Đang tải dữ liệu...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
        <table className="min-w-full bg-white text-sm text-gray-700 table-auto">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="p-4 text-left">Gig</th>
              <th className="p-4 text-left">Mô tả</th>
              <th className="p-4 text-center">Lượt xem</th>
              <th className="p-4 text-center">Đơn hàng</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {gigs.map((gig) => (
              <tr key={gig.id} className="border-t hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3 max-w-xs">
                  <img
                    src={gig.media[0].url}
                    alt={gig.title}
                    className="w-12 h-12 object-cover rounded-md shrink-0"
                  />
                  <div className="truncate max-w-[150px]" title={gig.title}>
                    <p className="font-medium truncate">{gig.title}</p>
                  </div>
                </td>
                <td className="p-4 max-w-sm truncate" title={gig.description}>
                  {gig.description}
                </td>
                <td className="p-4 text-center">{gig.views}</td>
                <td className="p-4 text-center">{gig.orders}</td>
                <td
                  className={`p-4 text-center font-semibold ${
                    gig.status === 'approved'
                      ? 'text-green-600'
                      : gig.status === 'hidden'
                      ? 'text-yellow-600'
                      : gig.status === 'rejected'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {gig.status === 'approved'
                    ? 'Đang hoạt động'
                    : gig.status === 'hidden'
                    ? 'Tạm dừng'
                    : gig.status === 'rejected'
                    ? 'Bị từ chối'
                    : 'Đang chờ duyệt'}
                </td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={()=>handleEdit(gig.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(gig.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerGigManager;
