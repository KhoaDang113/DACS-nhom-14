import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Upload } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(1000),
  price: z.coerce.number().min(1),
  category: z.string().nonempty(),
  deliveryTime: z.coerce.number().min(1),
});

type FormValues = z.infer<typeof formSchema>;
type Category = {
  _id: string;
  name: string;
  subcategories?: Category[];
};

export default function CreateGigForm() {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      deliveryTime: 1,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles: File[] = [];
    const newUrls: string[] = [];

    Array.from(e.target.files).forEach((file) => {
      if (!file.type.match(/image\/(jpeg|jpg|png)/i)) {
        alert("Chỉ chấp nhận ảnh JPG và PNG");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      newFiles.push(file);
      newUrls.push(URL.createObjectURL(file));
    });

    setImages((prev) => [...prev, ...newFiles]);
    setImageUrls((prev) => [...prev, ...newUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newUrls = [...imageUrls];
    URL.revokeObjectURL(newUrls[index]);
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    setImages(newImages);
    setImageUrls(newUrls);
  };

  const onSubmit = async (data: FormValues) => {
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
      alert("Đăng dịch vụ thành công!");
    } catch (error) {
      console.log("Đăng dịch vụ thất bại:", error);
      alert("Đăng dịch vụ thất bại.");
    } finally {
      setIsSubmitting(false);
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10 rounded-2xl bg-white p-6 shadow-md"
    >
      <div className="space-y-2">
        <label htmlFor="title" className="font-medium">Tiêu đề dịch vụ</label>
        <input
          id="title"
          type="text"
          placeholder="VD: Thiết kế logo chuyên nghiệp"
          className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"}`}
          {...register("title")}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="font-medium">Mô tả chi tiết</label>
        <textarea
          id="description"
          placeholder="Mô tả về quy trình, kinh nghiệm, sản phẩm bạn cung cấp..."
          className={`min-h-[180px] w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`}
          {...register("description")}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="font-medium">Danh mục</label>
        <select
          id="category"
          className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? "border-red-500" : "border-gray-300"}`}
          {...register("category")}
        >
          <option value="">Chọn danh mục</option>
          {categories.map((cat) => (
            <optgroup key={cat._id} label={cat.name}>
              {cat.subcategories?.length ? (
                cat.subcategories.map((child) => (
                  <option key={child._id} value={child._id}>{child.name}</option>
                ))
              ) : (
                <option value={cat._id}>{cat.name}</option>
              )}
            </optgroup>
          ))}
        </select>
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="deliveryTime" className="font-medium">Thời gian hoàn thành (ngày)</label>
        <input
          id="deliveryTime"
          type="number"
          min="1"
          className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deliveryTime ? "border-red-500" : "border-gray-300"}`}
          {...register("deliveryTime")}
        />
        {errors.deliveryTime && <p className="text-sm text-red-500">{errors.deliveryTime.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="font-medium">Ảnh minh họa</label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative overflow-hidden rounded-xl border shadow-sm">
              <img src={url} alt={`Preview ${index + 1}`} className="aspect-video w-full object-cover" />
              <button
                type="button"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                onClick={() => removeImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 text-center text-sm text-gray-500 hover:bg-gray-50"
          >
            <Upload className="mb-2 h-6 w-6 text-gray-500" />
            <p>Tải ảnh JPG/PNG (tối đa 5MB)</p>
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

      <div className="space-y-2">
        <label htmlFor="price" className="font-medium">Giá dịch vụ (VNĐ)</label>
        <input
          id="price"
          type="number"
          min="0"
          className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? "border-red-500" : "border-gray-300"}`}
          {...register("price")}
        />
        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng dịch vụ"}
        </button>
      </div>
    </form>
  );
}
