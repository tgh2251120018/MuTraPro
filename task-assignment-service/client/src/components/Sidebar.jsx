import React from "react";
import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">MuTraPro</h2>

      <ul className="sidebar-menu">
        <li>Dashboard</li>
        <li>Requests</li>
        <li className="active">Tasks</li>
        <li>Files</li>
        <li>Studio</li>
        <li>Payments</li>
        <li>Notifications</li>
        <li>Reports</li>
        <li>Feedback</li>
      </ul>
    </div>
  );
}
