import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import "./css/App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout cho Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        {/* Layout cho Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/category" element={<CategoryPage />} />
          <Route path="/admin/product" element={<ProductPage />} />
        </Route>

        {/* Layout cho User */}
        <Route element={<UserLayout />}>
          <Route path="/user/home" element={<HomePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/user/category" element={<CategoryPage />} />
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
