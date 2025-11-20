import React from "react";
import "./Sidebar.css";

export default function Sidebar() {
    const menuItems = [
        "Dashboard", "Requests", "Tasks", "Files", "Studio",
        "Payments", "Notifications", "Reports", "Feedback"
    ];

    return (
        <div className="sidebar">
            <h1 className="logo">MuTraPro</h1>
            <ul className="menu">
                {menuItems.map(item => (
                    <li key={item} className="menu-item">{item}</li>
                ))}
            </ul>
        </div>
    );
}
