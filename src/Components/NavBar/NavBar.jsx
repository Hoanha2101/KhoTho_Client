import React from 'react';
import { Link } from 'react-router-dom';
import "./styles/NavBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const isLoggedIn = !!localStorage.getItem('authToken');
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
        <Link to="/khotho/login" className="menuList highlightLink text-[#6f6f6f] hover:text-blueColor">
          <FontAwesomeIcon icon={faStar} className="highlightIcon" />
          Bắt đầu nhận việc
        </Link>
        {/* <Link to="/jobs" className="menuList text-[#6f6f6f] hover:text-blueColor">Công việc</Link>
        <Link to="/customer" className="menuList text-[#6f6f6f] hover:text-blueColor">Khách hàng</Link> */}
        <Link to="/khotho/about" className="menuList text-[#6f6f6f] hover:text-blueColor">Giới thiệu</Link>
        <Link to="/khotho/contact" className="menuList text-[#6f6f6f] hover:text-blueColor">Liên hệ</Link>
        <Link to="/khotho/login" className="menuList text-[#6f6f6f] hover:text-blueColor">Đăng nhập</Link>
        <Link to="/khotho/register" className="menuList text-[#6f6f6f] hover:text-blueColor">Đăng ký</Link>
      </div>
    </div>
  );
}

export default NavBar;
