import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../css/AdminLayout.css";

const AdminLayout = () => {
    return (
        <div className="app-container">
            <nav className="sidebar">
                <h2 className="menu-title">Admin Menu</h2>
                <ul className="menu-list">
                    <li>
                        <Link to='/admin/home' className="menu-link">Home</Link>
                    </li>
                    <li>
                        <Link to="/admin/in4" className="menu-link">Thông tin Admin</Link>
                    </li>
                    <li>
                        <Link to="/admin/category" className="menu-link"> Quản lý loại sản phẩm</Link>
                    </li>
                    <li>
                        <Link to="/admin/product" className="menu-link"> Quản lý sản phẩm</Link>
                    </li>
                </ul>
            </nav>

            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
