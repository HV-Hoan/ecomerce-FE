import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./LoginForm.css";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/login", {
                username,
                password,
            });

            const { token } = response.data;
            localStorage.setItem("token", token); // Lưu token vào localStorage

            // Giải mã token để lấy role
            const decoded = jwtDecode(token);
            if (decoded.role === "admin") {
                navigate("/admin"); // Chuyển hướng đến trang admin
            } else {
                navigate("/user"); // Chuyển hướng đến trang user
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("Lỗi kết nối đến máy chủ");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
