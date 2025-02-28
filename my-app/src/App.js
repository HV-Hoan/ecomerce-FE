import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ShowDetail from "./components/ShowDetail";
import OrderForm from "./components/OrderForm";
//import AdminPage from "./pages/AdminPage";
// import UserPage from "./pages/UserPage";
import In4Page from "./pages/In4Page";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";

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
          <Route path="/product/:id_Product" element={<ShowDetail />} />
          <Route path="/confirm" element={<OrderForm />} />
        </Route>

        {/* Layout cho Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/home" element={<HomePage />} />
          {/* <Route path="/admin/in4" element={<AdminPage />} /> */}
          <Route path="/admin/in4" element={<In4Page />} />
          <Route path="/admin/category" element={<CategoryPage />} />
          <Route path="/admin/product" element={<ProductPage />} />
        </Route>

        {/* Layout cho User */}
        <Route element={<UserLayout />}>
          <Route path="/user/home" element={<HomePage />} />
          {/* <Route path="/user/in4" element={<UserPage />} /> */}
          <Route path="/user/in4" element={<In4Page />} />
          <Route path="/user/category" element={<CategoryPage />} />
          <Route path="/user/cart" element={<CartPage />} />
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
