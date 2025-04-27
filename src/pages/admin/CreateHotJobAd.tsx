"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/admin/Button";
import Input from "../../components/ui/admin/Input";
import { 
  userJobs, 
  Job, 
  hotJobPackages, 
  formatCurrency 
} from "../../lib/hotJobData";
import { Calendar, Upload, Image, DollarSign } from "lucide-react";

const CreateHotJobAd: React.FC = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  // Xử lý khi chọn job
  useEffect(() => {
    if (selectedJob) {
      const selected = userJobs.find((job) => job._id === selectedJob);
      if (selected) {
        setJob(selected);
        // Đề xuất tiêu đề dựa trên job
        if (!title) {
          setTitle(selected.title);
        }
      }
    }
  }, [selectedJob, title]);

  // Xử lý khi chọn gói quảng cáo
  useEffect(() => {
    if (selectedPackage && startDate) {
      const pkg = hotJobPackages.find((p) => p.id === selectedPackage);
      if (pkg) {
        // Tự động tính ngày kết thúc dựa trên gói
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + pkg.duration);
        
        // Format để sử dụng cho input type date
        const formattedEnd = end.toISOString().split('T')[0];
        setEndDate(formattedEnd);
      }
    }
  }, [selectedPackage, startDate]);

  // Xử lý upload ảnh
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Trong thực tế, đây là nơi bạn sẽ upload ảnh lên server
      // Hiện tại chỉ tạo preview
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
    
    if (!selectedJob) newErrors.selectedJob = "Vui lòng chọn job cần quảng cáo";
    if (!title || title.length > 50) newErrors.title = "Tiêu đề không được để trống và tối đa 50 ký tự";
    if (!description || description.length > 150) newErrors.description = "Mô tả không được để trống và tối đa 150 ký tự";
    if (!imageUrl) newErrors.imageUrl = "Vui lòng upload hình ảnh banner";
    if (!startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!selectedPackage) newErrors.selectedPackage = "Vui lòng chọn gói quảng cáo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Giả lập API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/admin/hot-job-ads");
      // Hiển thị thông báo thành công trong thực tế
    }, 1000);
  };

  // Lấy thông tin gói quảng cáo
  const getPackageInfo = () => {
    if (!selectedPackage) return null;
    return hotJobPackages.find(pkg => pkg.id === selectedPackage);
  };

  const packageInfo = getPackageInfo();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold">Tạo Quảng Cáo Job Hot</h1>
        <p className="text-gray-500 mt-1">
          Tạo quảng cáo nổi bật cho job để thu hút nhiều người dùng hơn
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form bên trái */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Chọn Job */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn Job cần quảng cáo <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <option value="">-- Chọn job --</option>
                  {userJobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title} ({formatCurrency(job.price)})
                    </option>
                  ))}
                </select>
                {errors.selectedJob && (
                  <p className="mt-1 text-sm text-red-600">{errors.selectedJob}</p>
                )}
              </div>

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
                <p className="mt-1 text-xs text-gray-500">{title.length}/50 ký tự</p>
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
                <p className="mt-1 text-xs text-gray-500">{description.length}/150 ký tự</p>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
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
                    <p className="text-xs text-gray-500">PNG, JPG tối ưu 1200x400 px</p>
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

              {/* Thời gian chạy quảng cáo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                  error={errors.startDate}
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                />
              </div>

              {/* Gói quảng cáo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gói quảng cáo <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3 mt-2">
                  {hotJobPackages.map((pkg) => (
                    <div 
                      key={pkg.id}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <input
                        type="radio"
                        id={`package-${pkg.id}`}
                        name="package"
                        value={pkg.id}
                        checked={selectedPackage === pkg.id}
                        onChange={() => setSelectedPackage(pkg.id)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 cursor-pointer"
                      />
                      <label 
                        htmlFor={`package-${pkg.id}`}
                        className="ml-3 flex flex-1 justify-between cursor-pointer"
                      >
                        <span className="font-medium text-gray-900">
                          {pkg.name} ({pkg.duration} ngày)
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.selectedPackage && (
                  <p className="mt-1 text-sm text-red-600">{errors.selectedPackage}</p>
                )}
              </div>
              
              {/* Thời gian hiển thị */}
              {startDate && endDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian hiển thị
                  </label>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
                    Từ {new Date(startDate).toLocaleDateString('vi-VN')} đến {new Date(endDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Nút xác nhận */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/hot-job-ads")}
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
                  <img 
                    src={previewImage} 
                    alt="Banner preview"
                    className="w-full aspect-[3/1] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[3/1] bg-gray-100 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Hot Job
                  </span>
                </div>
              </div>

              {/* Content preview */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {title || "Tiêu đề quảng cáo"}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {description || "Mô tả ngắn về quảng cáo sẽ hiển thị ở đây"}
                </p>
                
                {job && (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={job.freelancer.avatar || "https://via.placeholder.com/150"}
                          alt={job.freelancer.name}
                        />
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-gray-600">{job.freelancer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-semibold">{formatCurrency(job.price)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview ở các vị trí khác nhau */}
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Quảng cáo sẽ xuất hiện tại:</h3>
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
                <li>Banner nên có kích thước 1200x400px để hiển thị tốt nhất</li>
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