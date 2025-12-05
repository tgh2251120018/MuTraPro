import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa6';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-main)', // Icon đổi màu theo theme
                fontSize: '24px',
                transition: 'transform 0.3s ease',
                zIndex: 1000,
            }}
            title="Toggle Dark Mode"
        >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
    );
};

export default ThemeToggle;