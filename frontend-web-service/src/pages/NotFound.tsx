import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="layout-centered" style={{ flexDirection: 'column', textAlign: 'center' }}>

            {/* Số 404 Lớn */}
            <h1 style={{
                fontSize: '8rem',
                fontWeight: '800',
                color: 'var(--primary-color)',
                margin: 0,
                lineHeight: 1,
                textShadow: 'var(--shadow-effect)'
            }}>
                404
            </h1>

            {/* Thông báo lỗi */}
            <h2 style={{
                fontSize: '2rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                marginTop: '16px',
                marginBottom: '8px'
            }}>
                Page Not Found
            </h2>

            <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                maxWidth: '400px',
                lineHeight: '1.6'
            }}>
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            {/* Các nút điều hướng */}
            <div style={{ display: 'flex', gap: '16px' }}>
                <button
                    className="btn"
                    onClick={() => navigate(-1)}
                    style={{
                        border: '1.5px solid var(--border-color)',
                        color: 'var(--text-main)',
                        backgroundColor: 'transparent'
                    }}
                >
                    Go Back
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default NotFound;