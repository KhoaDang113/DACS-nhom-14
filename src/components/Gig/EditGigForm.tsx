import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlertCircle } from 'lucide-react';

interface GigFormValues {
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  images: string[];
}

type Subcategory = {
  _id: string;
  name: string;
  subcategoryChildren?: Subcategory[];
};

type Category = {
  _id: string;
  name: string;
  subcategories: Subcategory[];
};

interface EditGigFormProps {
  id: string;
  onSubmit: (formData: FormData) => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Vui lòng nhập tiêu đề').min(10, 'Tối thiểu 10 ký tự').max(100, 'Tối đa 100 ký tự'),
  description: Yup.string().required('Vui lòng nhập mô tả').min(50, 'Tối thiểu 50 ký tự').max(2000, 'Tối đa 2000 ký tự'),
  category: Yup.string().required('Vui lòng chọn danh mục'),
  price: Yup.number().required('Vui lòng nhập giá').min(1000, 'Tối thiểu 1000đ'),
  deliveryTime: Yup.number().required('Vui lòng nhập thời gian').min(1, 'Ít nhất 1 ngày'),
});

const EditGigForm: React.FC<EditGigFormProps> = ({ id, onSubmit }) => {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<GigFormValues | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/gigs/${id}/get-single-gig`, {
          withCredentials: true,
        });
        const gig = res.data.gig;
        const formattedGig: GigFormValues = {
          title: gig.title,
          description: gig.description,
          category: gig.category_id,
          price: gig.price.$numberDecimal ? parseFloat(gig.price.$numberDecimal) : 0,
          deliveryTime: gig.duration || 0,
          images: gig.media.map(item => item.url),
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

  if (!initialValues) return <div>Đang tải dữ liệu...</div>;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const validFiles: File[] = [];
    const validUrls: string[] = [];

    Array.from(e.target.files).forEach((file) => {
      if (!file.type.match(/image\/(jpeg|jpg|png)/i)) {
        setImageError("Chỉ chấp nhận ảnh JPG và PNG");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      validFiles.push(file);
      validUrls.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      setImageError(null);
      setNewImages(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...validUrls]);
    }
  };

  const handleDeleteImage = (index: number, isNew: boolean) => {
    if (isNew) {
      // Xóa URL đối tượng để tránh rò rỉ bộ nhớ
      URL.revokeObjectURL(previewUrls[index]);
      
      setNewImages(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      setImagesToDelete(prev => [...prev, initialValues.images[index]]);
    }
    
    // Kiểm tra nếu không còn ảnh nào
    const remainingOldImages = initialValues.images.filter(img => !imagesToDelete.includes(img)).length;
    const remainingNewImages = isNew ? newImages.length - 1 : newImages.length;
    
    if ((remainingOldImages + remainingNewImages) === 0) {
      setImageError("Vui lòng tải lên ít nhất một ảnh");
    }
  };

  const handleSubmit = async (values: GigFormValues) => {
    // Kiểm tra xem có ít nhất một ảnh không
    const remainingImages = values.images.filter(img => !imagesToDelete.includes(img)).length + newImages.length;
    
    if (remainingImages === 0) {
      setImageError("Vui lòng tải lên ít nhất một ảnh");
      return;
    }
    
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category_id", values.category);
    // Đảm bảo giá trị price là số nguyên
    const priceValue = parseInt(values.price.toString(), 10);
    formData.append("price", priceValue.toString());
    formData.append("duration", values.deliveryTime.toString());

    // Thêm danh sách ảnh cần xóa
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach((url) => {
        formData.append("imagesToDelete", url);
      });
    }

    // Thêm danh sách ảnh cũ cần giữ lại
    const remainingOldImages = values.images.filter(img => !imagesToDelete.includes(img));
    if (remainingOldImages.length > 0) {
      remainingOldImages.forEach(img => {
        formData.append("existingImages", img);
      });
    }

    // Thêm các ảnh mới
    if (newImages.length > 0) {
      newImages.forEach((file) => {
        formData.append("files", file);
      });
    }

    // Debug log
    console.log('Ảnh cần xóa:', imagesToDelete);
    console.log('Ảnh cũ giữ lại:', remainingOldImages);
    console.log('Ảnh mới:', newImages);

    // Log toàn bộ dữ liệu trong FormData
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await onSubmit(formData);
      toast.success('Cập nhật dịch vụ thành công!', {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/seller-gigs');
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật dịch vụ!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values }) => (
              <Form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Tiêu đề</label>
                    <Field
                      name="title"
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Mô tả</label>
                    <Field
                      name="description"
                      as="textarea"
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Danh mục</label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <React.Fragment key={cat._id}>
                          <option value="" disabled className="font-bold">
                            {cat.name}
                          </option>
                          
                          {cat.subcategories && cat.subcategories.map((sub) => (
                            <React.Fragment key={sub._id}>
                              <option value="" disabled className="font-bold">
                                {'\u00A0\u00A0'}{sub.name}
                              </option>
                              
                              {sub.subcategoryChildren && sub.subcategoryChildren.map((subChild) => (
                                <option key={subChild._id} value={subChild._id}>
                                  {'\u00A0\u00A0\u00A0\u00A0'}{subChild.name}
                                </option>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </Field>
                    <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Giá</label>
                    <Field
                      name="price"
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Thời gian (ngày)</label>
                    <Field
                      name="deliveryTime"
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                    <ErrorMessage name="deliveryTime" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Ảnh minh họa</h3>
                  
                  {imageError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {imageError}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Hiển thị ảnh hiện tại */}
                    {values.images
                      .filter(img => !imagesToDelete.includes(img))
                      .map((img, idx) => (
                        <div key={`existing-${idx}`} className="relative overflow-hidden rounded-md border shadow-sm">
                          <img 
                            src={img} 
                            alt={`Ảnh hiện tại ${idx + 1}`} 
                            className="aspect-video w-full object-cover" 
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(idx, false)}
                            className="absolute right-1 top-1 flex rounded-full bg-red-500 p-1 text-white shadow"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    
                    {/* Hiển thị preview ảnh mới */}
                    {previewUrls.map((url, idx) => (
                      <div key={`new-${idx}`} className="relative overflow-hidden rounded-md border shadow-sm">
                        <img 
                          src={url} 
                          alt={`Preview ${idx + 1}`} 
                          className="aspect-video w-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx, true)}
                          className="absolute right-1 top-1 flex rounded-full bg-red-500 p-1 text-white shadow"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Ô upload ảnh mới */}
                    <label
                      htmlFor="image-upload"
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed ${
                        imageError ? "border-red-300 bg-red-50" : "border-gray-300 hover:bg-gray-50"
                      } px-6 py-10 text-center text-sm ${
                        imageError ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      <FaUpload className={`mb-2 h-6 w-6 ${imageError ? "text-red-500" : "text-gray-500"}`} />
                      <p>Tải ảnh JPG/PNG (tối đa 5MB)</p>
                      <p className="text-xs mt-1">Vui lòng tải lên ít nhất một ảnh</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        multiple
                        className="hidden"
                        id="image-upload"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-6 flex justify-center">
                  <button type="submit" className="px-7 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
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