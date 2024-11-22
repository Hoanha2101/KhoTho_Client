import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../FooterDiv/Footer';
import NavBar from '../NavBar/NavBar';
import * as config from "../../services/config.jsx"; // Ensure this file contains the correct API URL
import { useNavigate } from "react-router-dom";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import HandymanIcon from '@mui/icons-material/Handyman';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import { Button, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';

import "./styles/Jobs.css"

const Jobs = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [jobTypes, setJobTypes] = useState([]);
  const [alert, setAlert] = useState({ show: false, severity: 'success', message: '' });
  
  const [formData, setFormData] = useState({
    experienceYears: '',
    bio: '',
    jobTypeIds: []
  });

  useEffect(() => {
    // Fetch user data
    axios.get(`${config.API_URL}/api/Users`)
      .then(response => {
        setUser(response.data[0]); // For demo purposes, using first user
      })
      .catch(error => console.error('Error fetching user:', error));

    // Fetch job types
    axios.get(`${config.API_URL}/api/JobTypes`)
      .then(response => {
        setJobTypes(response.data);
      })
      .catch(error => console.error('Error fetching job types:', error));
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "jobTypeIds" ? value : value.split(',') // Handling multiple selections
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_URL}/api/Workers`, {
        userId: user.userId,
        experienceYears: parseInt(formData.experienceYears),
        rating: 0,
        bio: formData.bio,
        verified: true,
        jobTypeIds: Array.isArray(formData.jobTypeIds) ? formData.jobTypeIds : [formData.jobTypeIds]
      });

      setAlert({
        show: true,
        severity: 'success',
        message: 'Đăng ký thành công!'
      });
      handleClose();
    } catch (error) {
      setAlert({
        show: true,
        severity: 'error',
        message: 'Đăng ký thất bại. Vui lòng thử lại!'
      });
    }
  };

  return (
    <div className="w-[85%] m-auto bg-white">
      <NavBar/>
      
      {alert.show && (
        <Alert 
          severity={alert.severity}
          onClose={() => setAlert({...alert, show: false})}
          sx={{ marginBottom: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      {user?.userType === 1 && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpen}
          sx={{ margin: '20px 0' }}
        >
          Đăng ký làm thợ
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Đăng ký làm thợ</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ width: '400px', padding: '20px' }}>
            <TextField
              fullWidth
              label="Số năm kinh nghiệm"
              name="experienceYears"
              type="number"
              value={formData.experienceYears}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Giới thiệu bản thân"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Loại công việc</InputLabel>
              <Select
                multiple
                name="jobTypeIds"
                value={formData.jobTypeIds}
                onChange={handleChange}
                required
              >
                {jobTypes.map((jobType) => (
                  <MenuItem key={jobType.jobTypeId} value={jobType.jobTypeId}>
                    {jobType.jobTypeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Đăng ký
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <section id="services" className="section-padding white-color-sl">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title wow fadeInDown" data-wow-delay="0.3s">CHÚNG TÔI ĐANG QUẢNG BÁ</h2>
            <div className="shape wow fadeInDown" data-wow-delay="0.3s"></div>
          </div>
          <div className="row">

            <div className="col-md-6 col-lg-4 col-xs-12 white-color-sl">
              <div className="services-item wow fadeInRight" data-wow-delay="0.3s" onClick={() => navigate("/jobs")}>
                <div className="icon">
                  <CleaningServicesIcon fontSize="large"/>
                </div>
                <div className="services-content">
                  <h3><a>DỌN DẸP</a></h3>
                  <p>Các công việc vệ sinh liên quan đến làm sạch ngôi nhà của bạn</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xs-12 white-color-sl">
              <div className="services-item wow fadeInRight" data-wow-delay="0.6s" onClick={() => navigate("/jobs")}>
                <div className="icon">
                  <BabyChangingStationIcon fontSize="large"/>
                </div>
                <div className="services-content">
                  <h3><a>GIỮ TRẺ</a></h3>
                  <p>Đây là sự lựa chọn tuyệt vời cho nhưng gia đình bận rộn, những đứa trẻ luôn là sự quan tâm hàng đầu</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xs-12 white-color-sl">
              <div className="services-item wow fadeInRight" data-wow-delay="0.9s" onClick={() => navigate("/jobs")}>
                <div className="icon">
                  <HandymanIcon fontSize="large"/>
                </div>
                <div className="services-content">
                  <h3><a>SỬA CHỮA</a></h3>
                  <p>Sửa các thiết bị đang bị hỏng tại nhà, hoặc các vấn đề bất ngờ đối với xe của bạn</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xs-12 white-color-sl">
              <div className="services-item wow fadeInRight" data-wow-delay="1.2s" onClick={() => navigate("/jobs")}>
                <div className="icon">
                  <FastfoodOutlinedIcon fontSize="large"/>
                </div>
                <div className="services-content">
                  <h3><a>COOK</a></h3>
                  <p>Có rất nhiều người mang tài năng nấu nướng, bạn có thể đặt lịch hẹn để có được bữa ăn thú vị hơn</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xs-12 white-color-sl">
              <div className="services-item wow fadeInRight" data-wow-delay="1.5s" onClick={() => navigate("/jobs")}>
                <div className="icon">
                  <DriveEtaIcon fontSize="large"/>
                </div>
                <div className="services-content">
                  <h3><a>DRIVER</a></h3>
                  <p>Các anh tài xế sẽ đưa bạn về nhà an toàn sau những cuộc nhậu</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xs-12 white-color-sl">
              <div className="services-item wow fadeInRight" data-wow-delay="1.8s" onClick={() => navigate("/jobs")}>
                <div className="icon">
                  <AvTimerIcon fontSize="large"/>
                </div>
                <div className="services-content">
                  <h3><a>GIAO HÀNG</a></h3>
                  <p>Đưa hàng đến tận tay khách hàng nhanh nhất và an toàn nhất</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;