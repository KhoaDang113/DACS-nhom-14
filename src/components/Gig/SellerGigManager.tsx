import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, Package, Edit, Trash2, Loader2 } from 'lucide-react';

interface Gig {
  id: number;
  title: string;
  description: string;
  media: [{ url: string; type: string }];
  status: 'approved' | 'hidden' | 'pending' | 'rejected';
  views: number;
  orders: number;
}

const SellerGigManager: React.FC = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const handleEdit = (id: any) => {
    navigate(`/edit-gigs/${id}`);
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Đang hoạt động</span>;
      case 'hidden':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Tạm dừng</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Bị từ chối</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Đang chờ duyệt</span>;
    }
  };

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

  return (
    <div>
      {gigs.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border border-dashed border-gray-300">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
            <Package className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chưa có dịch vụ nào</h3>
          <p className="mt-2 text-sm text-gray-500">
            Bạn chưa có dịch vụ nào. Hãy tạo dịch vụ đầu tiên của bạn!
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/create-gig')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Tạo dịch vụ mới
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Lượt xem
                  </div>
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center">
                    <Package className="w-4 h-4 mr-1" />
                    Đơn hàng
                  </div>
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gigs.map((gig) => (
                <tr key={gig.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 pl-4 pr-3">
                    <div className="flex items-center">
                      <div className="h-14 w-14 flex-shrink-0">
                        <img
                          className="h-14 w-14 rounded-md object-cover shadow-sm"
                          src={gig.media[0].url}
                          alt={gig.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 line-clamp-1 max-w-[180px]" title={gig.title}>
                          {gig.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2 max-w-[250px]" title={gig.description}>
                      {gig.description}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 text-center">
                    {gig.views}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 text-center">
                    {gig.orders}
                  </td>
                  <td className="px-3 py-4 text-center">
                    {getStatusBadge(gig.status)}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 text-right">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleEdit(gig.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none transition"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(gig.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none transition"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerGigManager;
