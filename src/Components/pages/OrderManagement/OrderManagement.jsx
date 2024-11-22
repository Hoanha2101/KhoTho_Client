import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../FooterDiv/Footer";
import NavBar from "../../NavBarLogin/NavBar";
import axios from "axios";
import { API_ENDPOINT } from "../../../services/config";
import "./OrderManagement.css";

const OrderManagement = () => {

  const [jobTypeMapping, setJobTypeMapping] = useState({});

  const navigate = useNavigate();
  const USERnow = JSON.parse(localStorage.getItem("userData"));
  const userID = USERnow.userId;
  const token = localStorage.getItem("authToken");

  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");

  const [workers, setWorkers] = useState({});

  useEffect(() => {
    const fetchALLBookingDetails = async () => {
      try {
        const ALL_book = await axios.get(`${API_ENDPOINT}/api/Booking/customer/${userID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const ALL_jobtype = await axios.get(`${API_ENDPOINT}/api/JobTypes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const jobTypeData = ALL_jobtype.data;
        const mapping = jobTypeData.reduce((acc, job) => {
            acc[job.jobTypeId] = job.jobTypeName;
            return acc;
        }, {});

        setJobTypeMapping(mapping); 

        const filteredBookings = ALL_book.data.filter(
          (booking) => booking.customerID === userID
        );
        setBookings(filteredBookings);
  
        // Fetch worker details for each booking
        const workerDetails = {};
        for (const booking of filteredBookings) {
          if (booking.workerID) {
            try {
              const workerResponse = await axios.get(
                `${API_ENDPOINT}/api/Workers/${booking.workerID}`,
                {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                  },
                }
              );
              workerDetails[booking.workerID] = workerResponse.data;
            } catch (error) {
              console.error("Error fetching worker details:", error);
            }
          }
        }
        setWorkers(workerDetails);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
  
    fetchALLBookingDetails();
  }, [token, userID]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');  // Lấy ngày và thêm số 0 nếu cần
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Lấy tháng (tháng bắt đầu từ 0, cộng thêm 1)
    const year = date.getFullYear();  // Lấy năm
  
    return `${day}/${month}/${year}`;  // Định dạng ngày theo kiểu dd/mm/yyyy
  }

  const handleNavigate = (bookingID) => {
    setTimeout(() => navigate("/khotho/ordertracking", { state: bookingID }), 200);
  };

  // Phân nhóm bookings theo trạng thái
  const filterBookingsByStatus = (status) => {
    return bookings.filter((booking) => booking.status === status);
  };

  return (
    <div className="w-[85%] m-auto white-color-sl">
      <NavBar />

      {/* Các Tab tiêu đề */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === "Pending" ? "active" : ""}`}
          onClick={() => setActiveTab("Pending")}
        >
          Đơn hàng chờ xử lý
        </div>
        <div
          className={`tab ${activeTab === "Accepted" ? "active" : ""}`}
          onClick={() => setActiveTab("Accepted")}
        >
          Đơn hàng đang thực hiện
        </div>
        <div
          className={`tab ${activeTab === "Completed" ? "active" : ""}`}
          onClick={() => setActiveTab("Completed")}
        >
          Đơn hàng đã hoàn thành
        </div>
        <div
          className={`tab ${activeTab === "Rejected" ? "active" : ""}`}
          onClick={() => setActiveTab("Rejected")}
        >
          Đơn hàng đã từ chối
        </div>
      </div>

      {/* Các Booking tương ứng với trạng thái đã chọn */}
      <div className="booking-list">
        {filterBookingsByStatus(activeTab).map((booking) => (
            <div
            key={booking.bookingID}
            className="booking-card"
            onClick={() => handleNavigate(booking.bookingID)}
            >
            <h4>{`Thời gian đặt: ${formatDate(booking.bookingDate)}`}</h4>
            <p>
                Ghi chú: {booking.notes} |{" "}
                <span
                className={`status ${
                    activeTab === "Pending"
                    ? "Pending"
                    : activeTab === "Accepted"
                    ? "Accepted"
                    : activeTab === "Completed"
                    ? "Completed"
                    : "Rejected"
                }`}
                >
                {activeTab === "Pending"
                    ? "Chờ xử lý"
                    : activeTab === "Accepted"
                    ? "Đang thực hiện"
                    : activeTab === "Completed"
                    ? "Hoàn thành"
                    : "Đã từ chối"}
                </span>
            </p>

      {/* Display worker details if available */}
      {workers[booking.workerID] && (
        <div className="worker-details">
          <p>{`Thợ: ${workers[booking.workerID].user.fullName}`}</p>
          <p>{`Kinh nghiệm: ${workers[booking.workerID].experienceYears} năm`}</p>
          <p>{`Đánh giá: ${workers[booking.workerID].rating}`}</p>
          <p>{`Giới thiệu: ${workers[booking.workerID].bio}`}</p>
          {/* <h2 className="job">{`Chuyên môn: ${jobTypeMapping[workers[booking.workerID].user.userType]}`}</h2> */}
          <h2 className="Expertise">{jobTypeMapping[workers[booking.workerID].user.userType]}</h2>
        </div>
      )}
    </div>
  ))}
</div>

    </div>
  );
};

export default OrderManagement;
