import React from 'react';
import { Outlet } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const RootLayout: React.FC = () => {
    return (
        <div className="root-container">

            {/*Main Content Area*/}
            <main className="main-content">
                <Outlet />
            </main>

            {/*Global Footer */}
            <footer className="app-footer">
                <p>
                    &copy; {new Date().getFullYear()} MutraPro
                    <span style={{ color: 'red', margin: '0 4px' }}>♥</span>
                    by <a href="#" className="footer-link">YourName</a>.
                </p>
                <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
                    Privacy Policy | Terms of Service
                </p>
                <ThemeToggle />
            </footer>
        </div>
    );
};

export default RootLayout;