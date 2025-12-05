import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { FaChevronLeft, FaChevronRight, FaUser, FaListCheck, FaChartPie, FaRightFromBracket } from 'react-icons/fa6'; // Import icon Logout
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate

const Sidebar: React.FC = () => {
    const { user, logout } = useContext(UserContext); // Lấy hàm logout từ Context
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();

    // --- LOGIC HIỂN THỊ INFO ---
    const displayName = user?.fullName || "Guest User";
    const rawUsername = user?.username || (user?.email ? user.email.split('@')[0] : "unknown");
    const displayUsername = rawUsername.startsWith('@') ? rawUsername : `@${rawUsername}`;
    const role = user?.role || "GUEST";
    const avatarSrc = user?.profileImageUrl ? user.profileImageUrl : "/default_avatar.png";

    // --- LOGIC LOGOUT ---
    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (confirm) {
            logout(); // Xóa token & state
            navigate('/login'); // Chuyển về trang đăng nhập
        }
    };

    // Style chung cho Nav Item
    const navItemStyle = ({ isActive }: { isActive: boolean }) => ({
        padding: '10px',
        color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
        backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        borderRadius: '8px',
        justifyContent: isExpanded ? 'flex-start' : 'center',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap' as const, // Ngăn text bị xuống dòng khi thu nhỏ
        overflow: 'hidden'
    });

    return (
        <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button
                className="sidebar-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
                {isExpanded ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
            </button>

            {/* --- USER INFO --- */}
            <div className="sidebar-header">
                <div className="user-avatar">
                    <img
                        src={avatarSrc}
                        alt="Avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                        onError={(e) => { e.currentTarget.src = "/default_avatar.png"; }}
                    />
                </div>

                <div className="user-info">
                    <h4 className="display-name">{displayName}</h4>
                    <p className="username" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {displayUsername}
                    </p>
                    <div style={{ marginTop: '4px' }}>
                        <span className="user-role">{role}</span>
                    </div>
                </div>
            </div>

            {/* --- MENU ITEMS --- */}
            <nav className="sidebar-nav">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    <NavLink to="/dashboard" style={navItemStyle} title="Dashboard">
                        <FaChartPie size={20} style={{ minWidth: '20px' }} />
                        {isExpanded && <span style={{ fontSize: '14px', fontWeight: 500 }}>Dashboard</span>}
                    </NavLink>

                    <NavLink to="/tasks" style={navItemStyle} title="My Tasks">
                        <FaListCheck size={20} style={{ minWidth: '20px' }} />
                        {isExpanded && <span style={{ fontSize: '14px', fontWeight: 500 }}>My Tasks</span>}
                    </NavLink>
                </div>
            </nav>

            {/* --- LOGOUT BUTTON (Nằm dưới cùng) --- */}
            <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '10px',
                        color: '#ef4444', // Màu đỏ cảnh báo
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        justifyContent: isExpanded ? 'flex-start' : 'center',
                        backgroundColor: 'transparent',
                        border: 'none',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}
                    title="Logout"
                    // Hiệu ứng hover inline: Nền đỏ nhạt
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <FaRightFromBracket size={20} style={{ minWidth: '20px' }} />
                    {isExpanded && <span style={{ fontSize: '14px', fontWeight: 600 }}>Logout</span>}
                </button>
            </div>

        </aside>
    );
};

export default Sidebar;