// import React from 'react'
import NavBar from '../NavBarLogin/NavBar'
import ContactForm from '../Contact/Contact';
import Social from '../Contact/Social';
import Footer from '../FooterDiv/Footer'
import { Container } from "react-bootstrap";
import { FaGift, FaBox, FaStar, FaCalendarAlt } from 'react-icons/fa';
import React from 'react';
import "./styles/Contact2.css"

const ContactLogin = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   console.log("Token fetched:", token);
  //   setIsLoggedIn(!!token);
  // }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("authToken");
  //   setIsLoggedIn(false);
  // };

  // console.log("Auth Token:", localStorage.getItem("authToken"));
  // console.log("isLoggedIn:", isLoggedIn);

  return (
    <div className='w-[85%] m-auto white-color-sl'>
     <NavBar />
        <Container className='white-color-sl'>
          <ContactForm />
          <section id="contact" className="section-padding bg-gray">
          <div className="container">
            <div className="section-header text-center white-color-sl">
              <h2 className="section-title wow fadeInDown" data-wow-delay="0.3s">Liên hệ với chúng tôi</h2>
              <div className="shape wow fadeInDown" data-wow-delay="0.3s"></div>
            </div>
            <div className="row contact-form-area wow fadeInUp " data-wow-delay="0.3s">
              <div className="col-lg-7 col-md-12 col-sm-12 ">
                <section id="cta" className="section-padding">
                  <div className="container white-color-sl">
                    <div className="row ">
                      <div className="col-lg-6 col-xs-12 wow fadeInLeft" data-wow-delay="0.3s">
                        <div className="cta-text">
                          <h4 className='cta-text-h4'>Chúng tôi luôn sẵn sàng để hỗ trợ bạn</h4><br />
                          <h5 className='cta-text-h5'>Trụ sở của của tôi được chia sẻ công khai, bạn cần hỗ trợ trực tiếp, hãy tìm kiếm và chúng tôi luôn luôn chào đón.</h5>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xs-12 text-right wow fadeInRight" data-wow-delay="0.3s">
                        <a rel="nofollow" href="https://rebrand.ly/fusion-ud" className="btn btn-common">Liên hệ ngay</a>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
      <div className="col-lg-5 col-md-12 col-xs-12">
        <div className="map">
          <iframe
            style={{ border: 0, height: '280px', width: '100%' }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.584811421889!2d109.21657047468118!3d13.803884386593419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f6bf778c80973%3A0x8a7d0b5aa0af29c7!2zxJDhuqFpIGjhu41jIEZQVCBRdXkgTmjGoW4!5e0!3m2!1svi!2sus!4v1730099591225!5m2!1svi!2sus" 
            allowFullScreen=""
            loading="lazy"
            title="Google Map"
          ></iframe>
        </div>
      </div>
    </div>
        </div>
      </section>

          
<div className="container my-5">
  <div className="row align-items-center cta-section">
    <div className="col-lg-8 col-xs-12 wow fadeInLeft" data-wow-delay="0.3s">
      <div className="cta-text">
        <h4 className="cta-text-h4">Hãy dùng thử miễn phí</h4>
        <p className="cta-text-p">
          Hãy quảng bá khả năng của bạn trên nền tảng của chúng tôi, nó hoàn toàn miễn phí cho đến khi bạn có đơn đầu tiên.
        </p>
      </div>
    </div>
    <div className="col-lg-4 col-xs-12 text-lg-right text-center wow fadeInRight" data-wow-delay="0.3s">
      <a href="#" className="cta-btn">Đăng ký</a>
    </div>
  </div>
  </div>


          {/* Các gói */}
          <section id="pricing" className="section-padding py-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-2">Các gói dịch vụ</h2>
                    <p className="text-xl text-gray-600">Chọn gói dịch vụ phù hợp với nhu cầu của bạn</p>
                </div>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                        {/* Gói Free */}
                        <div className="pricing-item bg-white p-6 rounded-lg shadow-lg flex flex-col text-center">
                            <div className="icon-box mb-4">
                                <FaGift className="text-4xl text-yellow-500" />
                            </div>
                            <p className="price-value text-2xl font-bold mb-2">0 VND</p>
                            <h3 className="text-xl font-semibold mb-4">Gói Miễn Phí</h3>
                            <div className="description flex-grow text-gray-700 mb-4">
                                <ul>
                                    <li>Tạo hồ sơ và khám phá nền tảng</li>
                                    <li>Đăng bài và duyệt danh sách công việc</li>
                                    <li>Không thu phí trước khi hoàn thành công việc đầu tiên</li>
                                    <li>Hỗ trợ giới hạn, phản hồi trong vòng 48 giờ</li>
                                </ul>
                            </div>
                            <button className="btn btn-common bg-yellow-500 text-white px-4 py-2 rounded-md mt-auto">Bắt đầu ngay</button>  
                        </div>
                        
                        {/* Gói Tháng */}
                        <div className="pricing-item bg-white p-6 rounded-lg shadow-lg flex flex-col text-center">
                            <div className="icon-box mb-4">
                                <FaBox className="text-4xl text-yellow-500" />
                            </div>
                            <p className="price-value text-2xl font-bold mb-2">49,000 VND<span className="text-sm"> /tháng</span></p>
                            <h3 className="text-xl font-semibold mb-4">Gói Tháng</h3>
                            <div className="description flex-grow text-gray-700 mb-4">
                                <ul>
                                    <li>Thanh toán theo nhu cầu, hủy bất kỳ lúc nào</li>
                                    <li>Phù hợp với nhu cầu ngắn hạn hoặc không thường xuyên</li>
                                    <li>Hỗ trợ khách hàng nhanh hơn (phản hồi trong 24 giờ)</li>
                                </ul>
                            </div>
                            <button className="btn btn-common bg-yellow-500 text-white px-4 py-2 rounded-md mt-auto">Đăng ký ngay</button> 
                        </div>

                        {/* Gói Quý */}
                        <div className="pricing-item bg-white p-6 rounded-lg shadow-lg flex flex-col text-center">
                            <div className="icon-box mb-4">
                                <FaCalendarAlt className="text-4xl text-yellow-500" />
                            </div>
                            <p className="price-value text-2xl font-bold mb-2">139,000 VND<span className="text-sm"> /quý</span></p>
                            <h3 className="text-xl font-semibold mb-4">Gói Quý</h3>
                            <div className="description flex-grow text-gray-700 mb-4">
                                <ul>
                                    <li>Truy cập dịch vụ khách hàng ưu tiên</li>
                                    <li>Thay thế nhân công một lần miễn phí nếu không hài lòng</li>
                                    <li>Tiết kiệm hơn so với gói tháng</li>
                                </ul>
                            </div>
                            <button className="btn btn-common bg-yellow-500 text-white px-4 py-2 rounded-md mt-auto">Đăng ký ngay</button>
                        </div>

                        {/* Gói Năm */}
                        <div className="pricing-item bg-white p-6 rounded-lg shadow-lg flex flex-col text-center">
                            <div className="icon-box mb-4">
                                <FaStar className="text-4xl text-yellow-500" />
                            </div>
                            <p className="price-value text-2xl font-bold mb-2">499,000 VND<span className="text-sm"> /năm</span></p>
                            <h3 className="text-xl font-semibold mb-4">Gói Năm</h3>
                            <div className="description flex-grow text-gray-700 mb-4">
                                <ul>
                                    <li>Hỗ trợ cao cấp toàn diện</li>
                                    <li>1 lần đăng bài công việc miễn phí</li>
                                    <li>Phiếu giảm giá dịch vụ của đối tác</li>
                                    <li>Tiết kiệm cao nhất</li>
                                </ul>
                            </div>
                            <button className="btn btn-common bg-yellow-500 text-white px-4 py-2 rounded-md mt-auto">Đăng ký ngay</button>
                        </div>

                    </div>
                </div>
            </section>


          <Social />
        </Container>
        <Footer/>
    </div>
  )
}

export default ContactLogin
