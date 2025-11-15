import React from 'react';

const Sidebar = ()=>{
  return (
    <aside className="sidebar">
      <div className="logo">MuTraPro</div>
      <nav className="nav">
        <a href="#">Dashboard</a>
        <a href="#">Requests</a>
        <a href="#">Tasks</a>
        <a href="#">Files</a>
        <a href="#">Studio</a>
        <a href="#">Payments</a>
        <a href="#">Notifications</a>
        <a href="#">Reports</a>
        <a href="#">Feedback</a>
      </nav>
    </aside>
  );
}

export default Sidebar;