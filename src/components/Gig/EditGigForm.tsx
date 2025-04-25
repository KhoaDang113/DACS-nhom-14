import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaTrash, FaUpload } from 'react-icons/fa';

interface GigFormValues {
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  images: string[];
}

interface EditGigFormProps {
  initialValues: GigFormValues;
  onSubmit: (formData: FormData) => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Vui lòng nhập tiêu đề')
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(100, 'Tiêu đề không được quá 100 ký tự'),
  description: Yup.string()
    .required('Vui lòng nhập mô tả')
    .min(50, 'Mô tả phải có ít nhất 50 ký tự')
    .max(2000, 'Mô tả không được quá 2000 ký tự'),
  category: Yup.string().required('Vui lòng chọn danh mục'),
  price: Yup.number()
    .required('Vui lòng nhập giá')
    .min(5, 'Giá tối thiểu là $5')
    .max(10000, 'Giá tối đa là $10,000'),
  deliveryTime: Yup.number()
    .required('Vui lòng nhập thời gian hoàn thành')
    .min(1, 'Thời gian tối thiểu là 1 ngày')
    .max(30, 'Thời gian tối đa là 30 ngày'),
});

const categories = [
  'Graphic Design',
  'Digital Marketing',
  'Writing & Translation',
  'Video & Animation',
  'Music & Audio',
  'Programming & Tech',
  'Business',
  'Lifestyle',
];

const EditGigForm: React.FC<EditGigFormProps> = ({ initialValues, onSubmit }) => {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
        return isValidSize && isValidType;
      });

      setNewImages(prev => [...prev, ...validFiles]);
      
      // Create preview URLs
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleDeleteImage = (index: number, isNewImage: boolean) => {
    if (isNewImage) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      setImagesToDelete(prev => [...prev, initialValues.images[index]]);
    }
  };

  const handleSubmit = (values: GigFormValues) => {
    const formData = new FormData();
    
    // Append form values with correct type conversion
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('price', values.price.toString());
    formData.append('deliveryTime', values.deliveryTime.toString());
    formData.append('images', JSON.stringify(values.images));
    
    newImages.forEach(file => {
      formData.append('newImages', file);
    });
    
    imagesToDelete.forEach(url => {
      formData.append('imagesToDelete', url);
    });

    onSubmit(formData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched }) => (
        <Form className="space-y-6">
          {/* Tiêu đề */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Tiêu đề dịch vụ
            </label>
            <Field
              type="text"
              name="title"
              id="title"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.title && touched.title ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả chi tiết
            </label>
            <Field
              as="textarea"
              name="description"
              id="description"
              rows={6}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.description && touched.description ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Danh mục */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Danh mục
            </label>
            <Field
              as="select"
              name="category"
              id="category"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.category && touched.category ? 'border-red-500' : ''
              }`}
            >
              <option value="">Chọn danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Field>
            <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Giá */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Giá dịch vụ ($)
            </label>
            <Field
              type="number"
              name="price"
              id="price"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.price && touched.price ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Thời gian hoàn thành */}
          <div>
            <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700">
              Thời gian hoàn thành (ngày)
            </label>
            <Field
              type="number"
              name="deliveryTime"
              id="deliveryTime"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.deliveryTime && touched.deliveryTime ? 'border-red-500' : ''
              }`}
            />
            <ErrorMessage name="deliveryTime" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Ảnh hiện tại */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ảnh hiện tại
            </label>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {initialValues.images && initialValues.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Gig image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {!imagesToDelete.includes(image) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index, false)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Thêm ảnh mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thêm ảnh mới
            </label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click để tải lên</span> hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Preview ảnh mới */}
          {previewUrls.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preview ảnh mới
              </label>
              <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`New image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index, true)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nút cập nhật */}
          <div className="pt-5">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cập nhật dịch vụ
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditGigForm;
