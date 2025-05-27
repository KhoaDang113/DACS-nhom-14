"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/admin/Button";
import Input from "../../components/ui/admin/Input";
import { Image } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const CreateHotJobAd: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cta, setCta] = useState<string>("Khám phá ngay");
  const [ctaLink, setCtaLink] = useState<string>("#");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { getToken } = useAuth();
  // Xử lý upload ảnh
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xác thực form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title || title.length > 50)
      newErrors.title = "Tiêu đề không được để trống và tối đa 50 ký tự";
    if (!description || description.length > 150)
      newErrors.description = "Mô tả không được để trống và tối đa 150 ký tự";
    if (!imageFile && !imageUrl)
      newErrors.imageUrl = "Vui lòng upload hình ảnh banner";
    if (!cta) newErrors.cta = "Vui lòng nhập nút kêu gọi hành động";
    if (!ctaLink) newErrors.ctaLink = "Vui lòng nhập đường dẫn CTA";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Tạo FormData để gửi cả file hình ảnh
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("cta", cta);
      formData.append("ctaLink", ctaLink);

      if (imageFile) {
        formData.append("file", imageFile);
      }
      const token = await getToken();
      // Gọi API tạo banner
      const response = await axios.post(
        "http://localhost:5000/api/admin/job-banner/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Kiểm tra kết quả
      if (response.data.status === "success") {
        // Chuyển hướng sau khi tạo thành công
        navigate("/admin/job-banners");
        // Hiển thị thông báo thành công trong thực tế
      }
    } catch (error) {
      console.error("Lỗi khi tạo banner:", error);
      // Hiển thị thông báo lỗi trong thực tế
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold">Tạo Banner Job</h1>
        <p className="text-gray-500 mt-1">
          Tạo Banner Job nổi bật để thu hút nhiều người dùng hơn
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form bên trái */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tiêu đề banner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề banner <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Ví dụ: Thiết kế logo chuyên nghiệp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                  error={errors.title}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {title.length}/50 ký tự
                </p>
              </div>

              {/* Mô tả ngắn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full rounded-md border ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  } py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  placeholder="Ví dụ: Nhanh - đẹp - giá tốt"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={150}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {description.length}/150 ký tự
                </p>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* CTA Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nút kêu gọi hành động (CTA){" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Ví dụ: Khám phá ngay"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  maxLength={20}
                  error={errors.cta}
                />
              </div>

              {/* CTA Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đường dẫn CTA <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Ví dụ: /services/design"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  error={errors.ctaLink}
                />
              </div>

              {/* Upload hình ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh banner <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>Upload ảnh</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">hoặc kéo thả vào đây</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG tối ưu 1200x400 px
                    </p>
                    {previewImage && (
                      <div className="mt-2">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mx-auto h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                )}
              </div>
            </form>
          </div>

          {/* Nút xác nhận */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/job-banners")}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Đăng quảng cáo
            </Button>
          </div>
        </div>

        {/* Xem trước bên phải */}
        <div className="lg:w-2/5 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Xem trước</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Banner preview */}
              <div className="relative">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Banner preview"
                      className="w-full aspect-[3/1] object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                    {/* Text overlay */}
                    <div className="absolute inset-0 flex flex-col justify-center px-6">
                      <div className="max-w-md text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                          {title || "Tiêu đề quảng cáo"}
                        </h3>
                        <p className="text-sm text-white/90 mb-4">
                          {description ||
                            "Mô tả ngắn về quảng cáo sẽ hiển thị ở đây"}
                        </p>
                        <a
                          href={ctaLink}
                          className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                          {cta || "Khám phá ngay"}
                        </a>
                      </div>
                    </div>

                    {/* <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Hot Job
                      </span>
                    </div> */}
                  </div>
                ) : (
                  <div className="w-full aspect-[3/1] bg-gray-100 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Preview ở các vị trí khác nhau */}
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-700">
                Quảng cáo sẽ xuất hiện tại:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm">Vị trí nổi bật trên trang chủ</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm">Đầu danh sách tìm kiếm</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm">Khu vực "Job Hot" ở sidebar</span>
                </div>
              </div>
            </div>

            {/* Thông tin thêm */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Lưu ý:</h3>
              <ul className="mt-2 text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Quảng cáo sẽ được kiểm duyệt trước khi hiển thị</li>
                <li>Nội dung không phù hợp sẽ bị từ chối</li>
                <li>
                  Banner nên có kích thước 1200x400px để hiển thị tốt nhất
                </li>
                <li>Thời gian hiển thị bắt đầu sau khi quảng cáo được duyệt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHotJobAd;
