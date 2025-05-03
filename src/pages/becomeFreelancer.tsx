import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { AlertCircle, Camera, ChevronRight, Check, Globe, X } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import useUserRole from '../hooks/useUserRole';
import ISO6391 from 'iso-639-1';

// Lấy danh sách ngôn ngữ từ thư viện iso-639-1
const languages = ISO6391.getLanguages(ISO6391.getAllCodes());
// Tạo danh sách ngôn ngữ cho dropdown
const languageOptions = languages
  .map(lang => ({
    code: lang.code,
    name: lang.name,
    nativeName: lang.nativeName,
  }))
  // Sắp xếp theo tên ngôn ngữ theo bảng chữ cái
  .sort((a, b) => a.name.localeCompare(b.name));

// Bước 1: Thông tin cơ bản
const StepOne = ({ 
  formData, 
  setFormData, 
  errors, 
  setErrors, 
  handleNext 
}: {
  formData: any, 
  setFormData: React.Dispatch<React.SetStateAction<any>>, 
  errors: any, 
  setErrors: React.Dispatch<React.SetStateAction<any>>,
  handleNext: () => void
}) => {
  const { user } = useUser();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Upload ảnh đại diện
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result as string,
          profileImageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Cập nhật form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng sửa
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Tìm kiếm ngôn ngữ
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setShowDropdown(true);
    }
  };

  // Xử lý khi người dùng chọn ngôn ngữ
  const handleLanguageSelect = (languageCode: string) => {
    if (!selectedLanguages.includes(languageCode)) {
      const updatedLanguages = [...selectedLanguages, languageCode];
      setSelectedLanguages(updatedLanguages);
      
      // Cập nhật giá trị trong formData
      const languageNames = updatedLanguages.map(code => {
        const lang = languageOptions.find(lang => lang.code === code);
        return lang ? lang.name : code;
      });
      
      setFormData(prev => ({
        ...prev,
        languages: languageNames.join(', ')
      }));
      
      // Xóa lỗi nếu có
      if (errors.languages) {
        setErrors(prev => ({ ...prev, languages: '' }));
      }
    }
    
    // Reset tìm kiếm và đóng dropdown
    setSearchTerm('');
    setShowDropdown(false);
  };

  // Xóa ngôn ngữ đã chọn
  const removeLanguage = (languageCode: string) => {
    const updatedLanguages = selectedLanguages.filter(code => code !== languageCode);
    setSelectedLanguages(updatedLanguages);
    
    // Cập nhật giá trị trong formData
    const languageNames = updatedLanguages.map(code => {
      const lang = languageOptions.find(lang => lang.code === code);
      return lang ? lang.name : code;
    });
    
    setFormData(prev => ({
      ...prev,
      languages: languageNames.join(', ')
    }));
  };

  // Lọc ngôn ngữ theo tìm kiếm
  const filteredLanguages = languageOptions.filter(lang => 
    (lang.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !selectedLanguages.includes(lang.code)
  );

  // Thiết lập selectedLanguages từ formData.languages khi component mount
  useEffect(() => {
    if (formData.languages) {
      const languageNames = formData.languages.split(',').map((lang: string) => lang.trim());
      const codes = languageNames.map(name => {
        const lang = languageOptions.find(option => option.name === name);
        return lang ? lang.code : null;
      }).filter(Boolean);
      
      setSelectedLanguages(codes);
    }
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#language-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Validate dữ liệu trước khi chuyển sang bước tiếp theo
  const validateStepOne = () => {
    const newErrors: any = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập tên hiển thị';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả bản thân';
    } else if (formData.description.length < 150) {
      newErrors.description = 'Mô tả phải có ít nhất 150 ký tự';
    } else if (formData.description.length > 600) {
      newErrors.description = 'Mô tả không được vượt quá 600 ký tự';
    }
    
    if (!formData.languages || selectedLanguages.length === 0) {
      newErrors.languages = 'Vui lòng chọn ít nhất một ngôn ngữ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Thông tin cá nhân</h2>
        <p className="text-sm text-gray-600">Hãy điền đầy đủ thông tin để tạo hồ sơ Freelancer của bạn</p>
      </div>

      {/* Ảnh đại diện */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-4">
        <label className="md:w-1/3 text-lg font-medium text-gray-900">Ảnh đại diện</label>
        <div className="md:w-2/3 w-full">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border bg-gray-50">
              {formData.profilePicture ? (
                <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              )}
              <label htmlFor="profile-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tải lên ảnh đại diện mới hoặc sử dụng ảnh hiện tại từ tài khoản của bạn</p>
              <p className="text-xs text-gray-500 mt-1">Khuyến nghị: JPG, PNG. Tối đa 5MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tên hiển thị */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
        <label htmlFor="fullName" className="md:w-1/3 text-lg font-medium text-gray-900">
          Tên hiển thị <span className="text-red-500">*</span>
        </label>
        <div className="md:w-2/3 w-full">
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nhập tên hiển thị của bạn"
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.fullName}
            </p>
          )}
        </div>
      </div>

      {/* Miêu tả bản thân */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-4">
        <label htmlFor="description" className="md:w-1/3 text-lg font-medium text-gray-900">
          Miêu tả bản thân <span className="text-red-500">*</span>
        </label>
        <div className="md:w-2/3 w-full">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Hãy giới thiệu về bản thân, kỹ năng và kinh nghiệm của bạn (tối thiểu 150 ký tự)"
          ></textarea>
          <div className="flex justify-between text-xs">
            <p className={`${formData.description.length < 150 ? 'text-red-500' : 'text-gray-500'}`}>
              Tối thiểu: 150 ký tự
            </p>
            <p className={`${formData.description.length > 600 ? 'text-red-500' : 'text-gray-500'}`}>
              {formData.description.length}/600 ký tự
            </p>
          </div>
          {errors.description && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Ngôn ngữ - đã nâng cấp với tìm kiếm và dropdown */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-4">
        <label htmlFor="languages" className="md:w-1/3 text-lg font-medium text-gray-900">
          Ngôn ngữ <span className="text-red-500">*</span>
        </label>
        <div className="md:w-2/3 w-full" id="language-container">
          <div className="relative">
            <div className="flex items-center relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                id="language-search"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.languages ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Tìm kiếm ngôn ngữ..."
              />
            </div>
            
            {/* Dropdown ngôn ngữ */}
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredLanguages.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Không tìm thấy ngôn ngữ nào</div>
                ) : (
                  filteredLanguages.map(lang => (
                    <div
                      key={lang.code}
                      className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                      onClick={() => handleLanguageSelect(lang.code)}
                    >
                      <span>{lang.name}</span>
                      <span className="text-gray-400 text-xs">{lang.nativeName}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Hiển thị các ngôn ngữ đã chọn */}
          {selectedLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedLanguages.map(code => {
                const language = languageOptions.find(lang => lang.code === code);
                return (
                  <div 
                    key={code}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
                  >
                    <span>{language?.name}</span>
                    <button 
                      type="button" 
                      className="text-blue-800 hover:text-blue-900"
                      onClick={() => removeLanguage(code)}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          {errors.languages && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.languages}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Chọn các ngôn ngữ bạn có thể sử dụng thành thạo</p>
        </div>
      </div>

      {/* Nút chuyển tiếp */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => {
            if (validateStepOne()) {
              handleNext();
            }
          }}
          className="flex items-center justify-center w-full px-6 py-3 bg-[#1dbf73] text-white font-medium rounded-md hover:bg-[#19a463] transition-colors"
        >
          Tiếp tục
          <ChevronRight className="ml-1" size={16} />
        </button>
      </div>
    </div>
  );
};

// Bước 2: Thông tin chuyên môn
const StepTwo = ({ 
  formData, 
  setFormData, 
  errors, 
  setErrors, 
  handleSubmit,
  categories
}: {
  formData: any, 
  setFormData: React.Dispatch<React.SetStateAction<any>>, 
  errors: any, 
  setErrors: React.Dispatch<React.SetStateAction<any>>,
  handleSubmit: () => void,
  categories: any[]
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng sửa
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Thông tin chuyên môn</h2>
        <p className="text-sm text-gray-600">Hãy điền thông tin về kỹ năng và chuyên môn của bạn</p>
      </div>

      {/* Ngành nghề */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
        <label htmlFor="industry" className="md:w-1/3 text-lg font-medium text-gray-900">
          Ngành nghề
        </label>
        <div className="md:w-2/3 w-full">
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn ngành nghề --</option>
            {categories.map((category: any) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kỹ năng chuyên môn - Thêm trường hardSkill */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
        <label htmlFor="hardSkill" className="md:w-1/3 text-lg font-medium text-gray-900">
          Kỹ năng chuyên môn
        </label>
        <div className="md:w-2/3 w-full">
          <input
            type="text"
            id="hardSkill"
            name="hardSkill"
            value={formData.hardSkill}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="HTML, CSS, JavaScript, Python, Photoshop..."
          />
          <p className="text-xs text-gray-500 mt-1">Nhập các kỹ năng chuyên môn của bạn, phân tách bằng dấu phẩy</p>
        </div>
      </div>

      {/* Kỹ năng mềm */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
        <label htmlFor="softSkill" className="md:w-1/3 text-lg font-medium text-gray-900">
          Kỹ năng mềm
        </label>
        <div className="md:w-2/3 w-full">
          <input
            type="text"
            id="softSkill"
            name="softSkill"
            value={formData.softSkill}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Giao tiếp, Quản lý thời gian, Làm việc nhóm..."
          />
          <p className="text-xs text-gray-500 mt-1">Nhập các kỹ năng mềm của bạn, phân tách bằng dấu phẩy</p>
        </div>
      </div>

      {/* Trình độ học vấn */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-4">
        <label htmlFor="education" className="md:w-1/3 text-lg font-medium text-gray-900">
          Trình độ học vấn
        </label>
        <div className="md:w-2/3 w-full">
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Đại học, Cao học, Chuyên ngành..."
          ></textarea>
        </div>
      </div>

      {/* Chứng chỉ */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-4">
        <label htmlFor="certificates" className="md:w-1/3 text-lg font-medium text-gray-900">
          Chứng chỉ liên quan
        </label>
        <div className="md:w-2/3 w-full">
          <textarea
            id="certificates"
            name="certificates"
            value={formData.certificates}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Google Certificate, TOEIC, AWS Certified..."
          ></textarea>
        </div>
      </div>

      {/* Nút gửi */}
      <div className="flex justify-end pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center justify-center px-6 py-3 bg-[#1dbf73] text-white font-medium rounded-md hover:bg-[#19a463] transition-colors"
        >
          Hoàn tất
          <Check className="ml-1" size={16} />
        </button>
      </div>
    </div>
  );
};

// Trang chính
const BecomeFreelancer = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { showNotification } = useNotification();
  const { isFreelancer, isAdmin, isLoading: roleLoading } = useUserRole();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    profilePicture: '',
    profileImageFile: null,
    description: '',
    languages: '',
    industry: '',
    hardSkill: '',
    softSkill: '',
    country: '',
    education: '',
    certificates: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    description: '',
    languages: ''
  });
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1]);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [userRoleError, setUserRoleError] = useState<string | null>(null);

  // Kiểm tra vai trò người dùng khi component mount
  useEffect(() => {
    // Nếu đang tải vai trò, không làm gì cả
    if (roleLoading) return;

    // Kiểm tra nếu người dùng đã là freelancer, chuyển hướng đến trang profile
    if (isFreelancer) {
      window.location.href = '/profile';
      return;
    }

    // Kiểm tra nếu người dùng là admin, hiển thị thông báo lỗi
    if (isAdmin) {
      setUserRoleError('Tài khoản admin không thể đăng ký làm Freelancer. Vui lòng sử dụng tài khoản khách hàng (customer).');
    }
  }, [isFreelancer, isAdmin, roleLoading]);

  // Load categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Sử dụng public API endpoint thay vì API admin
        const response = await axios.get('http://localhost:5000/api/category');
        if (response.data && !response.data.error) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };

    fetchCategories();

    // Pre-fill user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        profilePicture: user.imageUrl || '',
      }));
    }
  }, [user]);

  const handleNext = () => {
    // Validate the current step
    const validateCurrentStep = () => {
      const newErrors: any = {};
      
      if (currentStep === 1) {
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Vui lòng nhập tên hiển thị';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Vui lòng nhập mô tả bản thân';
        } else if (formData.description.length < 150) {
          newErrors.description = 'Mô tả phải có ít nhất 150 ký tự';
        } else if (formData.description.length > 600) {
          newErrors.description = 'Mô tả không được vượt quá 600 ký tự';
        }
        
        if (!formData.languages.trim()) {
          newErrors.languages = 'Vui lòng chọn ít nhất một ngôn ngữ';
        }
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length > 0) {
        if (!errorSteps.includes(currentStep)) {
          setErrorSteps([...errorSteps, currentStep]);
        }
        return false;
      }
      
      // Remove current step from error steps if it was valid
      if (errorSteps.includes(currentStep)) {
        setErrorSteps(errorSteps.filter(step => step !== currentStep));
      }
      
      return true;
    };
    
    if (!validateCurrentStep()) {
      return;
    }
    
    setCurrentStep(2);
    if (!visitedSteps.includes(2)) {
      setVisitedSteps([...visitedSteps, 2]);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Sử dụng getToken từ useAuth
      const token = await getToken();
      const response = await axios.post(
        'http://localhost:5000/api/profile/create',
        {
          fullName: formData.fullName,
          description: formData.description,
          languages: formData.languages,
          industry: formData.industry || '',
          hardSkill: formData.hardSkill || '',
          softSkill: formData.softSkill || '',
          country: 'Việt Nam',  // Mặc định là Việt Nam
          education: formData.education || '',
          certificates: formData.certificates || '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && !response.data.error) {
        // Hiển thị thông báo thành công
        showNotification('Chúc mừng bạn đã trở thành Freelancer!', 'success');
        
        // Đợi để người dùng thấy thông báo thành công
        setTimeout(() => {
          // Refresh trang để cập nhật lại trạng thái người dùng
          window.location.href = '/profile';
        }, 1500);
      }
    } catch (error: any) {
      console.error('Lỗi khi đăng ký Freelancer:', error);
      
      if (error.response?.status === 403) {
        // Xử lý lỗi 403 Forbidden
        showNotification('Không thể đăng ký làm Freelancer. Tài khoản của bạn không phải là khách hàng (customer).', 'error');
        setUserRoleError('Để đăng ký làm Freelancer, bạn cần sử dụng tài khoản khách hàng (customer).');
      } else if (error.response?.data?.message) {
        showNotification(`Lỗi: ${error.response.data.message}`, 'error');
      } else {
        showNotification('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    setShowExitConfirmation(true);
  };

  const confirmExit = () => {
    navigate('/dashboard');
  };

  const cancelExit = () => {
    setShowExitConfirmation(false);
  };

  // Nếu đang tải thông tin vai trò người dùng
  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-t-2 border-b-2 border-[#1dbf73] rounded-full animate-spin"></div>
          <span>Đang tải thông tin tài khoản...</span>
        </div>
      </div>
    );
  }

  // Nếu có lỗi về vai trò người dùng
  if (userRoleError) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không thể đăng ký Freelancer</h2>
          <p className="text-gray-600 mb-6">{userRoleError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Quay về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[1400px]">
      {/* Progress Steps - Style updated to match CreateGigForm */}
      <div className="mb-8">
        <div className="overflow-x-auto">
          <div className="flex items-center min-w-max">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => handleStepClick(1)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 1
                    ? "bg-green-500 text-white"
                    : errorSteps.includes(1)
                    ? "bg-red-500 text-white"
                    : visitedSteps.includes(1)
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {errorSteps.includes(1) ? "!" : "1"}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep === 1
                    ? "text-green-500"
                    : errorSteps.includes(1)
                    ? "text-red-500"
                    : visitedSteps.includes(1)
                    ? "text-blue-800"
                    : "text-gray-500"
                }`}
              >
                Thông tin cá nhân
              </span>
              <div className="w-9 h-1 mx-7 bg-gray-300">
                <div 
                  className={visitedSteps.includes(2) ? "h-full bg-blue-500" : ""} 
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => handleStepClick(2)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 2
                    ? "bg-green-500 text-white"
                    : errorSteps.includes(2)
                    ? "bg-red-500 text-white"
                    : visitedSteps.includes(2)
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {errorSteps.includes(2) ? "!" : "2"}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep === 2
                    ? "text-green-500"
                    : errorSteps.includes(2)
                    ? "text-red-500"
                    : visitedSteps.includes(2)
                    ? "text-blue-800"
                    : "text-gray-500"
                }`}
              >
                Thông tin chuyên môn
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form steps - với container rộng hơn và height tự động */}
      <div className="min-h-[600px] bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 relative">
        {/* Nút X ở góc trên bên phải */}
        <button 
          onClick={handleExit} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>
        
        {currentStep === 1 && (
          <StepOne 
            formData={formData} 
            setFormData={setFormData} 
            errors={errors} 
            setErrors={setErrors} 
            handleNext={handleNext} 
          />
        )}

        {currentStep === 2 && (
          <StepTwo 
            formData={formData} 
            setFormData={setFormData} 
            errors={errors} 
            setErrors={setErrors} 
            handleSubmit={handleSubmit}
            categories={categories}
          />
        )}
      </div>

      {/* Hộp thoại xác nhận thoát */}
      {showExitConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Xác nhận</h3>
            <p className="text-gray-700 mb-6">Bạn không muốn tiếp tục đăng ký trở thành người bán?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelExit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Không
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-lg flex items-center space-x-3">
            <div className="w-6 h-6 border-t-2 border-b-2 border-[#1dbf73] rounded-full animate-spin"></div>
            <p>Đang xử lý...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomeFreelancer;