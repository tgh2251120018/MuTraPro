import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {user ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h2 className="font-semibold text-blue-800 mb-2">Authenticated Successfully!</h2>
                            <p className="text-sm text-blue-600">You have been redirected here after login.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard label="User ID (Sub)" value={user.id} />
                            <InfoCard label="Role" value={user.role} />
                            <InfoCard label="Account Type" value={user.accountType} />
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded border border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Raw Token Data</h3>
                            <code className="block text-xs text-slate-600 break-all bg-slate-100 p-2 rounded">
                                {localStorage.getItem('access_token')}
                            </code>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-500">No user data found. Please login again.</p>
                )}
            </div>
        </div>
    );
};

// Component con để hiển thị thông tin
const InfoCard = ({ label, value }: { label: string, value: string }) => (
    <div className="border border-gray-200 p-4 rounded bg-gray-50">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="font-medium text-gray-900 mt-1">{value}</p>
    </div>
);

export default UserDashboard;