import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Gig {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: string;
}

interface Category {
  _id: string;
  name: string;
  children?: Category[];
}

const EditGig: React.FC = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const navigate = useNavigate();
  const [gig, setGig] = useState<Gig>({
    id: 0,
    title: '',
    price: 0,
    images: [],
    category: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Giả lập dữ liệu ban đầu nếu khớp gigId
    const fetchedGig = {
      id: 1,
      title: 'Thiết kế logo',
      price: 50,
      images: ['/images/logo-design.jpg'],
      category: 'Design',
    };

    if (gigId && parseInt(gigId) === fetchedGig.id) {
      setGig(fetchedGig);
    }

    // Gọi API category
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/category');
        setCategories(res.data.data);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };

    fetchCategories();
  }, [gigId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGig({ ...gig, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setGig({ ...gig, images: [...gig.images, ...files] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated gig:', gig);
    navigate('/seller-gigs');
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-blue-700">Chỉnh sửa dịch vụ</h1>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white p-10 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Mô tả</label>
          <textarea
            name="title"
            value={gig.title}
            onChange={handleInputChange}
            className="w-full border p-4 rounded-lg min-h-[150px]"
            placeholder="Nhập mô tả chi tiết về dịch vụ của bạn"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Giá</label>
          <input
            type="number"
            name="price"
            value={gig.price}
            onChange={handleInputChange}
            className="w-full border p-4 rounded-lg"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Danh mục</label>
          <select
            name="category"
            value={gig.category}
            onChange={handleInputChange}
            className="w-full border p-4 rounded-lg"
          >
            {categories.map((cat) => (
              <optgroup key={cat._id} label={cat.name}>
                {cat.children?.map((sub) => (
                  <option key={sub._id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Ảnh</label>
          <input type="file" multiple onChange={handleImageChange} className="w-full border p-4 rounded-lg" />
          <div className="mt-4 flex gap-4 flex-wrap">
            {gig.images.map((image, index) => (
              <img key={index} src={image} alt={`Gig ${index}`} className="w-32 h-32 object-cover rounded-md" />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default EditGig;
