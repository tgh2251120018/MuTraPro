import React from 'react';
import { Outlet } from 'react-router-dom';


const AuthLayout: React.FC = () => {
    return (
        <div className="layout-centered">
            <div className="card w-auth">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;