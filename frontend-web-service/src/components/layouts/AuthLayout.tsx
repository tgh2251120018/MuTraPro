import React, { type ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6 py-10">
            <div className="w-full max-w-4xl bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden flex">
                {/* [INSTRUCTION_B] Left side Image/Banner (Optional) - keeping it simple for now [INSTRUCTION_E] */}
                <div className="w-full p-8 md:p-12">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;