import React from "react";
import { Outlet } from "react-router-dom";

function SharedLayout() {
    return (
        <div>
            <header>Header dùng chung cho Admin và User</header>
            <Outlet />
        </div>
    );
}

export default SharedLayout;
