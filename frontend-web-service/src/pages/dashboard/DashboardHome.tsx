import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { FaChartPie } from 'react-icons/fa6';

const DashboardHome: React.FC = () => {
    const { user } = useContext(UserContext);

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                    Dashboard
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                    Welcome back, {user?.fullName || 'User'}! Here's your overview.
                </p>
            </div>

            <div className="card">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-app)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                    }}>
                        <FaChartPie size={24} color="var(--primary-color)" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                        No Data Yet
                    </h3>
                    <p style={{ fontSize: '14px', margin: 0 }}>
                        Your dashboard widgets will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;