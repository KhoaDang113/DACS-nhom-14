import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaTrash, FaUpload } from 'react-icons/fa';

interface GigFormValues {
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  images: string[];
}

type Category = {
  _id: string;
  name: string;
  subcategories?: Category[];
};

interface EditGigFormProps {
  id: string; // Thêm `id` vào props để lấy Gig từ URL
  onSubmit: (formData: FormData) => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Vui lòng nhập tiêu đề').min(10, 'Tối thiểu 10 ký tự').max(100, 'Tối đa 100 ký tự'),
  description: Yup.string().required('Vui lòng nhập mô tả').min(50, 'Tối thiểu 50 ký tự').max(2000, 'Tối đa 2000 ký tự'),
  category: Yup.string().required('Vui lòng chọn danh mục'),
  price: Yup.number().required('Vui lòng nhập giá').min(1, 'Tối thiểu $1').max(50000, 'Tối đa $50,000'),
  deliveryTime: Yup.number().required('Vui lòng nhập thời gian').min(1, 'Ít nhất 1 ngày'),
});

const EditGigForm: React.FC<EditGigFormProps> = ({ id, onSubmit }) => {
  const [initialValues, setInitialValues] = useState<GigFormValues | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/gigs/${id}/get-single-gig`, {
          withCredentials: true,
        });
        const gig = res.data.gig;
        console.log(res.data.gig);
        const formattedGig: GigFormValues = {
          title: gig.title,
          description: gig.description,
          category: gig.category_id,
          price: gig.price.$numberDecimal ? parseFloat(gig.price.$numberDecimal) : 0,
          deliveryTime: gig.duration || 0, // Lưu ý bạn có 'duration' trong dữ liệu nhưng 'deliveryTime' trong form
          images: gig.media.map(item => item.url), // Chỉ lấy URLs từ media
        };
        setInitialValues(formattedGig);
      } catch (error) {
        console.error("Không thể lấy dữ liệu gig:", error);
      }
    };

    fetchGigData();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/category");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Không thể lấy danh sách danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  if (!initialValues) return <div>Đang tải dữ liệu...</div>; // Hiển thị khi dữ liệu chưa được tải xong

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isValidSize = file.size <= 5 * 1024 * 1024;
        const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
        return isValidSize && isValidType;
      });
      setNewImages(prev => [...prev, ...validFiles]);
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const handleDeleteImage = (index: number, isNew: boolean) => {
    if (isNew) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      setImagesToDelete(prev => [...prev, initialValues.images[index]]);
    }
  };

 // In EditGigForm.tsx
const handleSubmit = (values: GigFormValues) => {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("category_id", values.category); // Changed from 'category'
  formData.append("price", values.price.toString());
  formData.append("duration", values.deliveryTime.toString()); // Changed from 'deliveryTime'

  // Combine existing images (excluding deleted ones) with new images
  newImages.forEach((file) => formData.append("files", file));

  onSubmit(formData);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Chỉnh sửa dịch vụ</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values }) => (
              <Form className="space-y-8">
                {/* Tiêu đề và mô tả */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                    <Field
                      name="title"
                      type="text"
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <Field
                      name="description"
                      as="textarea"
                      rows={5}
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Danh mục, giá, thời gian */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <optgroup key={cat._id} label={cat.name}>
                          {cat.subcategories?.length ? (
                            cat.subcategories.map((child) => (
                              <option key={child._id} value={child._id}>
                                {child.name}
                              </option>
                            ))
                          ) : (
                            <option value={cat._id}>{cat.name}</option>
                          )}
                        </optgroup>
                      ))}
                    </Field>
                    <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá ($)</label>
                    <Field
                      name="price"
                      type="number"
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (ngày)</label>
                    <Field
                      name="deliveryTime"
                      type="number"
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage name="deliveryTime" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Hình ảnh */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hình ảnh hiện tại */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh hiện tại</label>
                    <div className="grid grid-cols-2 gap-4">
                      {values.images
                        .filter(img => !imagesToDelete.includes(img))
                        .map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={img} alt="Old" className="w-full h-28 object-cover rounded-md" />
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(idx, false)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Ảnh mới upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh mới thêm</label>
                    <div className="grid grid-cols-2 gap-4">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img src={url} alt="Preview" className="w-full h-28 object-cover rounded-md" />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(idx, true)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center space-x-2 cursor-pointer text-indigo-600 hover:text-indigo-800">
                        <FaUpload />
                        <span>Chọn ảnh</span>
                        <input
                          type="file"
                          accept="image/jpeg, image/png"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition"
                  >
                    Cập nhật dịch vụ
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditGigForm;
