import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/LoginForm.css";

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

            const { accessToken } = response.data;
            localStorage.setItem("token", accessToken);  // Lưu token vào localStorage

            const decoded = jwtDecode(accessToken);

            alert("Đăng nhập thành công!");
            if (decoded.role === "admin") {
                navigate("/admin/home");
            } else {
                navigate("/user/home");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bại");
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Đăng nhập</button>
            </form>
            <p>Chưa có tài khoản? <button onClick={() => navigate("/register")}>Đăng ký</button></p>
        </div>
    );
};

export default LoginForm;
