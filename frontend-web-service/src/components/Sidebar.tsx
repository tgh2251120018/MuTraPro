import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { FaChevronLeft, FaChevronRight, FaListCheck, FaChartPie } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom'; // Import NavLink

const Sidebar: React.FC = () => {
    const { user } = useContext(UserContext);
    const [isExpanded, setIsExpanded] = useState(true);

    const displayName = user?.fullName || "Guest User";
    const rawUsername = user?.username || (user?.email ? user.email.split('@')[0] : "unknown");
    const displayUsername = rawUsername.startsWith('@') ? rawUsername : `@${rawUsername}`;
    const role = user?.role || "GUEST";
    const avatarSrc = user?.profileImageUrl ? user.profileImageUrl : "/default_avatar.png";

    // Style chung cho Nav Item để tái sử dụng
    const navItemStyle = ({ isActive }: { isActive: boolean }) => ({
        padding: '10px',
        color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
        backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent', // Highlight khi Active
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        borderRadius: '8px',
        justifyContent: isExpanded ? 'flex-start' : 'center',
        textDecoration: 'none', // Xóa gạch chân của thẻ a
        transition: 'all 0.2s ease'
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

            <nav className="sidebar-nav">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    {/* NavLink Dashboard */}
                    <NavLink to="/dashboard" style={navItemStyle}>
                        <FaChartPie size={20} />
                        {isExpanded && <span style={{ fontSize: '14px', fontWeight: 500 }}>Dashboard</span>}
                    </NavLink>

                    {/* NavLink My Tasks (Placeholder) */}
                    <NavLink to="/tasks" style={navItemStyle}>
                        <FaListCheck size={20} />
                        {isExpanded && <span style={{ fontSize: '14px', fontWeight: 500 }}>My Tasks</span>}
                    </NavLink>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;