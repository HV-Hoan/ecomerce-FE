import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../css/UserLayout.css";

const UserLayout = () => {
    return (
        <div className="app-container">
            <nav className="sidebar">
                <h2 className="menu-title">User Menu</h2>
                <ul className="menu-list">
                    <li>
                        <Link to="/user/home" className="menu-link">Home</Link>
                    </li>
                    <li>
                        <Link to="/user/in4" className="menu-link">Thông tin User </Link>
                    </li>
                    <li>
                        <Link to="/user/category" className="menu-link">Loại sản phẩm</Link>
                    </li>
                    <li>
                        <Link to="/user/cart" className="menu-link">Giỏ hàng của bạn</Link>
                    </li>
                </ul>
            </nav>

            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default UserLayout;
