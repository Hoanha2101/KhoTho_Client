import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TEInput, TERipple } from "tw-elements-react";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://localhost:7062/api/Auth/login", {
        email,
        password,
      });
  
      if (response.data && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        alert("Đăng nhập thành công!");
        navigate("/customer");
      } else {
        setErrorMessage("Đăng nhập thất bại! Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      setErrorMessage("Lỗi khi đăng nhập! Vui lòng thử lại.");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-neutral-200 dark:bg-neutral-700">
      <div className="w-full max-w-md p-10">
        <div className="bg-white shadow-lg dark:bg-neutral-800 rounded-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <img
                className="mx-auto w-24"
                src="..\src\Assets\logokhotho.png"
                alt="logo"
              />
              <h4 className="mt-4 text-xl font-semibold">VIỆC LÀM GẤP, THỢ TỚI TẤP</h4>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <p className="mb-4 text-center">Vui lòng đăng nhập vào tài khoản của bạn</p>

              {/* Email input */}
              <div className="input-container mb-4">
                <label className="input-label" htmlFor="email">Email</label>
                <TEInput
                  type="text"
                  id="email"
                  placeholder="Nhập email của bạn"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password input */}
              <div className="input-container mb-4">
                <label className="input-label" htmlFor="password">Mật khẩu</label>
                <TEInput
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu của bạn"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit button */}
              <div className="text-center mb-4">
                <TERipple rippleColor="light" className="w-full">
                  <button
                    className="inline-block w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-lg transition duration-150 ease-in-out"
                    style={{
                      background:
                        "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                    }}
                    onClick={handleLogin}
                  >
                    Đăng nhập
                  </button>
                </TERipple>
                <a href="#!" className="text-sm text-neutral-600 mt-2 inline-block">Quên mật khẩu?</a>
              </div>

              {/* Register button */}
              <div className="flex items-center justify-between pb-6">
                <p className="mb-0 mr-2 text-sm">Bạn chưa có tài khoản?</p>
                <TERipple rippleColor="light">
                  <button
                    type="button"
                    className="inline-block rounded border-2 border-danger px-6 py-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600"
                    onClick={() => navigate("/register")}
                  >
                    Đăng kí
                  </button>
                </TERipple>
              </div>
            </form>

            {/* Error message */}
            {errorMessage && (
              <p className="text-red-500 text-center mt-4">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
