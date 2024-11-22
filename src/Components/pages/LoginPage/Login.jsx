import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import { Snackbar, Alert } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import bgrLogin from "../../../Assets/bgr-login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async () => {
    try {
      const userData = await authService.login(email, password);
      if (userData && userData.token) {
        localStorage.setItem("authToken", userData.token);
        localStorage.setItem("userType", userData.userType);
        localStorage.setItem("userData", JSON.stringify(userData));

        setNotification({
          open: true,
          message: "Đăng nhập thành công!",
          severity: "success",
        });

        setTimeout(() => {
          switch (userData.userType) {
            case 0: navigate("/khotho/dashboard"); break;
            case 1: navigate("/khotho/jobs"); break;
            case 2: navigate("/khotho/workers"); break;
            default: navigate("/");
          }
        }, 1000);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data || "Lỗi đăng nhập! Vui lòng thử lại.",
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

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <p className="text-center text-gray-600">
                Vui lòng đăng nhập vào tài khoản của bạn
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/80"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10 bg-white/80"
                      placeholder="Nhập mật khẩu của bạn"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
                      
              <button
                className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300"
                onClick={handleLogin}
              >
                Đăng nhập
              </button>

              <div className="text-center mt-4">
                <a
                  onClick={() => navigate("/forgot-password")}

                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Quên mật khẩu
                </a>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">Bạn chưa có tài khoản?</p>
                <button
                  className="px-4 py-2 text-sm font-medium text-pink-500 border-2 border-pink-500 rounded-lg hover:bg-pink-50 transition-colors duration-300"
                  onClick={() => navigate("/khotho/register")}
                >
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;