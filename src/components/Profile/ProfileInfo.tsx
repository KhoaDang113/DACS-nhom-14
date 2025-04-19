interface ProfileInfoProps {
  user: {
    description: string;
    hardSkill: string;
    softSkill: string;
    languages: string;
    education: string;
    certificates: string;
  };
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const hardSkills = user.hardSkill.split(',').map(skill => skill.trim());
  const softSkills = user.softSkill.split(',').map(skill => skill.trim());
  const languages = user.languages.split(',').map(lang => lang.trim());
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Description */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Giới thiệu</h2>
        <p className="text-gray-600 whitespace-pre-line">{user.description}</p>
      </div>

      {/* Hard Skills */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng chuyên môn</h2>
        <div className="flex flex-wrap gap-2">
          {hardSkills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng mềm</h2>
        <div className="flex flex-wrap gap-2">
          {softSkills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ngôn ngữ</h2>
        <div className="space-y-2">
          {languages.map((language, index) => (
            <div key={index} className="text-gray-700">{language}</div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Học vấn</h2>
        <div className="text-gray-700">{user.education}</div>
      </div>

      {/* Certificates */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Chứng chỉ</h2>
        <div className="text-gray-700">{user.certificates}</div>
      </div>
    </div>
  );
};

export default ProfileInfo;