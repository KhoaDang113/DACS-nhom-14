import { useState } from 'react';

interface ProfileInfoProps {
  user: {
    description: string;
    hardSkill: string;
    softSkill: string;
    languages: string;
    education: string;
    certificates: string;
  };
  onUpdateUser?: (updatedUser: any) => void; // Thêm callback để cập nhật user
}

const ProfileInfo = ({ user, onUpdateUser }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: user.description,
    hardSkill: user.hardSkill,
    softSkill: user.softSkill,
    languages: user.languages,
    education: user.education,
    certificates: user.certificates,
  });

  const hardSkills = !isEditing ? user.hardSkill.split(',').map(skill => skill.trim()) : [];
  const softSkills = !isEditing ? user.softSkill.split(',').map(skill => skill.trim()) : [];
  const languages = !isEditing ? user.languages.split(',').map(lang => lang.trim()) : [];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (onUpdateUser) {
      onUpdateUser(editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setEditData({
      description: user.description,
      hardSkill: user.hardSkill,
      softSkill: user.softSkill,
      languages: user.languages,
      education: user.education,
      certificates: user.certificates,
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
              className="px-4 py-1 bg-[#1dbf73] text-white text-sm rounded hover:bg-[#19a463] transition-colors"
            >
              Lưu
            </button>
            <button 
              onClick={handleCancel}
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
          />
        ) : (
          <p className="text-gray-600 whitespace-pre-line">{user.description}</p>
        )}
      </div>

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
            {hardSkills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
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
            {softSkills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
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
          <div className="space-y-2">
            {languages.map((language, index) => (
              <div key={index} className="text-gray-700">{language}</div>
            ))}
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
          <div className="text-gray-700">{user.education}</div>
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
          <div className="text-gray-700">{user.certificates}</div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;