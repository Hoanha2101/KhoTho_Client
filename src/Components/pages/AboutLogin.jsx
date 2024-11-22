import React, { useState, useEffect } from 'react';
import Footer from '../FooterDiv/Footer';
import NavBarLogin from '../NavBarLogin/NavBar'; 
import Gallery from '../Gallery/Gallery';
import Logo from "../common/logo";
import "./styles/About.css";
import { FaStar } from "react-icons/fa";
import {  
  Grid, 
  Typography,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import HandymanIcon from '@mui/icons-material/Handyman';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';

const About = () => {
    const [stayLogo, setStayLogo] = useState(false);
    const [logoSize, setLogoSize] = useState(80);
    const [oldLogoSize, setOldLogoSize] = useState(80); 
    


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

	useEffect(() => {
		const handleScroll = () => {
			let scroll = Math.round(window.pageYOffset, 2);

			let newLogoSize = 80 - (scroll * 5) / 10;

			if (newLogoSize < oldLogoSize) {
				if (newLogoSize > 40) {
					setLogoSize(newLogoSize);
					setOldLogoSize(newLogoSize);
					setStayLogo(false);
				} else {
					setStayLogo(true);
				}
			} else {
				setLogoSize(newLogoSize);
				setStayLogo(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [logoSize, oldLogoSize]);

	const logoStyle = {
		display: "flex",
		position: stayLogo ? "fixed" : "relative",
		top: stayLogo ? "3vh" : "auto",
		zIndex: 999,
		border: stayLogo ? "1px solid white" : "none",
		borderRadius: stayLogo ? "50%" : "none",
		boxShadow: stayLogo ? "0px 4px 10px rgba(0, 0, 0, 0.25)" : "none",
	}; 

  return (
    <div className='w-[85%] m-auto white-color-sl'>
    <NavBarLogin/> 
      
      <React.Fragment>
        <div className="page-content">
          <div className="content-wrapper">
            <div className="homepage-logo-container">
              <div style={logoStyle}>
                <Logo width={logoSize} link={false} />
              </div>
            </div>

            <div className="homepage-container">
              <div className="homepage-first-area">
                <div className="homepage-first-area-left-side">
                  <div style={{ display: 'flex' }} className="subtitle homepage-subtitle">
                    <div>
                      <strong style={{ fontWeight: 800 }}>Kho Thợ</strong> là nền tảng tiên phong kết nối người lao động phổ thông với các cơ hội việc làm nhanh chóng và linh hoạt. 
                      Với phương châm "Việc làm gấp, thợ tới tấp," Kho Thợ giúp những cá nhân và gia đình cần thợ sửa chữa, vệ sinh, và các dịch vụ khẩn cấp khác tìm được những người lao động đáng tin cậy chỉ trong vài bước đơn giản. 
                      Đối với người lao động, Kho Thợ mang đến những cơ hội kiếm thêm thu nhập mà không cần chuẩn bị CV hay yêu cầu trình độ cao. 
                      Hệ thống danh tiếng và đánh giá giúp các thợ xây dựng uy tín và mở rộng cơ hội việc làm trong tương lai.
                    </div>
                  </div>
                </div>

                <div className="homepage-first-area-right-side">
                  <div className="homepage-image-container">
                    <div className="homepage-image-wrapper">
                      <img
                        src="https://congdankhuyenhoc.qltns.mediacdn.vn/449484899827462144/2023/9/21/sacombank-jupviec-670x376-1695293283704143958615.jpg"
                        alt="about"
                        className="homepage-image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Grid container spacing={0}   
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            py: 10,
            px: 2,
          }}
        >
          <Grid item xs={12} sm={12} md={5} component='section'>
            <Typography 
              variant='h6'
              component='h4' 
              sx={{
                fontWeight: '400',
                paddingTop: 1,
              }}
            >
              <div style={{fontSize: "35px", fontWeight: "800"}}>Chúng tôi đang cung cấp những gì?</div>
              <div style={{fontWeight: "500"}}>Nền tảng quảng bá mạnh mẽ</div>
              <div style={{fontSize: "14px", fontWeight: "300", width: "80%"}}>Cùng hệ thống tương tác hai chiều, dễ dàng đặt lịch để nhân viên đến hỗ trợ nhanh chóng cho công việc của bạn, hoặc chính bạn sẽ trở thành người làm việc để mang lại những nguồn thu nhập tuyệt vời cho chính bản thân.</div>
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              square={true}
              sx={{
                minHeight: 200,
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #ccc',
              }}
            >
              <CardContent>
                <IconButton>
                  <CleaningServicesIcon fontSize="large" color="secondary" />
                </IconButton>
                <Typography 
                  variant="h5" 
                  component="p"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Dọn dẹp
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              square={true}
              sx={{ 
                minHeight: 200,
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center', 
                border: '1px solid #ccc',
              }}
            >
              <CardContent>
                <IconButton>
                  <BabyChangingStationIcon fontSize="large" color="secondary" />
                </IconButton>
                <Typography 
                  variant="h5" 
                  component="p"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Giữ trẻ
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}
            sx={{
              display: {xs: 'none', sm: 'block'},
            }}  
          >
            <Card 
              square={true}
              sx={{ 
                boxShadow: 'none',
                minHeight: 180,
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <CardContent>
                <ArrowCircleRightIcon fontSize="large" color="secondary" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>    
            <Card 
              square={true}
              sx={{ 
                minHeight: 200,
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center', 
                border: '1px solid #ccc'
              }}
            >
              <CardContent>
                <IconButton>
                  <FastfoodOutlinedIcon fontSize="large" color="secondary" />
                </IconButton>
                <Typography 
                  variant="h5" 
                  component="p"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Nấu ăn
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              square={true}
              sx={{ 
                minHeight: 200,
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',                    
                border: '1px solid #ccc',
              }}
            >
              <CardContent>
                <IconButton>
                  <HandymanIcon fontSize="large" color="secondary" />
                </IconButton>
                <Typography 
                  variant="h5" 
                  component="p"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Sửa chữa
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              square={true}
              sx={{ 
                minHeight: 200,
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center', 
                border: '1px solid #ccc',
              }}
            >
              <CardContent>
                <IconButton>
                  <MoreHorizTwoToneIcon fontSize="large" color="secondary" />
                </IconButton>
                <Typography 
                  variant="h5" 
                  component="p"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Và nhiều hơn nữa
                </Typography>
              </CardContent>
            </Card>
          </Grid> 
        </Grid>
      </React.Fragment>

      <section id="testimonial" className="testimonial section-padding py-10">
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold mb-2'>FIFTYM</h2>
          <p className='text-xl text-gray-600'>Những người sáng lập nên nền tảng</p>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CEO Card */}
            <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-4">
                  <img src="src/Assets/testimonial/img1.jpg" 
                       alt="Hà Khải Hoàn" 
                       className="w-full h-full rounded-full object-cover"/>
                </div>
                <h2 className="text-xl font-bold">Hà Khải Hoàn</h2>
                <h3 className="text-gray-600 font-semibold mb-2">CEO</h3>
                <p className="text-gray-700 text-center mb-4">
                  Người lãnh đạo cao nhất, chịu trách nhiệm định hướng chiến lược tổng thể, quản lý hoạt động chung
                </p>
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            </div>

            {/* CFO Card */}
            <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-4">
                  <img src="src/Assets/testimonial/img2.jpg" 
                       alt="Hồ Thị Kính" 
                       className="w-full h-full rounded-full object-cover"/>
                </div>
                <h2 className="text-xl font-bold">Hồ Thị Kính</h2>
                <h3 className="text-gray-600 font-semibold mb-2">CFO</h3>
                <p className="text-gray-700 text-center mb-4">
                  Quản lý tài chính, lập kế hoạch tài chính, kiểm soát ngân sách, và đảm bảo dòng tiền ổn định cho hoạt động
                </p>
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            </div>

            {/* CSMO Card */}
            <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-4">
                  <img src="src/Assets/testimonial/img3.jpg" 
                       alt="Võ T.Thu Thảo" 
                       className="w-full h-full rounded-full object-cover"/>
                </div>
                <h2 className="text-xl font-bold">Võ T.Thu Thảo</h2>
                <h3 className="text-gray-600 font-semibold mb-2">CSMO</h3>
                <p className="text-gray-700 text-center mb-4">
                  Định hướng và thực hiện chiến lược bán hàng và marketing, phát triển thương hiệu và mở rộng thị trường
                </p>
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            </div>

            {/* CPO Card */}
            <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-4">
                  <img src="src/Assets/testimonial/img4.jpg" 
                       alt="Nguyễn Trọng Nghĩa" 
                       className="w-full h-full rounded-full object-cover"/>
                </div>
                <h2 className="text-xl font-bold">Nguyễn Trọng Nghĩa</h2>
                <h3 className="text-gray-600 font-semibold mb-2">CPO</h3>
                <p className="text-gray-700 text-center mb-4">
                  Quản lý phát triển sản phẩm, tập trung vào việc cải thiện và đảm bảo sản phẩm đáp ứng nhu cầu thị trường và khách hàng
                </p>
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            </div>

            {/* CTO Card */}
            <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-4">
                  <img src="src/Assets/testimonial/img5.jpg" 
                       alt="Nguyễn Ngọc Dũng" 
                       className="w-full h-full rounded-full object-cover"/>
                </div>
                <h2 className="text-xl font-bold">Nguyễn Ngọc Dũng</h2>
                <h3 className="text-gray-600 font-semibold mb-2">CTO</h3>
                <p className="text-gray-700 text-center mb-4">
                  Chịu trách nhiệm phát triển và quản lý công nghệ, định hướng về kỹ thuật để đảm bảo sản phẩm đạt chất lượng
                </p>
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            </div>

            {/* COO Card */}
            <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-4">
                  <img src="src/Assets/testimonial/img6.jpg" 
                       alt="Võ T.Kim Chung" 
                       className="w-full h-full rounded-full object-cover"/>
                </div>
                <h2 className="text-xl font-bold">Võ T.Kim Chung</h2>
                <h3 className="text-gray-600 font-semibold mb-2">COO</h3>
                <p className="text-gray-700 text-center mb-4">
                  Quản lý vận hành hàng ngày của công ty, đảm bảo các quy trình hoạt động hiệu quả và tối ưu hóa nguồn lực
                </p>
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

export default About;