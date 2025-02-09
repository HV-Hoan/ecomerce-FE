import React from "react";
import "./LoginForm.css";

const LoginForm = () => {
    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            <form>
                <label>Username:</label>
                <input type="text" name="username" />

                <label>Password:</label>
                <input type="password" name="password" />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
