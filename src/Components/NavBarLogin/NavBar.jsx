import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import "./styles/NavBar.css";
import avatar1 from '../../Assets/user/avatar-1.jpg';

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const isLoggedIn = !!localStorage.getItem('authToken');

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  return (
    <div className='navBar flex justify-between items-center p-[3rem]'>
      <div className="logoDiv">
        <h1 className="logo text-[25px] text-blueColor logo-flex"> 
          <div className="flex">
            <div className="logo-font-blue">Kho</div>
            <div className="logo-font-yellow">Tho</div>
          </div>
        </h1>
      </div>

      <div className="menu flex gap-8">
        <Link to="/khotho/registerworker" className="menuList highlightLink text-[#6f6f6f] hover:text-blueColor">
          <FontAwesomeIcon icon={faStar} className="highlightIcon" />
          Bắt đầu nhận việc
        </Link>
        <Link to="/khotho/jobs" className="menuList text-[#6f6f6f] hover:text-blueColor">Công việc</Link>
        <Link to="/khotho/customer" className="menuList text-[#6f6f6f] hover:text-blueColor">Khách hàng</Link>
        <Link to="/khotho/aboutlogin"  className="menuList text-[#6f6f6f] hover:text-blueColor">Giới thiệu</Link>
        <Link to="/khotho/contactlogin" className="menuList text-[#6f6f6f] hover:text-blueColor">Liên hệ</Link>
        <div className="relative">
          <img
            className="rounded-full w-10 mr-2 cursor-pointer"
            src={avatar1}
            alt="avatar"
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link 
                to="/khotho/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Thông tin cá nhân
              </Link>
              <Link 
                to="/khotho/ordermanagement" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Quản lí đơn
              </Link>
              <Link 
                to="/khotho/settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cài đặt
              </Link>
              <hr className="my-1" />
              <Link 
                to="/khotho" 
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Đăng xuất
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
