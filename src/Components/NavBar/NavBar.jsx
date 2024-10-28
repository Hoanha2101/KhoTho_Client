import React from 'react'
import { Link } from 'react-router-dom';
import "./styles/NavBar.css"

const NavBar = () => {
  return (
    <div className='navBar flex justify-between items-center p-[3rem]'>
        <div className="logoDiv">
            <h1 className="logo text-[25px] text-blueColor "> <strong>Kho</strong>Tho
            </h1>
        </div>
        
        <div className="menu flex gap-8">
          <li className="menuList text-[#6f6f6f] hover:text-blueColor">Jobs</li>
          <li className="menuList text-[#6f6f6f] hover:text-blueColor">Customer</li>
          <li className="menuList text-[#6f6f6f] hover:text-blueColor">About</li>
          <li className="menuList text-[#6f6f6f] hover:text-blueColor">Contact</li>
          <Link to="/login" className="menuList text-[#6f6f6f] hover:text-blueColor">Login</Link>
          <Link to="/register" className="menuList text-[#6f6f6f] hover:text-blueColor">Register</Link>

        </div>
    </div>
  )
}

export default NavBar