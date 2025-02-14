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
                        <Link to="/admin" className="menu-link">Admin Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/admin/category" className="menu-link">Manage Categories</Link>
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
