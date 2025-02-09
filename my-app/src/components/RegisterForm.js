import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css"; // Đảm bảo file CSS tồn tại

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            await axios.post("http://localhost:5000/register", {
                username,
                password,
            });

            setSuccess("Đăng ký thành công! Chuyển hướng đến đăng nhập...");
            setTimeout(() => navigate("/login"), 2000); // Chuyển đến trang login sau 2 giây
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
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
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
