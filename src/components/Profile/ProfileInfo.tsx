import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

interface ProfileInfoProps {
  user: {
    description: string;
    hardSkill: string;
    softSkill: string;
    languages: string;
    education: string;
    certificates: string;
    _id?: string;
  };
  isCustomer?: boolean; // Thêm prop isCustomer để xác định role
  onUpdateUser?: (updatedUser: any) => void;
  fetchUserProfile?: () => void; // Thêm prop để gọi API lấy thông tin mới sau khi cập nhật
}

const ProfileInfo = ({ user, isCustomer = false, onUpdateUser, fetchUserProfile }: ProfileInfoProps) => {
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    description: user.description || '',
    hardSkill: user.hardSkill || '',
    softSkill: user.softSkill || '',
    languages: user.languages || '',
    education: user.education || '',
    certificates: user.certificates || '',
  });

  const hardSkills = !isEditing && user.hardSkill ? user.hardSkill.split(',').map(skill => skill.trim()).filter(Boolean) : [];
  const softSkills = !isEditing && user.softSkill ? user.softSkill.split(',').map(skill => skill.trim()).filter(Boolean) : [];
  const languages = !isEditing && user.languages ? user.languages.split(',').map(lang => lang.trim()).filter(Boolean) : [];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (onUpdateUser) {
        // Sử dụng callback từ parent component nếu có
        onUpdateUser(editData);
        setIsEditing(false);
        return;
      }
      
      // Nếu không có callback, gửi request trực tiếp đến API
      const token = await getToken();
      
      // Gửi request cập nhật thông tin profile
      await axios.put(
        'http://localhost:5000/api/profile/update',
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Tải lại thông tin profile nếu có hàm fetchUserProfile
      if (fetchUserProfile) {
        fetchUserProfile();
      }
      
      // Hiển thị thông báo thành công (nếu có context thông báo)
      // Có thể sử dụng toast library hoặc context thông báo khác ở đây
      
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      // Hiển thị thông báo lỗi
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setEditData({
      description: user.description || '',
      hardSkill: user.hardSkill || '',
      softSkill: user.softSkill || '',
      languages: user.languages || '',
      education: user.education || '',
      certificates: user.certificates || '',
    });
    setIsEditing(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 relative">
      {/* Edit Button */}
      <div className="absolute top-4 right-4">
        {isEditing ? (
          <div className="flex space-x-2">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className={`px-4 py-1 ${isLoading ? 'bg-gray-400' : 'bg-[#1dbf73] hover:bg-[#19a463]'} text-white text-sm rounded transition-colors flex items-center`}
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Giới thiệu</h2>
        {isEditing ? (
          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1dbf73] focus:border-[#1dbf73] outline-none"
            rows={5}
            placeholder="Nhập thông tin giới thiệu về bản thân bạn..."
          />
        ) : (
          <pre className="text-gray-600 whitespace-pre-wrap break-words font-sans text-base leading-relaxed">{user.description || 'Chưa có thông tin giới thiệu.'}</pre>
        )}
      </div>

      {/* Hiển thị các phần sau chỉ khi là Freelancer */}
      {!isCustomer && (
        <>
          {/* Hard Skills */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng chuyên môn</h2>
            {isEditing ? (
              <input
                name="hardSkill"
                value={editData.hardSkill}
                onChange={handleChange}
                placeholder="Kỹ năng cách nhau bởi dấu phẩy (,)"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1dbf73] focus:border-[#1dbf73] outline-none"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {hardSkills.length > 0 ? (
                  hardSkills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Chưa có kỹ năng chuyên môn</p>
                )}
              </div>
            )}
          </div>

          {/* Soft Skills */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng mềm</h2>
            {isEditing ? (
              <input
                name="softSkill"
                value={editData.softSkill}
                onChange={handleChange}
                placeholder="Kỹ năng cách nhau bởi dấu phẩy (,)"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1dbf73] focus:border-[#1dbf73] outline-none"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {softSkills.length > 0 ? (
                  softSkills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Chưa có kỹ năng mềm</p>
                )}
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ngôn ngữ</h2>
            {isEditing ? (
              <input
                name="languages"
                value={editData.languages}
                onChange={handleChange}
                placeholder="Ngôn ngữ cách nhau bởi dấu phẩy (,)"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1dbf73] focus:border-[#1dbf73] outline-none"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {languages.length > 0 ? (
                  languages.map((language, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {language}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Chưa có thông tin ngôn ngữ</p>
                )}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Học vấn</h2>
            {isEditing ? (
              <input
                name="education"
                value={editData.education}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1dbf73] focus:border-[#1dbf73] outline-none"
              />
            ) : (
              <div className="text-gray-700">{user.education || 'Chưa có thông tin học vấn'}</div>
            )}
          </div>

          {/* Certificates */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Chứng chỉ</h2>
            {isEditing ? (
              <input
                name="certificates"
                value={editData.certificates}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#1dbf73] focus:border-[#1dbf73] outline-none"
              />
            ) : (
              <div className="text-gray-700">{user.certificates || 'Chưa có thông tin chứng chỉ'}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileInfo;