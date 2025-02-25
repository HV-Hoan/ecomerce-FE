import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/RegisterForm.css"; // Đảm bảo file CSS tồn tại

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const sendOtp = async () => {
        setError("");
        setSuccess("");

        if (!email) {
            setError("Vui lòng nhập email trước khi gửi OTP!");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/send-otp", { email });
            setOtpSent(true);
            setSuccess("Mã OTP đã được gửi đến email của bạn.");
        } catch (err) {
            setError(err.response?.data?.message || "Không thể gửi OTP!");
        }
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otp) {
            setError("Vui lòng nhập mã OTP trước khi đăng ký!");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            // Xác thực OTP trước
            const otpResponse = await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
            if (!otpResponse.data.success) {
                setError("OTP không hợp lệ!");
                return;
            }

            // Nếu OTP đúng, gửi yêu cầu đăng ký
            await axios.post("http://localhost:5000/register", { username, email, password });
            setSuccess("Đăng ký thành công! Chuyển hướng đến đăng nhập...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại!");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Đăng ký</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type="button" onClick={sendOtp} disabled={otpSent}>Gửi OTP</button>
                    </div>
                    {otpSent && (
                        <div className="input-group">
                            <label>Nhập OTP:</label>
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        </div>
                    )}
                    <div className="input-group">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password:</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="register-btn">Đăng ký</button>
                </form>
                <p className="login-link">Đã có tài khoản?
                    <button className="login-btn" onClick={() => navigate("/login")}>Đăng nhập</button>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
