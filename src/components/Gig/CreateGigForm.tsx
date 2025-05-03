import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Upload, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext";

const formSchema = z.object({
  title: z.string().min(10, "Tiêu đề phải có ít nhất 10 ký tự").max(100, "Tiêu đề không được vượt quá 100 ký tự"),
  description: z.string().min(50, "Mô tả phải có ít nhất 50 ký tự").max(1000, "Mô tả không được vượt quá 1000 ký tự"),
  price: z.coerce.number().min(1, "Giá phải lớn hơn 0"),
  category: z.string().nonempty("Vui lòng chọn danh mục"),
  deliveryTime: z.coerce.number().min(1, "Thời gian giao hàng phải ít nhất 1 ngày"),
});

type FormValues = z.infer<typeof formSchema>;
type Category = {
  _id: string;
  name: string;
  subcategories?: Category[];
};

const steps = [
  { id: 1, title: "Tiêu đề" },
  { id: 2, title: "Mô tả" },
  { id: 3, title: "Danh mục" },
  { id: 4, title: "Thời gian" },
  { id: 5, title: "Giá" },
  { id: 6, title: "Ảnh" },
];

export default function CreateGigForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1]);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      deliveryTime: 0,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles: File[] = [];
    const newUrls: string[] = [];

    Array.from(e.target.files).forEach((file) => {
      if (!file.type.match(/image\/(jpeg|jpg|png)/i)) {
        setImageError("Chỉ chấp nhận ảnh JPG và PNG");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      newFiles.push(file);
      newUrls.push(URL.createObjectURL(file));
    });

    if (newFiles.length > 0) {
      setImageError(null);
      setImages((prev) => [...prev, ...newFiles]);
      setImageUrls((prev) => [...prev, ...newUrls]);
      
      // Remove step 6 from error steps if images were added
      if (errorSteps.includes(6)) {
        setErrorSteps(errorSteps.filter(step => step !== 6));
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newUrls = [...imageUrls];
    URL.revokeObjectURL(newUrls[index]);
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    setImages(newImages);
    setImageUrls(newUrls);
    
    // If no images left, set image error
    if (newImages.length === 0) {
      setImageError("Vui lòng tải lên ít nhất một ảnh");
      if (!errorSteps.includes(6)) {
        setErrorSteps([...errorSteps, 6]);
      }
    }
  };

  const validateStep = async (step: number) => {
    let isValid = true;
    switch (step) {
      case 1:
        isValid = await trigger("title");
        break;
      case 2:
        isValid = await trigger("description");
        break;
      case 3:
        isValid = await trigger("category");
        break;
      case 4:
        isValid = await trigger("deliveryTime");
        break;
      case 5:
        isValid = await trigger("price");
        break;
      case 6:
        isValid = images.length > 0;
        if (!isValid) {
          setImageError("Vui lòng tải lên ít nhất một ảnh");
        }
        break;
    }
    return isValid;
  };

  const onSubmit = async (data: FormValues) => {
    const allSteps = [1, 2, 3, 4, 5, 6];
    const validationResults = await Promise.all(
      allSteps.map(step => validateStep(step))
    );
    
    const invalidSteps = allSteps.filter((_, index) => !validationResults[index]);
    setErrorSteps(invalidSteps);

    if (invalidSteps.length > 0) {
      setCurrentStep(invalidSteps[0]);
      showNotification("Vui lòng kiểm tra lại các thông tin", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("category_id", data.category);
      formData.append("duration", data.deliveryTime.toString());
      images.forEach((file) => formData.append("files", file));
      await axios.post("http://localhost:5000/api/gigs/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      showNotification("Đăng dịch vụ thành công!", "success");
      navigate("/seller-gigs");
    } catch (error: unknown) {
      console.log("Đăng dịch vụ thất bại:", error);
      showNotification(
        error instanceof Error ? error.message : "Đăng dịch vụ thất bại",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const isCurrentStepValid = await validateStep(currentStep);
    
    if (!isCurrentStepValid) {
      if (!errorSteps.includes(currentStep)) {
        setErrorSteps([...errorSteps, currentStep]);
      }
      return;
    }
    
    // Remove current step from error steps if it was valid
    if (errorSteps.includes(currentStep)) {
      setErrorSteps(errorSteps.filter(step => step !== currentStep));
    }
    
    if (currentStep < 6) {
      const nextStepNumber = currentStep + 1;
      setCurrentStep(nextStepNumber);
      if (!visitedSteps.includes(nextStepNumber)) {
        setVisitedSteps([...visitedSteps, nextStepNumber]);
      }
    }
  };

  const handleStepClick = async (step: number) => {
    // Optional: Validate current step before allowing navigation
    const isCurrentStepValid = await validateStep(currentStep);
    if (!isCurrentStepValid) {
      if (!errorSteps.includes(currentStep)) {
        setErrorSteps([...errorSteps, currentStep]);
      }
    } else if (errorSteps.includes(currentStep)) {
      setErrorSteps(errorSteps.filter(s => s !== currentStep));
    }
    
    setCurrentStep(step);
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextStep();
    }
  };

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Steps Navigation */}
      <div className="mb-8">
        <div className="overflow-x-auto">
          <div className="flex items-center min-w-max">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className="flex items-center cursor-pointer"
                onClick={() => handleStepClick(step.id)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step.id
                      ? "bg-green-500 text-white"
                      : errorSteps.includes(step.id)
                      ? "bg-red-500 text-white"
                      : visitedSteps.includes(step.id)
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {errorSteps.includes(step.id) ? "!" : step.id}
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden sm:inline ${
                    currentStep === step.id
                      ? "text-green-500"
                      : errorSteps.includes(step.id)
                      ? "text-red-500"
                      : visitedSteps.includes(step.id)
                      ? "text-blue-800"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
                {step.id < 6 && (
                  <div className="w-9 h-1 mx-7 bg-gray-300">
                    <div 
                      className={visitedSteps.includes(step.id + 1) ? "h-full bg-blue-500" : ""} 
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <h3 className="text-lg font-medium text-gray-900 md:w-1/3">Tiêu đề dịch vụ</h3>
              <div className="md:w-2/3 w-full">
                <input
                  type="text"
                  placeholder="VD: Thiết kế logo chuyên nghiệp"
                  className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  {...register("title")}
                  onKeyPress={handleKeyPress}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:gap-4">
              <h3 className="text-lg font-medium text-gray-900 md:w-1/3">Mô tả chi tiết dịch vụ</h3>
              <div className="md:w-2/3 w-full">
                <textarea
                  placeholder="Mô tả về quy chi tiết về sản phẩm bạn cung cấp..."
                  className={`min-h-[200px] sm:min-h-[250px] w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  {...register("description")}
                  onKeyPress={handleKeyPress}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <h3 className="text-lg font-medium text-gray-900 md:w-1/3">Danh mục</h3>
              <div className="md:w-2/3 w-full">
                <select
                  className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  {...register("category")}
                  onKeyPress={handleKeyPress}
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
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <h3 className="text-lg font-medium text-gray-900 md:w-1/3">
                Thời gian hoàn thành (ngày)
              </h3>
              <div className="md:w-2/3 w-full">
                <input
                  type="number"
                  min="1"
                  className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.deliveryTime ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  {...register("deliveryTime")}
                  onKeyPress={handleKeyPress}
                />
                {errors.deliveryTime && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.deliveryTime.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <h3 className="text-lg font-medium text-gray-900 md:w-1/3">Giá dịch vụ (VNĐ)</h3>
              <div className="md:w-2/3 w-full">
                <input
                  type="number"
                  min="1"
                  className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  {...register("price")}
                  onKeyPress={handleKeyPress}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:gap-4">
              <h3 className="text-lg font-medium text-gray-900 md:w-1/3">Ảnh minh họa</h3>
              <div className="md:w-2/3 w-full">
                {imageError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {imageError}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-md border shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="aspect-video w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-1 top-1 flex rounded-full bg-red-500 p-1 text-white shadow"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="image-upload"
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed ${
                      imageError ? "border-red-300 bg-red-50" : "border-gray-300 hover:bg-gray-50"
                    } px-6 py-10 text-center text-sm ${
                      imageError ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    <Upload className={`mb-2 h-6 w-6 ${imageError ? "text-red-500" : "text-gray-500"}`} />
                    <p>Tải ảnh JPG/PNG (tối đa 5MB)</p>
                    <p className="text-xs mt-1">Vui lòng tải lên ít nhất một ảnh</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      className="hidden"
                      id="image-upload"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                {isSubmitting ? "Đang xử lý..." : "Hoàn thành"}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}