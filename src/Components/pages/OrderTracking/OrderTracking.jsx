import React, { useEffect, useState } from 'react';
import Footer from '../../FooterDiv/Footer';
import NavBar from '../../NavBarLogin/NavBar';
import Search from '../../SearchNOFilter/Search'
import axios from "axios";

import { API_ENDPOINT } from "../../../services/config";

import * as config from "../../../services/config";
import "./OrderTracking.css"

import { useParams, useLocation } from "react-router-dom";

const OrderTracking = () => {
    const [jobTypeMapping, setJobTypeMapping] = useState({});
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [isRatingStep, setRatingStep] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isBoxCompleted, setIsBoxCompleted] = useState(false);
    const [isEndRating, setIsEndRating] = useState(false);

    const [loading, setLoading] = useState(true); // Trạng thái loading
    const userDataString = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem('authToken')
    const location = useLocation();
    const booking_id = location.state;

    const [dataBookingOrder, setDataBookingOrder] = useState(null);
    const [dataWorkerOrder, setDataWorkerOrder] = useState(null);

    const removeVietnameseTones = (str) => {
        return str
            .normalize("NFD") // Chuẩn hóa chuỗi Unicode
            .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
            .replace(/đ/g, "d") // Chuyển đổi chữ đ
            .replace(/Đ/g, "D") // Chuyển đổi chữ Đ
            .replace(/\s+/g, "") // Xóa khoảng trắng
            .toUpperCase(); // Chuyển tất cả chữ thành viết hoa
    };


    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response_book = await axios.get(`${API_ENDPOINT}/api/Booking/${booking_id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("+++++",response_book.data)

                const response_worker = await axios.get(
                    `${API_ENDPOINT}/api/Workers/${response_book.data.workerID}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const response_jobtype = await axios.get(
                    `${API_ENDPOINT}/api/JobTypes`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const jobTypeData =  response_jobtype.data;

                const mapping = jobTypeData.reduce((acc, job) => {
                    acc[job.jobTypeId] = job.jobTypeName;
                    return acc;
                }, {});

                setJobTypeMapping(mapping);
                setDataBookingOrder(response_book.data);
                setDataWorkerOrder(response_worker.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching booking details:", error);
                setLoading(false);
            }
        };
        fetchBookingDetails()
    }, [booking_id, token]);

    if (loading) {
        return (
            <div className="loading-screen">
                <p>Đang tải dữ liệu...</p>
                {/* Bạn có thể thay thế bằng một spinner hoặc hiệu ứng loading khác */}
            </div>
        );
    }

    if (!dataBookingOrder || !dataWorkerOrder) {
        return (
            <div className="error-screen">
                <p>Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.</p>
            </div>
        );
    }

    const WORKER_name = dataWorkerOrder.user.fullName
    const WORKER_address = dataWorkerOrder.user.address
    // const WORKER_jobType = dataWorkerOrder.user.userType
    const WORKER_phone = dataWorkerOrder.user.phoneNumber
    const WORKER_EXP = dataWorkerOrder.experienceYears

    const handleConfirm = () => {
        setIsBoxCompleted(true);
        
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    }
    const handleCloseModal = () => {
        setModalOpen(false);
        setRatingStep(false);
        setIsBoxCompleted(false)
        setRating(0);
        setComment('');
    };

    const handleConfirmJob = () => {
        setRatingStep(true);
        setIsCompleted(true);
    }
    console.log(dataBookingOrder)
    const handleSubmitRating = async () => {
        try {

            const payload = {
                workerId: dataBookingOrder.workerID,  
                customerId: dataBookingOrder.customerID,  
                rating: rating,  
                comments: comment,  
            };
    
            // Gửi POST request
            const response_rating = await axios.post(
                `${API_ENDPOINT}/api/Reviews`, 
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );

            const status = "Completed"; 
            const response_status = await axios.put(
                `${API_ENDPOINT}/api/Booking/${booking_id}/status`,  
                `${status}`, 
                {
                    headers: {
                        'Content-Type': 'application/json',  
                        'Authorization': `Bearer ${token}`,  
                    }
                }
            );




    
            setIsEndRating(true);  
            handleCloseModal();  
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
        }
    };

    const getStepClass = (status, step) => {
        if (status === "Rejected") {
          return step === 1 ? "completed" : "rejected"; // Mốc 1 xanh, các mốc còn lại đỏ
        }
      
        if (status === "Completed" && step <= 4) {
          return "completed"; // Tất cả các mốc xanh khi Completed
        }
      
        if (status === "Accepted" && step <= 3) {
          return "completed"; // Mốc 1, 2, 3 xanh khi Accepted
        }
      
        if (status === "Pending" && step === 1) {
          return "completed"; // Mốc 1 xanh khi Pending
        }
      
        return "active"; // Các mốc còn lại chưa hoàn thành
      };
      
      const getStepIcon = (status, step) => {
        if (status === "Rejected") {
          return step === 1 ? "✔" : "✖"; // Mốc 1 dấu ✔, các mốc còn lại dấu X
        }
      
        if (status === "Completed" && step <= 4) {
          return "✔"; // Dấu tích cho tất cả mốc khi Completed
        }
      
        if (status === "Accepted" && step <= 3) {
          return "✔"; // Dấu tích cho mốc 1, 2, 3 khi Accepted
        }
      
        if (status === "Pending" && step === 1) {
          return "✔"; // Dấu tích cho mốc 1 khi Pending
        }
      
        return "!"; // Dấu chấm than cho mốc chưa hoàn thành
      };
      
      const progressStepColor = (status, step) => {
        if (status === "Rejected") {
          return step === 1 ? "green" : "red"; // Mốc 1 xanh, các mốc còn lại đỏ
        }
      
        return "green"; // Màu xanh khi hoàn thành
      };


    return (
        <div className="w-[85%] m-auto white-color-sl">
            <NavBar />

            <div className="body-check">

                <div className='title'>
                    <h2 className="section-title" data-wow-delay="0.3s">THEO DÕI ĐƠN</h2>
                    <div className="symbol-container">
                        <span>🛒</span>  
                    </div>
                </div>

                <div className='progressBlock'>
                    <div className='progressTitle'>
                    <h3 className="progressTitle-content" data-wow-delay="0.3s">Tiến độ</h3>
                    </div>
                    <div className="progressContainer">
                    {[...Array(4)].map((_, index) => {
                        const step = index + 1;
                        const statusClass = getStepClass(dataBookingOrder.status, step);
                        const stepIcon = getStepIcon(dataBookingOrder.status, step);
                        const stepColor = progressStepColor(dataBookingOrder.status);

                        return (
                        <React.Fragment key={step}>
                            <div className={`progressStep ${statusClass}`} style={{ color: stepColor }}>
                            <div className="stepIcon">{stepIcon}</div>
                            <span className="stepLabel">
                                {step === 1 ? "Booking" : step === 2 ? "Đã xác nhận" : step === 3 ? "Đang thực hiện" : "Hoàn thành"}
                            </span>
                            </div>
                            {step < 4 && <div className="connector"></div>}
                        </React.Fragment>
                        );
                    })}
                    </div>
                </div>

                <div className="header">
                    <div className='header-left'>
                        <span className="totalAmount-title">Mã đơn:</span>
                        <span className="totalAmount">{dataBookingOrder.bookingID}-{removeVietnameseTones(WORKER_name)}</span>
                    </div>
                    <div className='header-right'>
                        <div className='Amount-Block'>
                            <span className="totalAmount-title">Tổng số tiền</span>
                            <span className="totalAmount">đ̲{dataBookingOrder.totalAmount}</span>
                        </div>
                        <div className='button-block'>
                            {dataBookingOrder.status !== ("Rejected" && "Completed") && (
                            <>
                                {!isCompleted && (
                                <button className="placeOrderButton" onClick={handleConfirm}>
                                    Xác nhận hoàn thành
                                </button>
                                )}

                                {!isEndRating && (
                                <button className="placeOrderButton" onClick={handleOpenModal}>
                                    Đánh giá
                                </button>
                                )}
                            </>
                            )}
                        </div>
                    </div>
                </div>
                
                
                <div>
                    <div className='progressTitle'>
                        <h3 className="progressTitle-content" data-wow-delay="0.3s">Thông tin chi tiết</h3>
                    </div>
                    <div className="infoSection">
                        <div className="infoCard">
                            <div className="cardHeader">
                                <span>Thông tin của bạn</span>
                                {/* <a href="#" className="editLink">Edit</a> */}
                            </div>
                            <div className="cardContent">
                                <p>{userDataString.fullName}</p>
                                <p>{userDataString.email}</p>
                            </div>
                        </div>

                        <div className="infoCard">
                            <div className="cardHeader">
                                <span>Thông tin của thợ</span>
                                {/* <a href="#" className="editLink">Edit</a> */}
                            </div>
                            <div className="cardContent">
                                <p>{WORKER_name}</p>
                                <p>{WORKER_address}</p>
                                <p>{WORKER_phone}</p>
                            </div>
                        </div>

                        <div className="infoCard">
                            <div className="cardHeader">
                                <span>Địa chỉ của bạn</span>
                                {/* <a href="#" className="editLink">Edit</a> */}
                            </div>
                            <div className="cardContent">
                                <p>{userDataString.address}</p>
                                <p>{userDataString.phoneNumber}</p>
                            </div>
                        </div>

                        <div className="infoCard">
                            <div className="cardHeader">
                                <span>Phương thức thanh toán</span>
                                {/* <a href="#" className="editLink">Edit</a> */}
                            </div>
                            <div className="cardContent">
                                <img src="https://img.icons8.com/?size=100&id=aMTIdm5CdddP&format=png&color=000000" alt="Visa" className="paymentIcon" />
                                <p>Visa card ending in 1234</p>
                                <img src="https://img.icons8.com/?size=100&id=p2scHNLP9nSb&format=png&color=000000" alt="Visa" className="paymentIcon" />
                                <p>Thanh toán bằng tiền mặt</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="itemSection">
                    <div className="tableHeader">
                        <span>Thợ</span>
                        <span>Địa chỉ</span>
                        <span>Nhóm ngành</span>
                        <span>Tổng giờ</span>
                        <span>Đơn giá</span>
                        <span>Thành tiền</span>
                    </div>

                    <div className="itemRow">
                        <div className="itemInfo">
                            <img src="src\Assets\about\worker.png" alt="item" className="itemImage" />
                            <div>
                                <p>{WORKER_name}</p>
                                <p>{WORKER_EXP} Năm kinh nghiệm</p>
                                {/* <a href="#" className="removeLink">Remove</a> */}
                            </div>
                        </div>
                        <span>{WORKER_address}</span>
                        <span>{jobTypeMapping[dataBookingOrder.jobTypeID]}</span>
                        <span>{dataBookingOrder.totalHours}</span>
                        <span>{dataBookingOrder.hourlyRate}</span>
                        <span>{dataBookingOrder.totalAmount}</span>
                    </div>
                </div>
            </div>
            <div className='separate-box'>
                <div className='separate'></div>
            </div>
            <div>
                <div className='title'>
                    <h2 className="section-title" data-wow-delay="0.3s">TUYỂN NHIỀU THỢ HƠN</h2>
                </div>
                <Search/>
            </div>
            <div className='margin-box'></div>
            
            {isBoxCompleted && !isCompleted && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <>
                        <h3>Xác nhận công việc đã hoàn thành</h3>
                        <div className="modal-buttons">
                        <button className="confirm-button" onClick={handleConfirmJob}>
                            Xác nhận
                        </button>
                        <button className="cancel-button" onClick={handleCloseModal}>
                            Hủy
                        </button>
                        </div>
                        </>
                    </div>
                </div>
            )};


            {isModalOpen && (
                <div className="modal-overlay">
                <div className="modal-content">
                    {!isRatingStep && !isCompleted ? (
                    <>
                        <h3>Xác nhận công việc đã hoàn thành</h3>
                        <div className="modal-buttons">
                        <button className="confirm-button" onClick={handleConfirmJob}>
                            Xác nhận
                        </button>
                        <button className="cancel-button" onClick={handleCloseModal}>
                            Hủy
                        </button>
                        </div>
                    </>
                    ) : (
                    <>
                        <h3>Đánh giá công việc</h3>
                        <div className="rating-section">
                        <span>Chọn số sao</span>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? 'selected' : ''}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                            ))}
                        </div>
                        </div>
                        <div className="comment-section">
                        <textarea
                            placeholder="Nhập nhận xét của bạn..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        </div>
                        <div className="modal-buttons">
                        <button className="confirm-button" onClick={handleSubmitRating}>
                            Gửi đánh giá
                        </button>
                        <button className="cancel-button" onClick={handleCloseModal}>
                            Hủy
                        </button>
                        </div>
                    </>
                    )}
                </div>
                </div>
            )}

            <Footer />
            
        </div>
    );
};

export default OrderTracking;