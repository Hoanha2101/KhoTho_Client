import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TEInput, TERipple } from "tw-elements-react";
import "./Register.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    const userData = { fullName, email, password, phoneNumber, address, userType: 1 };

    try {
      const response = await axios.post("https://localhost:7062/api/Auth/register", userData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        setError("Lỗi đăng ký: " + response.data.message);
      }
    } catch (error) {
      setError("Đã xảy ra lỗi: " + error.message);
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

            <form onSubmit={handleRegister}>
              <p className="mb-4 text-center">Vui lòng đăng ký tài khoản mới</p>

              <div className="input-container mb-4">
                <label className="input-label" htmlFor="fullName">Họ và tên</label>
                <TEInput
                  type="text"
                  id="fullName"
                  placeholder="Nhập họ và tên"
                  className="input-field"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="input-container mb-4">
                <label className="input-label" htmlFor="email">Email</label>
                <TEInput
                  type="email"
                  id="email"
                  placeholder="Nhập email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-container mb-4">
                <label className="input-label" htmlFor="password">Mật khẩu</label>
                <TEInput
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="input-container mb-4">
                <label className="input-label" htmlFor="phoneNumber">Số điện thoại</label>
                <TEInput
                  type="text"
                  id="phoneNumber"
                  placeholder="Nhập số điện thoại"
                  className="input-field"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="input-container mb-4">
                <label className="input-label" htmlFor="address">Địa chỉ</label>
                <TEInput
                  type="text"
                  id="address"
                  placeholder="Nhập địa chỉ"
                  className="input-field"
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

              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>

            <div className="flex items-center justify-between pb-6">
              <p className="mb-0 mr-2 text-sm">Bạn đã có tài khoản?</p>
              <TERipple rippleColor="light">
                <button
                  type="button"
                  className="inline-block rounded border-2 border-danger px-6 py-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600"
                  onClick={() => navigate("/login")}
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
