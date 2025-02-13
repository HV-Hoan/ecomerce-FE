import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout không có sidebar cho trang đăng nhập/đăng ký */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        {/* Layout cho Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/category" element={<CategoryPage />} />
        </Route>

        {/* Layout cho User */}
        <Route element={<UserLayout />}>
          <Route path="/user" element={<UserPage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
