import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TEInput, TERipple } from "tw-elements-react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { API_ENDPOINT } from "../../../services/config";
import bgrLogin from "../../../Assets/bgr-login.jpg";
import "./Register.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const userData = {
      fullName,
      email,
      password,
      phoneNumber,
      address,
      userType: 1,
    };

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Auth/register`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response:", response);

      if (response.status === 200) {
        setNotification({
          open: true,
          message: "Đăng ký thành công!",
          severity: "success",
        });
        setTimeout(() => navigate("/khotho/login"), 2000);
      } else {
        setNotification({
          open: true,
          message: "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.",
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.",
        severity: "error",
      });
    }
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <img
                className="mx-auto w-24 h-24 object-contain"
                src="../src/Assets/logokhotho.png"
                alt="logo"
              />
              <h4 className="mt-4 text-2xl font-bold text-gray-800">
                VIỆC LÀM GẤP, THỢ TỚI TẤP
              </h4>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
              <p className="text-center text-gray-600">
                Vui lòng đăng ký tài khoản của bạn
              </p>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Nhập họ và tên"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/80"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/80"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/80 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="small"
                      style={{ color: "#666" }}
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </div>
                </div>
              </div>
              

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/80"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Nhập địa chỉ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/80"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              

              <div className="text-center mb-4">
                <TERipple rippleColor="light" className="w-full">
                  <button
                    className="inline-block w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-lg transition duration-150 ease-in-out"
                    style={{
                      background:
                        "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                    }}
                    type="submit"
                  >
                    Đăng ký
                  </button>
                </TERipple>
              </div>
            </form>

            <div className="flex items-center justify-between pb-6">
              <p className="mb-0 mr-2 text-sm">Bạn đã có tài khoản?</p>
              <TERipple rippleColor="light">
                <button
                  type="button"
                  className="inline-block rounded border-2 border-danger px-6 py-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600"
                  onClick={() => navigate("/khotho/login")}
                >
                  Đăng nhập
                </button>
              </TERipple>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}