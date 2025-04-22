import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';
import { FiSearch, FiUser, FiShoppingCart, FiMenu } from 'react-icons/fi';

const MobileNavbar: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center py-3">
        <Link to="/advanced-search" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <FiSearch size={20} />
          <span className="text-xs mt-1">Tìm kiếm</span>
        </Link>
        
        <SignedIn>
          <Link to="/orders" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <FiShoppingCart size={20} />
            <span className="text-xs mt-1">Giỏ hàng</span>
          </Link>
          
          <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div className="relative">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl}
                  alt="Avatar" 
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <FiUser size={20} />
              )}
            </div>
            <span className="text-xs mt-1">Tài khoản</span>
          </Link>
        </SignedIn>
        
        <SignedOut>
          <Link to="/sign-in" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <FiUser size={20} />
            <span className="text-xs mt-1">Đăng nhập</span>
          </Link>
        </SignedOut>
      </div>
    </div>
  );
};

export default MobileNavbar;