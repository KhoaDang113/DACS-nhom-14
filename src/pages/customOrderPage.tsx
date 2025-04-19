import { useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Upload, FileText, X, Calendar, Clock } from "lucide-react";
import { sampleGigs } from "../data/jobs";

const CustomOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const freelancer = sampleGigs.find(g => g._id === id)?.freelancer;
  
  const [formData, setFormData] = useState({
    description: "",
    deadline: 7,
    budget: "",
    deliverables: ""
  });
  
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mô phỏng gửi request
    try {
      // Trong thực tế, bạn sẽ gửi cả formData và attachments lên server
      console.log("Form data:", formData);
      console.log("Attachments:", attachments);
      
      // Giả lập thời gian xử lý
      setTimeout(() => {
        setIsLoading(false);
        // Chuyển hướng người dùng đến trang thanh toán hoặc xác nhận
        navigate(`/payment?custom=true&freelancer=${id}&budget=${formData.budget}`);
      }, 1500);
    } catch (error) {
      console.error("Error submitting custom order:", error);
      setIsLoading(false);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
    }
  };

  if (!freelancer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy người bán</h1>
        <p className="mb-8">Người bán bạn đang tìm kiếm có thể không còn hoạt động.</p>
        <Link 
          to="/dashboard" 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          Quay lại trang chính
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Gửi yêu cầu tùy chỉnh</h1>
          <p className="text-gray-500 mt-1">
            Mô tả chi tiết yêu cầu của bạn để {freelancer.name} có thể hiểu rõ và đáp ứng đúng nhu cầu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Thông tin người bán */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img 
              src={freelancer.avatar}
              alt={freelancer.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h3 className="font-bold text-lg">{freelancer.name}</h3>
              <p className="text-gray-500">
                {freelancer.level === 1 ? "Người bán mới" : `Cấp độ ${freelancer.level}`}
              </p>
            </div>
          </div>

          {/* Mô tả yêu cầu */}
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
              Mô tả chi tiết yêu cầu của bạn <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả càng chi tiết càng giúp người bán hiểu rõ yêu cầu của bạn. Nêu rõ mục tiêu, yêu cầu cụ thể, và kết quả mong muốn."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
            ></textarea>
          </div>

          

          {/* Thời gian thực hiện */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Calendar size={18} className="mr-2 text-gray-500" />
              <label htmlFor="deadline" className="font-medium text-gray-700">
                Thời gian hoàn thành <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="mr-2 text-gray-500" />
              <select
                id="deadline"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="1">1 ngày</option>
                <option value="3">3 ngày</option>
                <option value="5">5 ngày</option>
                <option value="7">7 ngày</option>
                <option value="14">14 ngày</option>
                <option value="21">21 ngày</option>
                <option value="30">30 ngày</option>
              </select>
            </div>
          </div>

          {/* Sản phẩm bàn giao */}
          <div className="mb-6">
            <label htmlFor="deliverables" className="block mb-2 font-medium text-gray-700">
              Sản phẩm bàn giao <span className="text-red-500">*</span>
            </label>
            <textarea
              id="deliverables"
              name="deliverables"
              rows={3}
              required
              value={formData.deliverables}
              onChange={handleChange}
              placeholder="Liệt kê các sản phẩm bạn mong muốn nhận được (ví dụ: mã nguồn, thiết kế, file PSD, tài liệu...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
            ></textarea>
          </div>

          {/* Tải lên tài liệu */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Tài liệu đính kèm (tùy chọn)
            </label>
            
            {/* Danh sách file đã tải lên */}
            {attachments.length > 0 && (
              <div className="mb-4 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Nút tải lên */}
            <div className="mt-2">
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload size={16} className="mr-2" />
                Tải lên tài liệu
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="sr-only"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.jpg,.jpeg,.png"
              />
              <p className="mt-1 text-xs text-gray-500">
                Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR, JPG, JPEG, PNG (tối đa 10MB)
              </p>
            </div>
          </div>

          {/* Nút gửi yêu cầu */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Đang gửi...
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomOrderPage;