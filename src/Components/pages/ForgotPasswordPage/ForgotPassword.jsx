import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TEInput, TERipple } from "tw-elements-react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { API_ENDPOINT } from "../../../services/config";
import "./ForgotPassword.css";
import bgrLogin from "../../../Assets/bgr-login.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const navigate = useNavigate();

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    if (!validateEmail(email)) {
      setNotification({
        open: true,
        message: "Vui lòng nhập email hợp lệ!",
        severity: "error"
      });
      return;
    }

    try {
      const checkEmailResponse = await axios.get(
        `${API_ENDPOINT}/api/Users/email/${encodeURIComponent(email)}`
      );

      if (checkEmailResponse.data) {
        const response = await axios.post(
          `${API_ENDPOINT}/api/Password/forgot-password`,
          { email }
        );

        setConfirmedEmail(email);
        setNotification({
          open: true,
          message: "Mã OTP đã được gửi đến email của bạn!",
          severity: "success"
        });
        setStep(2);
        startCountdown();
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.status === 404
          ? "Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại!"
          : "Có lỗi xảy ra. Vui lòng thử lại sau!",
        severity: "error"
      });
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      await axios.post(
        `${API_ENDPOINT}/api/Password/forgot-password`,
        { email: confirmedEmail }
      );
      
      setNotification({
        open: true,
        message: "Mã OTP mới đã được gửi đến email của bạn!",
        severity: "success"
      });
      startCountdown();
    } catch (error) {
      setNotification({
        open: true,
        message: "Có lỗi xảy ra khi gửi lại mã OTP. Vui lòng thử lại sau!",
        severity: "error"
      });
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      setNotification({
        open: true,
        message: "Vui lòng nhập đầy đủ thông tin!",
        severity: "error"
      });
      return;
    }

    if (newPassword.length < 6) {
      setNotification({
        open: true,
        message: "Mật khẩu phải có ít nhất 6 ký tự!",
        severity: "error"
      });
      return;
    }

    try {
      await axios.post(
        `${API_ENDPOINT}/api/Password/reset-password`,
        {
          email: confirmedEmail,
          otp,
          newPassword,
        }
      );
      
      setNotification({
        open: true,
        message: "Đặt lại mật khẩu thành công!",
        severity: "success"
      });
      
      setTimeout(() => navigate("/khotho/login"), 2000);
    } catch (error) {
      setNotification({
        open: true,
        message: "Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại!",
        severity: "error"
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${bgrLogin})`,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay',
        filter: 'brightness(1)',
        opacity: 0.85,
      }}
    >
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <div className="w-full max-w-md p-10">
        <div className="bg-white shadow-lg dark:bg-neutral-800 rounded-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <img
                className="mx-auto w-24"
                src="..\src\Assets\logokhotho.png"
                alt="logo"
              />
              <h4 className="mt-4 text-xl font-semibold">Quên Mật Khẩu</h4>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {step === 1 ? (
                <div className="input-container mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Nhập email của bạn"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/80"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="text-center mt-4">
                    <TERipple rippleColor="light" className="w-full">
                      <button
                        className="inline-block w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-lg transition duration-150 ease-in-out"
                        style={{
                          background:
                            "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                        }}
                        onClick={handleSendOTP}
                      >
                        Gửi mã OTP
                      </button>
                    </TERipple>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">
                      Đang gửi mã OTP đến email:{" "}
                      <strong>{confirmedEmail}</strong>
                    </p>
                  </div>
                  <div className="input-container mb-4">
                    <label className="input-label" htmlFor="otp">
                      Mã OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      placeholder="Nhập mã OTP"
                      className="input-field"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className="text-right mt-1">
                      <button
                        onClick={handleResendOTP}
                        className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'}`}
                        disabled={countdown > 0}
                      >
                        {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã OTP'}
                      </button>
                    </div>
                  </div>
                  <div className="input-container mb-4">
                    <label className="input-label" htmlFor="newPassword">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        className="input-field"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size="small"
                          style={{ color: '#666' }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <TERipple rippleColor="light" className="w-full">
                      <button
                        className="inline-block w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-lg transition duration-150 ease-in-out"
                        style={{
                          background:
                            "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                        }}
                        onClick={handleResetPassword}
                      >
                        Đặt lại mật khẩu
                      </button>
                    </TERipple>
                  </div>
                </>
              )}

              <div className="text-center mt-4">
                <a
                  onClick={() => navigate("/khotho/login")}
                  className="text-sm text-neutral-600 cursor-pointer hover:text-neutral-700 transition duration-150 ease-in-out"
                >
                  Quay lại đăng nhập!
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}