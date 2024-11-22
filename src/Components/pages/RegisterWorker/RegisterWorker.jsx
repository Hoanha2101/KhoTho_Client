import React, { useEffect, useState } from 'react';
import Footer from '../../FooterDiv/Footer';
import NavBar from '../../NavBarLogin/NavBar';
import './RegisterWorker.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as config from "../../../services/config";
import { API_ENDPOINT } from "../../../services/config";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const RegisterWorker = () => {
    const USERnow = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("authToken");
    // Sử dụng useState để khởi tạo giá trị cho các trường
    const [name, setName] = useState(USERnow ? USERnow.fullName : "");
    const [phone, setPhone] = useState(USERnow ? USERnow.phoneNumber : "");
    const [email, setEmail] = useState(USERnow ? USERnow.email : "");
    const [address, setAddress] = useState(USERnow ? USERnow.address : "");

    const navigate = useNavigate();

    const [profileImage, setProfileImage] = useState(null);
    const [activeTab, setActiveTab] = useState('basicInfo'); // State to track active tab
    const [frontCCCD, setFrontCCCD] = useState(null);  // State for front image
    const [backCCCD, setBackCCCD] = useState(null);    // State for back image

    const [nationality, setNationality] = useState('Vietnam'); // default value
    const [industryGroup, setIndustryGroup] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [yearsExperience, setYearsExperience] = useState(0);
    const [selfIntroduction, setSelfIntroduction] = useState('');

    const [Workers, setWorkers] = useState(null)

    const [jobTypes, setJobTypes] = useState([]); // Lưu trữ danh sách job types

    // Lấy dữ liệu job types từ API
    useEffect(() => {
      const fetchJobTypes = async () => {
          try {
              const response = await axios.get(`${API_ENDPOINT}/api/JobTypes`, {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                  },
              });
              setJobTypes(response.data); // Lưu dữ liệu job types vào state
          } catch (error) {
              console.error("Error fetching job types:", error);
          }
      };
      fetchJobTypes();
  }, [token]);

    const handleSubmit_ = async (e) => {
      e.preventDefault();
    
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Bạn cần đăng nhập để thực hiện thao tác này!', { position: "top-left", autoClose: 3000 });
          return;
        }

        const userData = localStorage.getItem('userData');
        if (!userData) {
          toast.error('Không tìm thấy userData. Vui lòng đăng nhập lại!', { position: "top-left", autoClose: 3000 });
          return;
        }

        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.userId;
        if (!userId) {
          toast.error('Không tìm thấy userId. Vui lòng đăng nhập lại!', { position: "top-left", autoClose: 3000 });
          return;
        }

        const workerData = {
          userID: userId,  
          experienceYears: yearsExperience,
          rating: 0,
          bio: selfIntroduction,
          verified: true,
          jobTypeIds: [industryGroup],
        };
    
    
        const postResponse = await axios.post(
          `${API_ENDPOINT}/api/Workers`,
          workerData,
          {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
            },
          }
        );
  
        toast.success("Đăng ký thành công!", { position: "top-left", autoClose: 3000 });
        setTimeout(() => navigate("/khotho/workers"), 1000);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Có lỗi xảy ra, vui lòng thử lại!', { position: "top-left", autoClose: 3000 });
      }
    };
    

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Handle file upload for CCCD images
  const handleCCCDUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === 'front') {
        setFrontCCCD(imageUrl);  // Set front image preview
      } else if (type === 'back') {
        setBackCCCD(imageUrl);   // Set back image preview
      }
    }
  };

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-[85%] m-auto white-color-sl">
      <ToastContainer position="top-right" autoClose={3000} />
        <NavBar />
        <div className='body'>
            <div className='title'>
              <h2 className="section-title" data-wow-delay="0.3s">Đăng ký thông tin để bắt đầu nhận việc</h2>
              <div className="symbol-container">
                  <span>★</span>  
                  <span>★</span>  
                  <span>★</span> 
              </div>
            </div>
            <div className='flex'>

                <div className="profile-details text-center left-block">
                {/* Profile Picture */}
                    <div className="profile-image-container relative inline-block mb-6">
                        <img
                        src={profileImage || "default-profile.png"}
                        alt="Profile"
                        className="profile-image w-60 h-60 rounded-full border-4 border-gray-300 shadow-lg transition-all duration-300 hover:scale-105"
                        />
                        <input
                        type="file"
                        id="fileUpload"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                        />
                        <label
                        htmlFor="fileUpload"
                        className="upload-icon absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-3 cursor-pointer transition-all duration-300 transform hover:scale-110"
                        >
                        📷
                        </label>
                    </div>
                </div>

                <div className="right-block">
            {/* Settings Tabs */}
            <div className="settings-tabs flex justify-around mt-6 mb-4 border-b border-gray-200">

              <div
                className={`tab cursor-pointer pb-2 ${activeTab === 'basicInfo' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => handleTabChange('basicInfo')}
              >
                Thông tin cơ bản
              </div>

              <div
                className={`tab cursor-pointer pb-2 ${activeTab === 'introductionInfo' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => handleTabChange('introductionInfo')}
              >
                Giới thiệu
              </div>

              <div
                className={`tab cursor-pointer pb-2 ${activeTab === 'cccd' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => handleTabChange('cccd')}
              >
                CCCD
              </div>

            </div>

            {/* Form for Account Settings (Basic Info) */}
            {activeTab === 'basicInfo' && (
              <div className="form-container">
                <div className="form-row mb-4">
                  <label className="block text-gray-600">Tên</label>
                  <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="form-row mb-4">
                  <label className="block text-gray-600">Số điện thoại</label>
                  <input type="text" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-row mb-4">
                  <label className="block text-gray-600">Email</label>
                  <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="form-row mb-4">
                  <label className="block text-gray-600">Nơi thường trú</label>
                  <input type="text" className="input-field" value={address} onChange={(e) => setAddress(e.target.value)}/>
                </div>
                <div className="form-row mb-4">
                  <label className="block text-gray-600">Quốc tịch</label>
                  <select className="input-field" value={nationality} onChange={(e) => setNationality(e.target.value)}>
                    <option value="Vietnam">Việt Nam</option>
                    <option value="America">America</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            )}

            {/* Form for Account Settings (Introduction Info) */}
            {activeTab === 'introductionInfo' && (
                <div className="form-container">
                    {/* Option for Industry Group (Dropdown) */}
                    <div className="form-row mb-4">
                    <label className="block text-gray-600">Nhóm ngành</label>
                    <select
                      className="input-field"
                      value={industryGroup}
                      onChange={(e) => setIndustryGroup(e.target.value)}>
                      <option value="">Chọn nhóm ngành</option>
                      {jobTypes.map((jobType) => (
                          <option key={jobType.jobTypeId} value={jobType.jobTypeId}>
                              {jobType.jobTypeName}
                          </option>
                      ))}
                    </select>
                    </div>

                    {/* Text Input for Specialization */}
                    <div className="form-row mb-4">
                    <label className="block text-gray-600">Chuyên môn</label>
                    <input type="text" placeholder="Sửa chữa máy giặt" className="input-field" value={specialization} onChange={(e) => setSpecialization(e.target.value)}/>
                    </div>

                    {/* Number Input for Years of Experience */}
                    <div className="form-row mb-4">
                    <label className="block text-gray-600">Số năm kinh nghiệm</label>
                    <input type="number" min="0" placeholder="0" className="input-field" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)}/>
                    </div>

                    {/* Text Input for Self Introduction */}
                    <div className="form-row mb-6">
                    <label className="block text-gray-600">Giới thiệu bản thân</label>
                    <textarea placeholder="Hãy nhập giới thiệu bản thân bạn..." rows="8" className="input-field" value={selfIntroduction} onChange={(e) => setSelfIntroduction(e.target.value)}></textarea>
                    </div>
                </div>
                )}

            {/* Form for CCCD (Citizen ID) */}
            {activeTab === 'cccd' && (
              <div className="form-container maskA">
                <div className="form-row mb-4">
                  <label className="block text-gray-600">Mặt trước CCCD</label>
                  <input 
                    type="file" 
                    className="input-field"
                    onChange={(e) => handleCCCDUpload(e, 'front')} 
                  />
                  {/* Display preview of front CCCD image */}
                  {frontCCCD && (
                    <div className="image-preview mt-2">
                      <img src={frontCCCD} alt="Mặt trước CCCD" className="w-48 h-48 object-cover border rounded-md" />
                    </div>
                  )}
                </div>
                <div className="form-row mb-4">
                  <label className="block text-gray-600">Mặt sau CCCD</label>
                  <input 
                    type="file" 
                    className="input-field"
                    onChange={(e) => handleCCCDUpload(e, 'back')} 
                  />
                  {/* Display preview of back CCCD image */}
                  {backCCCD && (
                    <div className="image-preview mt-2">
                      <img src={backCCCD} alt="Mặt sau CCCD" className="w-48 h-48 object-cover border rounded-md" />
                    </div>
                  )}
                </div>
                <button className="update-button bg-blue-600 text-white rounded-md px-4 py-2 w-full mt-4"
                onClick={handleSubmit_}>
                  Xác nhận thông tin
                </button>
              </div>
            )}

          </div>

            </div>
        </div>
        <Footer />
    </div>
  );
};

export default RegisterWorker;