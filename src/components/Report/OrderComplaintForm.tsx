import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext";

const formSchema = z.object({
  title: z.string().min(10, "Tiêu đề phải có ít nhất 10 ký tự").max(100, "Tiêu đề không được vượt quá 100 ký tự"),
  description: z.string().min(50, "Mô tả phải có ít nhất 50 ký tự").max(1000, "Mô tả không được vượt quá 1000 ký tự"),
});

type FormValues = z.infer<typeof formSchema>;

export default function OrderComplaintForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      
      await axios.post("http://localhost:5000/api/reports/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      
      showNotification("Khiếu nại của bạn đã được ghi nhận và đang được xử lý", "success");
      navigate("/orders");
    } catch (error: unknown) {
      console.log("Gửi khiếu nại thất bại:", error);
      showNotification(
        error instanceof Error ? error.message : "Gửi khiếu nại thất bại",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Tiêu đề khiếu nại</h3>
        <input
          type="text"
          placeholder="VD: Dịch vụ không đúng cam kết"
          className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.title.message}
          </p>
        )}

        <h3 className="text-lg font-medium text-gray-900">Mô tả chi tiết</h3>
        <textarea
          placeholder="Mô tả chi tiết về vấn đề bạn gặp phải..."
          className={`min-h-[200px] w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description.message}
          </p>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? "Đang xử lý..." : "Gửi khiếu nại"}
          </button>
        </div>
      </div>
    </form>
  );
}
